# Stripe idempotency does not finish the payment workflow

How request retries, repeated webhooks and local business effects need separate identities and recovery rules.

Consider a customer paying for a course. Stripe accepts the payment, but your server loses the response before it updates the enrollment record. The customer sees an error. Your application sees a timeout. Neither observation tells you whether the money moved.

In this example, “try again” can mean retrying the Stripe request, handling a repeated webhook or granting access to the course. Each operation needs its own identity and recovery rule.

## What Stripe's key protects

A Stripe idempotency key identifies a request to the Stripe API. Repeating the request with the same key can return the saved result rather than create another object. Stripe compares parameters and documents when results are saved, including error results. Keys are not an indefinite archive: Stripe can remove them after they are at least 24 hours old.

That protects the remote mutation within the documented behavior. It does not update your enrollment table, remember whether you sent an email or prevent a second application worker from granting access.

The application therefore needs to keep the business operation's identity. A purchase ID is usually a better starting point than generating a new random key inside every retry. If a retry creates a fresh identity, it may look like a new purchase to the systems receiving it.

## A timeout is an unknown outcome

Consider a refund request whose response disappears:

```text
Application sends refund with operation ID R-104
Stripe processes the refund
The connection closes before the response arrives
Application records an unknown outcome
```

An unknown outcome is not the same as a rejected refund. Changing the operation ID and trying again can create another mutation. A safer recovery path preserves the identity, checks the available remote evidence and distinguishes a definite failure from an ambiguous result.

For older ambiguity, the Stripe key's retention boundary matters. An integration should not assume that replaying an old request is always safe. It needs a review or reconciliation path before creating another mutation.

## Webhook deduplication is a different guard

Stripe can deliver events more than once and does not guarantee their order. A webhook receiver should verify the signature against the original bytes, persist accepted work and let a worker process it. Acknowledging before durable storage risks losing the event when the process dies.

Storing a unique event ID helps with repeated delivery of that event. It is not a complete business rule. Two different events can concern the same payment or enrollment. If both events can grant access, deduplicating only their event IDs still permits two grants.

Use a business effect identity such as “grant this enrollment after this payment,” and decide which local writes it protects. That identity should survive event replay and worker restart.

## Where the transaction ends

The local payment state, an effect guard and an intent to notify another service can be committed in one database transaction when the storage design supports it. The notification itself happens outside that transaction.

An outbox records what still needs delivery. It gives the application a recoverable queue of downstream intent. It cannot make the recipient accept a request exactly once: the recipient might accept it while the response disappears, leaving the sender unable to distinguish success from failure.

That boundary calls for at-least-once delivery and recipient-side deduplication. Hiding it behind an “exactly once” promise makes the next incident harder to reason about.

## Keep three identities in the operator's view

The purchase identity represents the commercial intention. The provider request identity protects a supported API attempt. The webhook event identity deduplicates a notification. Keep their relationship visible rather than using one string everywhere and hoping their lifetimes match.

For access delivery, add the business effect identity: granting a particular entitlement because a particular payment was accepted. Several events can refer to that same effect. One event can also lead to several different local decisions. A unique event row is useful admission evidence, but it cannot express every business uniqueness rule.

Store the request fingerprint with the local operation. Replaying an identity with identical input can return its result; changed amount, customer or currency needs an explicit conflict. Otherwise a caller may accidentally retrieve the outcome of a different intention, or a worker may use an old provider identity with new parameters.

## Reconciliation should not send another payment as a side effect

A reconciliation operation reads provider evidence and compares it with local records. If it finds an accepted payment with missing access, it can produce or repair the appropriate local effect under the business policy. If it finds no conclusive payment evidence, that uncertainty should remain visible.

Keep money-changing repair commands separate and authorized. A job named `syncCustomer` should not silently issue a new refund or charge merely because one local row is absent. Give such commands a purpose, stable identity and retained evidence, then subject them to the ordinary financial invariant and concurrency checks.

Prioritize unresolved cases by age and customer impact. An accepted payment whose access has not been granted is different from a duplicate notification already represented correctly. Showing both as “webhook failure” hides what the operator needs to repair.

## What to test

Tests should inspect business state, not just HTTP status codes:

- Repeat the same operation ID with the same intent and verify the remote mutation is not duplicated within the supported retry window.
- Repeat the ID with changed parameters and verify it conflicts.
- Deliver an event repeatedly and verify the original business effect remains unchanged.
- Kill a worker after it claims work, then verify another worker can recover it after the lease expires.
- Lose the outbox receiver's response and verify a repeated delivery carries an identity the recipient can deduplicate.

I document these boundaries in [SafeStripe's case study](https://israel-oduguwa.vercel.app/work/safestripe). The evaluation preview links to retained tests and sandbox results, with the tested scenarios described alongside them.

## References

The authoritative details are in [Stripe's idempotent request documentation](https://docs.stripe.com/api/idempotent_requests) and [webhook delivery documentation](https://docs.stripe.com/webhooks). Read those boundaries before choosing a retry policy. Application reliability starts with knowing which part of the workflow each mechanism actually protects.

Originally published on [Israel Oduguwa's website](https://israel-oduguwa.vercel.app/articles/stripe-idempotency-your-app-still-needs-it).
