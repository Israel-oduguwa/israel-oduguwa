---
slug: "useful-architecture-decision-records"
title: "Architecture decision records that support the next decision"
description: "Record the constraints, rejected alternatives and revisit conditions that future engineers need when an architecture choice changes."
date: "2026-10-13"
updatedAt: "2026-10-14"
contextDate: "2024-01-25"
tags:
  - Documentation
  - Architecture decisions
  - Technical leadership
---

An engineer finds a queue between two modules and asks why a local function call was not enough. The code shows how the queue works. A diagram shows where it sits. Neither explains the requirement that made asynchronous delivery worth its operational cost.

A useful architecture decision record preserves that explanation. It should let the next engineer decide whether the original constraints still hold and what would be endangered by reversing the choice.

The record is small because it describes one significant decision. Its depth comes from the quality of the evidence and tradeoffs, not from a long inventory of architecture terminology.

## Record the decision while alternatives are still visible

Write a proposed record before the team commits to the implementation. The act of stating the context often reveals that people are solving different problems. One person wants lower latency, another wants independent deployments, and a third wants recovery after a provider outage.

Name the decision's owner and the people whose constraints it affects. A record can support discussion without requiring a large committee for every change. The approval process should match the significance and reversibility of the choice.

Michael Nygard's [2011 ADR proposal](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) uses a compact structure with context, decision, status and consequences, retaining superseded records. That format remains useful. I would add concrete evidence and revisit conditions when they help the next decision, rather than expand every record into a specification.

Choose decisions with lasting consequences: data ownership, consistency boundaries, authentication strategy, a major external dependency or deployment topology. A routine rename usually belongs in the change itself. Recording everything can make the important decisions harder to find.

## Make context specific enough to change the answer

“We need a scalable system” does not constrain a design. “Exports can take several minutes, may be retried after worker loss, and must not consume the interactive API's request slots” does.

Separate observations from assumptions. An observed provider timeout rate belongs with its measurement period and workload. A forecast of next year's volume belongs as a forecast with uncertainty. A hard customer deadline belongs as a requirement with an owner.

Include organizational context when it affects the choice. A team that already operates a message broker faces a different incremental cost from a team adopting one for a single job. Avoid presenting that difference as a universal technical advantage.

Record the problem's scope. If the decision applies only to exports, it should not silently require every command to use a queue. Explicit scope prevents a local solution from becoming an accidental organization-wide rule.

## State the decision as behavior and ownership

A weak decision says “Use a queue.” A stronger one says which service accepts the job, where acceptance is persisted, how workers claim it, and what the client receives.

The implementation details can live elsewhere, but the decision needs enough semantics to constrain them. A broker message sent after a database commit and a transactional outbox are not equivalent if losing accepted work is unacceptable.

Prefer active statements that can be checked. “The API will persist the job and its dispatch intent in one transaction” gives reviewers a concrete obligation. “The design improves reliability” describes an aspiration without evidence.

Keep the rejected alternatives visible. Explain why they do not satisfy the current constraints or why their cost is not justified. Do not manufacture weak alternatives merely to make the preferred option look inevitable.

## A worked record for asynchronous exports

The following is an illustrative ADR for a hypothetical application. Its workload assumptions are examples, not measured production facts.

```text
ADR 0012: Accept exports through a durable job record
Status: Proposed
Owner: Reporting team
Date: 2024-01-25

Context
An export may take longer than an interactive request deadline.
The product must preserve an accepted export after API or worker loss.
Bulk work must not exhaust the interactive database connection budget.
The team already operates PostgreSQL and a bounded worker deployment.

Decision
The API will persist an export job and outbox intent in one transaction.
It will return the durable job ID after that transaction commits.
Workers will claim jobs with recoverable ownership and bounded concurrency.
Results will be private objects linked to the job's tenant and expiry policy.
Clients will retrieve progress and outcome by job ID.

Alternatives
Synchronous execution keeps fewer components but holds request resources
and cannot satisfy the stated completion and recovery requirements.
An in-memory background task loses accepted work on process termination.
A broker-only acceptance path requires a separate consistency design for
job visibility and ownership; it is not needed for the current workload.

Consequences
The system gains a recoverable acceptance record and a separate bulk budget.
The team owns job state, leases, duplicate delivery and reconciliation.
The UI must represent pending, failed and expired results.
Support needs a safe retry command and an audit trail.

Verification
Terminate a worker during execution and verify recovery by another worker.
Lose the API response after commit and retrieve the same job by operation ID.
Verify that duplicate delivery creates one published result.
Run bulk exports while measuring the protected interactive workload.

Revisit
Review if job claim contention or dispatch lag misses the completion objective.
Review if another consumer requires independent event delivery guarantees.
Review if storage or retention policy changes the result-access contract.
```

The record does not claim that leases provide exactly-once execution. It names duplicate delivery and reconciliation as responsibilities. A detailed worker protocol can specify fencing, checkpoints and result publication separately.

## Describe consequences without selling the choice

A consequence is something the team will have to live with. Include extra infrastructure, failure modes, support work and constraints on future changes alongside the benefit.

For a queue, eventual progress visibility and duplicate delivery are consequences. For a shared database, local transactions are a benefit while schema coordination is a cost. For a managed identity provider, operational delegation is a benefit while vendor dependency and migration complexity remain.

