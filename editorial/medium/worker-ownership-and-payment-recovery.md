# What a crashed payment worker leaves behind

How SafeStripe uses leases, ownership checks and transactions to recover work after a payment worker crashes.

A worker claims a payment update, starts processing and disappears. The queue still contains the work, but the process that claimed it will never release it. Another worker needs permission to continue without letting the old one later overwrite its result.

I built SafeStripe to handle this kind of recovery. The TypeScript library saves accepted work, leases jobs to workers and checks ownership before committing local effects. The [0.3 preview](https://israel-oduguwa.vercel.app/work/safestripe) includes tests and a sandbox where you can inspect that behavior.

## A claim is temporary ownership

A job claim has a lease and an ownership token. The lease provides a route back to available work after a worker disappears. The token distinguishes the current claim from an earlier claim by the same or another process.

Completion has to check ownership at the transaction boundary. Checking only when the job starts leaves a gap: a worker can pause long enough for its lease to expire, then resume after another worker has claimed the job.

```text
Worker A claims job with token A
Worker A stops making progress
Lease expires
Worker B claims job with token B
Worker A resumes
Completion using token A must be rejected
```

The token protects the supported local commit. It cannot revoke an arbitrary external request already sent by Worker A. External mutations need their own operation identity and receiver behavior.

## Save the event before returning success

The webhook endpoint verifies the Stripe signature against the original request bytes and admits accepted work to durable storage. Only then can it acknowledge receipt. Processing takes place separately.

If the database is unavailable before admission, returning success would tell Stripe the application received work it has not saved. The receiver should fail that admission so the documented retry path remains available.

This is a deliberately small HTTP boundary. It does not ask the delivery request to finish every downstream action before returning.

## Commit the local business decision together

A stable effect key can guard a business effect even when more than one event concerns the same payment. SafeStripe's supported transaction combines the effect guard, supported local record changes and the outbox intent.

That scope matters. An unrelated application table does not automatically become part of the transaction merely because the application also uses SafeStripe. A developer must understand the adapter's supported transaction API and decide how their application state participates.

The outbox is a record of delivery intent. Its dispatcher provides at-least-once delivery. A downstream receiver needs deduplication because it can accept a request while the sender loses the response.

## Test the disappearance

A process-level failure test creates a stronger recovery scenario than throwing an exception in a handler. The retained suite includes actual worker termination and subsequent recovery, alongside adapter conformance and contention tests.

The question is what durable state remains: who owns the job, whether the effect was committed and whether the downstream intent exists. A successful HTTP response alone cannot establish those properties.

The repository also keeps [a Stripe sandbox lifecycle run](https://github.com/Israel-oduguwa/SafeStripe/actions/runs/37600727941) covering twelve journeys. In its duplicate replay, ten additional admissions preserved the original Firestore paid receipt and paid time.

## The limits are part of the design

SafeStripe cannot authorize an application's refund policy, make an external service participate in its local transaction or repair missing database history without remote reconciliation. Database backup and restore behavior still belongs in the application's recovery plan.

The [architecture and reliability contracts](https://israel-oduguwa.github.io/SafeStripe/) explain those responsibilities alongside the mechanisms. The sandbox run covers its recorded journeys, and each benchmark names its environment and workload. Independent security review and enterprise capacity testing remain outside that evidence.

I want another engineer to be able to identify the transaction boundary and reproduce the recovery test. The tests give us something concrete to inspect when deciding how the payment integration behaves after a failure.

Originally published on [Israel Oduguwa's website](https://israel-oduguwa.vercel.app/articles/worker-ownership-and-payment-recovery).
