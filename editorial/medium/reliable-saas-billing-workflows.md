# SaaS billing as a financial workflow: changes, entitlements and reconciliation

Separate commercial agreements, invoices, payments and access while handling plan changes, duplicate events and uncertain outcomes.

This article was written with AI assistance. Sources and example verification are linked where relevant.

Technical context: 2026-01-22. Published 2026-10-13; the context date describes the technical era examined.

A customer upgrades midway through a billing period while the current invoice is unpaid. The payment provider creates a credit and a new charge. A webhook arrives twice, an older subscription event arrives later, and the application's `isPaid` flag no longer explains what access the customer should have.

Billing becomes difficult when several different facts are collapsed into one boolean. A commercial agreement, invoice, payment attempt, credit, refund and entitlement have different lifecycles. They must be connected without pretending that they are the same record.

I would design billing as an auditable workflow with explicit acceptance, external effects and reconciliation. This article uses Stripe as the provider example and established behavior relevant to January 2026. API versions and webhook schemas must be pinned and verified in the integration; illustrative code below is not a complete Stripe application.

## Separate the agreement from collection and access

The commercial agreement defines what the customer bought: product, quantity, price, currency, billing interval, discounts and effective dates. An invoice requests or records payment for a period or adjustment. A payment attempt has its own success, failure and authentication requirements.

Entitlements define what the application currently permits: features, limits, seats and access period. They derive from the agreement and the product's collection policy, including trials, grace periods and contractual exceptions.

```text
commercial agreement
    -> invoice and adjustments
    -> payment attempts and settlement evidence
    -> entitlement policy
    -> application access

refunds / disputes / cancellation can change parts of this history
```

An active subscription does not necessarily mean every invoice has been paid. A paid invoice does not automatically define every future entitlement. Keep the policy explicit so support can explain why access exists or was suspended.

Use durable provider mappings scoped to the correct customer and account context. A client-supplied provider customer ID must not select another tenant's billing records. Choose the mapping server-side after authorization.

## Model a plan change as a command with an effective time

A plan change includes more than a new price ID. Specify when it takes effect, whether unused time is credited, when additional charges are collected, how seat limits change, and what happens if payment requires action or fails.

Validate the command against current agreement state. Use an operation identity and request fingerprint so retrying a lost response does not create a second change. Record the requested policy and provider references before interpreting later events.

Preview the financial consequence through the provider's supported mechanism and use consistent inputs when applying it. A preview based on one timestamp and an update applied later can differ. Explain the estimate's meaning to the customer rather than presenting it as a settled charge.

Stripe's [proration documentation](https://docs.stripe.com/billing/subscriptions/prorations) distinguishes proration adjustments from immediate collection or refund. Negative prorations are not automatically cash refunds, and positive prorations are not automatically billed immediately. That distinction belongs in the product's change policy.

The unpaid-invoice case needs special treatment. A credit for unused service can be calculated on the assumption that the earlier invoice will be paid. Decide whether to disable prorations, collect a separate adjustment or use another supported policy. Do not credit unpaid time accidentally and then describe it as a refund.

## Keep entitlements explainable and versioned

Define the entitlement policy independently of provider event names. For example: a trial permits a limited feature set until a deadline; a collected renewal extends a period; a failed renewal may enter a grace period; a terminated agreement revokes future access while preserving records.

These are illustrative rules, not universal billing policy. Enterprise contracts, manual collection and regulatory requirements may change them. Product and commercial owners must agree on the behavior before engineering encodes it.

Store the evidence behind an entitlement decision: agreement version, relevant invoice or payment evidence, policy version, effective period and any authorized override. A support agent should not need to infer access from a dozen webhook logs.

Apply entitlements on the server for protected operations. Hiding a feature in the UI is not enforcement. Cache decisions only with a defined staleness and revocation policy, and include tenant and feature scope.

Handle downgrades with existing data. If the new plan allows fewer seats or less storage, specify whether excess resources are blocked, preserved read-only or removed through an explicit process. A billing event should not silently delete customer data.

## Treat webhooks as authenticated, replayable notifications

