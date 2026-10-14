---
slug: "crud-to-workflow-engine"
title: "From CRUD to a workflow engine: state, actors and irreversible effects"
description: "Model commands, permissions, concurrency and external effects when several people and services share a business process."
date: "2026-10-13"
updatedAt: "2026-10-14"
contextDate: "2024-04-18"
tags:
  - System design
  - State machines
  - Backend engineering
---

A product starts with an application form and a status column. Then a reviewer must approve it, finance must collect payment, an applicant can withdraw, and support must reopen a rejected case. Two people can act at once. Payment confirmation arrives later, sometimes twice.

At that point, allowing an API client to update `status` is an architectural liability. The product has commands with preconditions, actors with different authority, and effects that cannot be undone by changing a row back to its previous value.

The useful transition from CRUD to a workflow engine is making those rules explicit and executable. A state-machine library can help describe them. It does not supply transaction boundaries, authorization or recovery semantics on its own.

This article uses a hypothetical approval-and-payment process. The [runnable transition example](https://github.com/Israel-oduguwa/israel-oduguwa/tree/main/examples/engineering-series) tests actor restrictions and version conflicts. The database designs are illustrative PostgreSQL 16 SQL, with persistence responsibilities stated separately from the pure function.

## Model what an actor is asking to do

An endpoint such as `PATCH /applications/:id` with `{status: "active"}` gives the caller too much responsibility. The server has to infer whether the caller means approval, payment confirmation, administrative repair or migration.

Use a command whose meaning is stable: submit, approve, request_changes, withdraw or confirm_payment. A command carries an expected version, an operation identity and the input needed for that decision. The authenticated actor comes from trusted server context. A caller cannot become a payment service by including a role in JSON.

Separate the current state from the command and the resulting event. “Approve” is an intention that may be rejected. “Application approved” is a fact accepted by the system. “Request payment” is an effect intent that still needs delivery. Combining all three in a single status string makes both auditing and recovery harder.

Here is the main path:

```text
draft --submit by applicant--> review
review --approve by another reviewer--> payment_pending
payment_pending --verified payment confirmation--> active

review --request changes--> changes_requested --resubmit--> review
review --reject--> rejected
```

The diagram is incomplete until cancellation and failure are considered. A withdrawn application with an already completed charge may require a refund workflow. Returning to `draft` does not refund anything. Keep financial state explicit rather than using a status transition to imply an external reversal.

## Write invariants before drawing every arrow

A transition graph shows reachability. Invariants describe what must remain true across every reachable state and every execution path.

For this process, I would specify that an applicant cannot approve their own application; a reviewer can act only within the application tenant; activation requires verified payment evidence; a command applies to one version; and a repeated payment request retains its operation identity.

These are different kinds of rules. Actor restrictions belong in authorization. Expected-version checks protect concurrency. Payment evidence concerns external state. A transition needs all of them, but the implementation should make each responsibility visible.

Distinguish global invariants from local preconditions. “The application is in review” is a precondition for approval. “An application cannot have two current payment attempts with the same business purpose” may require a database uniqueness constraint. A function that reads first and writes later cannot protect that invariant across concurrent requests without database enforcement.

The state graph should also define terminal states and repair operations. Support staff need explicit commands with reason codes and audit trails. An unrestricted administrator update bypasses the model precisely when the situation is most difficult to reconstruct.

## Keep the transition decision pure

A transition function should decide the next state and required effect intents without making network calls. It can be deterministic over the current snapshot, command and actor. That makes its rules reviewable and its edge cases easy to exercise.

The core approval branch from the executable example is:

```javascript
case 'approve':
  if (current.status !== 'review' ||
      actor.role !== 'reviewer' ||
      actor.id === current.applicant) {
    throw new Error('invalid transition');
  }
  next = 'payment_pending';
  effects = [{
    type: 'request_payment',
    operationId: `${current.id}:payment:1`,
  }];
  break;
```

Before this branch, the function checks tenant ownership and the expected version. Its return value contains a new state with an incremented version and a list of effects. The original snapshot remains unchanged.

The fixed `payment:1` purpose identifies one payment attempt in this teaching example. A real product with replacement attempts needs a persisted attempt identifier and explicit rules for when a new attempt is allowed. Generating a fresh identifier every time a worker retries would defeat idempotency.

Purity does not make the system race-free. Two requests can both read version 3 and independently produce version 4. Only the persistence layer can decide which result becomes authoritative.

## Commit state, audit and effect intent together

Use a transaction to conditionally update the workflow and insert its audit record and outbox intents. A sketch of the ownership check is:

```sql
UPDATE applications
SET status = $1, version = version + 1
WHERE id = $2
  AND tenant_id = $3
  AND version = $4
RETURNING version;
```

If no row is returned, the snapshot is stale or the row is unavailable to this actor. Do not continue inserting effects. Roll back and return a conflict or a suitably scoped not-found response. Reloading and automatically applying an approval may be wrong if the other request withdrew the application; retry the decision only when its semantics permit it.

Insert the audit event and outbox message in the same transaction as that successful update. Put a unique constraint on the command identity within the tenant and business operation. Store a request fingerprint so reusing the identity with different input becomes a conflict rather than an accidental replay.

PostgreSQL's [transaction isolation documentation](https://www.postgresql.org/docs/16/transaction-iso.html) is relevant here: at Read Committed, separate statements can observe different committed snapshots. An application-level read followed by an unconditional update is not equivalent to a conditional write. Stronger isolation can detect additional anomalies, but callers must still handle aborted transactions and uncertain external outcomes.

Store the command result durably if clients need to retrieve it after a timeout. An accepted command may have committed even when the response was lost. Returning that recorded result on replay is more useful than requiring a client to infer success from the current status.

## Deliver external effects without claiming atomicity across systems

An outbox closes the gap between committing local state and remembering to perform an external action. It does not make the external action part of the database transaction.

```text
database transaction
  application version + audit event + outbox intent
                 |
                 v
worker claims intent -> calls provider -> records outcome
                 |
                 v
reconciliation checks uncertain outcomes
```

If a worker crashes after a provider accepts a request but before the outcome is saved, the next worker faces uncertainty. Use the stable operation identity where the provider supports idempotency, retain provider references, and reconcile rather than assume the effect did not happen.

Leases help recover abandoned work. They are not proof that an old worker has stopped executing. If stale workers can write outcomes after their lease expires, use a fencing token or a conditional update on the current ownership generation. The provider may not understand your fencing token; the integration must still prevent duplicate business effects through operation identity and provider-specific guarantees.

Classify failures by the next legitimate action. A temporary network failure may be retried within a budget. An invalid payment method may require the applicant. A confirmed charge followed by a fulfillment failure requires recovery or compensation. Calling all of these `failed` forces operators to reconstruct meaning from logs.

## Model parallel responsibilities without multiplying states

Once finance and compliance can work independently, a flat status enum can become a cross-product: finance_pending_compliance_pending, finance_done_compliance_pending, and so on.

Separate orthogonal state when the responsibilities really are independent. An application can have a review state, payment state and compliance state, with activation derived from their accepted conditions. Define which transition coordinates them and which consistency boundary protects that decision.

Avoid splitting state merely to reduce the number of enum values. If payment and activation must change together locally, they may belong in one transaction. If compliance evidence arrives from another service, the product must tolerate and explain the interval before it is applied.

Time is also an input. Approval expiration and payment deadlines need scheduled commands with recorded deadlines, not invisible background updates. A timer delivered twice must behave safely. A delayed timer must check current state before taking action. The deadline's meaning should survive a worker restart and a change in scheduling technology.

## Version the workflow as a public contract

Workflow definitions change while old instances remain active. A new compliance step may apply only to new applications; another change may legally or operationally require migration of existing cases. That decision belongs in the product policy and migration plan.

Record the workflow definition version with an instance when behavior depends on it. Keep old transition logic until its active population reaches a supported terminal state or is explicitly migrated. An enum change in the frontend is not a migration strategy.

Events need schema versions too. Consumers should tolerate additive fields and distinguish unknown event types from malformed known events. Define what happens when a delayed event from an older payment attempt reaches a newer application state. It should be correlated to the attempt it concerns, not interpreted as evidence for whichever attempt happens to be current.

Use compatibility tests built from historical event fixtures. They should verify business interpretation, not just JSON deserialization. A field can keep the same type while its meaning changes.

## A refund after withdrawal is another workflow

Consider this history: a reviewer approves an application, the payment provider accepts the charge, the applicant withdraws, and only then does the payment confirmation arrive. There is no useful answer in the phrase “the latest event wins.” Withdrawal and payment describe different facts. Both can be true.

Record the payment against its persisted attempt, even when the application is now withdrawn. Then let an explicit policy decide whether to refund, retain a fee or request review. A refund command creates a new operation with its own identity, amount, authorization and recovery state. It must not erase the charge record or reinterpret the confirmation as a failed payment.

![A committed workflow decision records an effect before a worker contacts the provider](/images/articles/workflow-effects.svg)

This separation changes support tooling. An operator should be able to see that the application was withdrawn, attempt P17 succeeded, and refund R4 is awaiting confirmation. A single `failed` label hides all three. A repair action should target R4 with a reason and current expected version, rather than resetting the whole application to a previous state.

Compensation also needs a business definition. Sending another API request can reverse an amount, but it may not reverse fees, taxes, notifications or a service already delivered. The workflow should record what the reversal promises and what remains unresolved. When automatic compensation is inappropriate, route the case to a bounded review queue with a named owner and an age objective.

## Put command identity in the storage contract

An expected version protects a particular snapshot. An operation identity protects a particular intention across attempts. They should not be substituted for each other. A client may repeat the same command after losing its response, by which time the workflow version has already advanced because that command succeeded.

In that case, look up the admitted command identity before deciding that the old version makes the request invalid. If the recorded fingerprint matches, return the recorded command result. If it differs, reject the identity reuse. If no record exists, authorize and evaluate the command against its expected version, then insert the identity and outcome atomically with the state change.

The uniqueness scope deserves a design review. A key scoped only to an actor can collide across several workflows. A globally supplied key without tenant scope can reveal another customer's operation. A useful storage identity includes tenant, workflow and command purpose, together with the caller's stable key. PostgreSQL's [constraint reference](https://www.postgresql.org/docs/16/sql-createtable.html) defines how the database enforces the resulting uniqueness; the product determines the scope and reuse policy.

Store enough of the result to answer a replay correctly. “Already processed” is ambiguous if the caller needs the payment-attempt reference created by the first request. Retention matters too: once an identity record is removed, an old client retry can be admitted again. Set a retention period against the maximum replay horizon, and use durable business constraints where repetition must remain impossible after that horizon.

## Test the transition system as a history generator

A table of allowed arrows catches local mistakes. A history generator can exercise combinations nobody thought to put in the table. Start with a valid instance, select from both allowed and forbidden commands, and check invariants after every accepted transition. Keep the rejected command in the trace so a failure remains reproducible.

For this example, useful properties include an increasing version, no cross-tenant transition, no self-approval, no activation without payment evidence, and no second effect intent for a replayed command. Generate actor changes and duplicate delivery explicitly. A generator that always supplies the correct actor tests reachability while avoiding the authorization boundary.

The persistence tests should control two concurrent commands at the read/write boundary. Let both read version 3, commit one, then allow the other conditional update. Assert one accepted change and one conflict, with one audit event and one effect intent. Repeat with the same operation identity and matching input; that history should produce one business decision and a replayed result. These are different concurrency cases.

Finally, inject interruption between local commit and external delivery, then between remote acceptance and local outcome recording. AWS's [outbox guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html) discusses the local state/message gap and duplicate processing. Use the actual database and provider contract for the integration tests. A pure transition function can demonstrate the decision rule; only the connected persistence path can demonstrate atomic admission and recovery.

## Test histories and make stalled work visible

Test authorized and forbidden commands from each relevant state, including the same actor occupying several roles. Test two commands using the same expected version, a duplicate command with the same fingerprint, and a reused identity with different input.

Then test histories: approve, withdraw, receive a delayed payment confirmation; request payment, lose the response, retry; expire a deadline while another actor is editing. These histories reveal behavior that a matrix of isolated transition tests misses.

The executable example verifies that self-approval and cross-tenant approval fail, an accepted approval emits a stable intent, the input snapshot is unchanged, and replaying a stale expected version fails. It does not implement database persistence or prove provider-side payment safety. Those boundaries need integration tests with the actual storage and provider contract.

Operational views should expose the age of work waiting for a decision or effect, outbox delivery age, uncertain payment attempts and commands rejected for version conflicts. Give support staff a safe repair command and the evidence behind it. A workflow engine earns its complexity when a team can explain why a case is waiting, who can move it forward, and which effects have already happened.