Make consequential uncertainty explicit. If the decision assumes that a library supports a required deployment mode, verify it or mark the assumption as unresolved before acceptance. A necessary methodological limit is useful documentation; a paragraph of vague hedging is not.

Link to supporting measurements, prototypes, contracts and incident evidence. Summarize the relevant result so the record remains understandable if a dashboard link expires. Preserve sensitive evidence in an appropriately controlled location rather than copying private data into a public repository.

## Connect the decision to implementation and review

Store the record near the code or in a searchable repository of decisions. Give it a stable identifier. Link relevant changes to the record so reviewers can check whether the implementation satisfies it.

Turn the important obligations into tests or operational signals. If an ADR requires private export results, test another tenant's download attempt. If it requires recovery after worker loss, run that exercise. A record without verification can become architecture folklore.

Do not put all implementation details in the ADR. Configuration values, deployment procedures and API field descriptions change at different rates. Link their authoritative documents and keep the ADR focused on why those mechanisms exist.

Reviewers should be able to distinguish a change within the accepted decision from a change that alters it. Switching a queue library may preserve the contract; removing the durable job record changes acceptance semantics and deserves a new decision.

## Supersede records when the context changes

An accepted ADR is not permanent law. When a new requirement or measured limit changes the answer, write a replacement and link both directions. Keep the old record with a superseded status so historical behavior remains explainable.

Do not rewrite an old decision to make it look as though the team always knew the new answer. Preserve the evidence available at the time. A later incident can add a linked follow-up without erasing the original reasoning.

Revisit conditions should be observable. “When we need more scale” is weak. “When dispatch lag misses the accepted job objective under the measured peak workload” tells the team what to monitor. Avoid arbitrary numeric thresholds without a workload or business basis.

Temporary architecture needs retirement conditions too. A compatibility adapter should identify which consumers must migrate and how their disappearance will be verified. Otherwise, a transitional decision can remain indefinitely because nobody owns its removal.

## Link the record to evidence without turning it into a dashboard

The export ADR requires bulk work to preserve interactive capacity. Link the retained load-test artifact with its workload, environment and configuration, then summarize the result in the record. A chart URL alone is weak evidence: its time window can change, access can disappear, and the plotted series may no longer describe the configuration that was accepted.

Give each important claim an evidence type. A product deadline is an approved requirement. A prototype duration is a measured result with a workload. A forecast is an assumption. A provider guarantee is a versioned external contract. Those distinctions help a reviewer decide which disagreement needs a product answer and which needs another experiment.

Keep private incident and customer evidence in its controlled location. The public record can summarize the accepted constraint without copying account identifiers, personal data or internal logs. Privacy and reproducibility can coexist when the evidence has an owner, access policy and a stable summary of what it established.

At KinsCare I guided seven developers through system design and code review. That kind of team work makes the reason behind a boundary valuable: a later contributor needs to understand whether a queue protects recovery, isolates bulk capacity or merely reflects an old implementation choice. The record should make those questions answerable without requiring the original author in every review.

## Record disagreement precisely enough to resolve it

Two engineers can agree on the goal and disagree about the failure model. One assumes a worker can safely retry an external call; another knows the response can be lost after acceptance. Write that unresolved condition into the proposed decision and identify the evidence required. A small provider experiment or contract review can settle it more effectively than another general debate about queues.

Similarly, separate reversible implementation choices from irreversible commitments. Trying a queue library behind an internal contract is different from making its proprietary message format the public integration API. The latter affects consumers and migration cost. The record should identify that commitment and the compatibility obligation before acceptance.

Preserve rejected alternatives in their strongest relevant form. A synchronous design with bounded duration might work for small exports; it fails the stated multi-minute accepted-work requirement. That explanation is useful. Calling it “unscalable” is not, because it hides the condition under which it could become the better choice again.

## A revisit trigger needs an owner and a next action

“Review dispatch lag” is only an invitation. Record who observes it, which job population matters, what objective has been agreed, and what happens if the condition is met. The action might be investigating claim contention or testing a separate dispatcher, rather than immediately replacing the architecture.

Keep the trigger tied to the problem that justified the decision. If the original choice protected interactive capacity, measure that capacity under bulk demand. A rising count of queued jobs may simply reflect more successful admissions; job age and delivered outcomes tell a different story.

When a trigger fires, add a new proposed record with current evidence. Link it to the earlier decision, preserve the earlier assumptions, and test the replacement's failure behavior. This gives a future engineer a history of decisions the system actually made, rather than a rewritten explanation that implies the final design was inevitable.

## Judge the record by the questions it helps answer

A new engineer should be able to learn what problem the decision solved, which constraints mattered, what alternatives were considered, and what would justify changing it. An operator should be able to find the obligations that matter during failure.

Keep the writing concrete. Replace “highly scalable and robust architecture” with the accepted-work boundary and recovery behavior. Replace “future-proof” with the compatibility period and revisit trigger. These edits improve technical precision as well as readability.

The record has succeeded when it reduces the amount of history someone must reconstruct before making the next change. Its purpose is to preserve judgment in a form another engineer can inspect and, when the evidence changes, revise.