Verify the webhook signature using the raw request body and the endpoint's signing secret. Parsing and reserializing JSON changes the signed bytes. Stripe's [webhook documentation](https://docs.stripe.com/webhooks) documents this requirement and warns that delivery order is not guaranteed.

Persist an authenticated event into an inbox before acknowledging it as accepted for processing. Use a unique provider-event identity to handle duplicate delivery. Acknowledge promptly after durable acceptance, then process through bounded workers if business work is expensive.

```javascript
const event = stripe.webhooks.constructEvent(
  rawBody,
  signature,
  signingSecret,
);

await inbox.insertOnce({
  provider: 'stripe',
  eventId: event.id,
  type: event.type,
  payload: event,
});

return new Response('', { status: 200 });
```

`stripe`, `inbox`, body acquisition and error mapping are integration boundaries in this sketch. If durable storage fails, returning success would lose the accepted notification. Signature failure should not enqueue business work. Store sensitive payloads with appropriate access and retention controls.

Duplicate event delivery and duplicate business effects are different problems. Two distinct events can describe the same underlying invoice or payment. The domain must enforce one accepted effect per business purpose, using provider-object identity and local operation records where appropriate.

## Do not use delivery order as the state machine

An old subscription notification can arrive after a newer one. Applying every payload as “current state” can reverse a cancellation or plan change. Event creation timestamps are not a reliable total-order or deduplication key.

Use events to trigger synchronization or to record immutable financial facts according to their semantics. Retrieve the relevant current provider objects when needed, and process a customer's state changes through controlled ownership. Protect local projection writes against stale workers.

Fetching current state alone is not enough. Worker A can fetch an older snapshot, worker B can fetch a newer one, and A can commit last. Serialize or fence projection ownership and define how subsequent events and periodic reconciliation repair state that changes after a fetch.

There may still be a period of eventual consistency between the provider and application. State the access policy for that interval. Critical commands can require fresher evidence than a dashboard display. Do not imply a cross-system atomic guarantee that the integration does not provide.

Stripe's [subscription webhook guide](https://docs.stripe.com/billing/subscriptions/webhooks) connects invoice and subscription events to access management. Use its version-appropriate object relationships, but retain the application's own explicit entitlement policy rather than copying event names into a single `isPaid` flag.

## Record money movements without overwriting history

Keep invoices, adjustments, payments and refunds as distinct records with stable references. A refund changes the financial history; it should not make the original payment disappear.

Use currency-aware minor-unit representations and provider rules. Avoid assuming every currency uses two decimal places. Internal calculations need explicit rounding and allocation policies, especially when distributing discounts or taxes across items.

Reconcile totals at the relevant scope: invoice lines and adjustments to invoice amount, accepted payment evidence to collection records, and refunds to the original payment relationship. Provider fees, settlement timing and currency conversion can make cash settlement differ from invoice totals.

Distinguish an application billing record from a formal accounting ledger. If the product needs accounting-grade entries or revenue recognition, define that system's requirements and integration with the responsible finance process. A subscription table is not an accounting system merely because it contains amounts.

Corrections should be traceable. Record a new adjustment or repair action with its reason and evidence rather than silently editing a historical settled amount.

## Design usage billing as a data pipeline

Usage needs an event identity, tenant, metric, quantity and event time. Define whether quantity is additive, cumulative or a correction. Duplicate ingestion must not count usage twice.

Specify late-arriving usage, clock skew, period closure and correction behavior. Processing time and usage time are not interchangeable. A retry delivered tomorrow may represent work performed before the billing period ended.

Keep the authoritative usage record before exporting aggregates to a provider. Provider acceptance can fail or become uncertain; use stable identities and reconciliation. Do not discard the only evidence of customer consumption after a successful API response.

The usage metric must match the commercial promise. Counting attempted jobs when customers were sold completed results requires an explicit policy. Failed jobs can consume infrastructure without becoming billable usage; engineering cost and customer charges are related but distinct records.

## Give recovery and support controlled commands

Support needs to inspect the agreement, invoices, payment attempts, entitlement decision and synchronization status together. It also needs safe commands for replaying an inbox event, reconciling a customer, applying an approved credit or correcting a mapping.

Each repair should have actor, purpose, scope and operation identity. Broad database edits can bypass idempotency and create a state no ordinary workflow can explain.

Define uncertain outcomes. If a provider accepts a refund but the local response is lost, look up the operation before initiating another refund. Provider idempotency helps within its documented contract; local operation records preserve the business purpose beyond one HTTP attempt.

Use periodic reconciliation to find missing events, stale projections and unmatched records. Prioritize by age and consequence. A list of paid invoices whose access decision is unresolved tells an operator which customer outcomes need repair. Grouping them under “webhook errors” loses that information.

## Test histories that cross billing periods and failure boundaries

Test duplicate and out-of-order events, lost responses after provider acceptance, worker failure after an effect, and replay with conflicting input. Test an upgrade during an unpaid period, a downgrade with excess seats, a trial ending without a usable payment method, and a cancellation scheduled for period end.

Use the provider's supported test environment and time-control tools where available, with the pinned API version. Retain fixtures for version upgrades and verify both financial records and application access. A successful checkout test covers only one part of billing.

Check that an older event cannot incorrectly restore access and that a legitimate late payment can be reconciled under the policy. Test support commands with the same invariants as ordinary commands.

Billing is dependable when every access and money-related decision has an owner, evidence and a recovery path. The provider performs important parts of the workflow; the application must still connect them into a coherent customer experience.

Originally published on [Israel Oduguwa's website](https://israel-oduguwa.vercel.app/articles/reliable-saas-billing-workflows).
