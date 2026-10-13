---
slug: "deciding-when-to-split-a-monolith"
title: "When to split a monolith: ownership, deployment and data boundaries"
description: "Evaluate a service extraction by the constraint it removes and the distributed failure modes it introduces."
date: "2026-10-13"
contextDate: "2024-05-23"
tags:
  - System architecture
  - Microservices
  - Technical leadership
---

A large repository is not, by itself, a reason to create microservices. A small repository can have severe deployment coupling, and a large modular application can serve a substantial workload with clear ownership and straightforward recovery.

The useful question is whether a separate deployment and data boundary removes a concrete constraint that cannot be resolved economically inside the current system. The answer should include the new network, consistency and operational costs.

Consider a hypothetical SaaS with accounts, billing, reporting and media processing in one application. Media jobs consume most compute, reporting queries interfere with interactive traffic, and billing changes require extra review. Those are three different problems; they do not imply that every module needs a service.

## Identify the constraint before choosing a topology

Measure the problem. Is deployment coordination slowing independent teams? Does one workload require a different runtime or capacity shape? Does a failure in optional processing take down a critical request path? Is a security boundary too broad?

Some constraints can be resolved within a modular monolith. Move expensive jobs into a separately scaled worker process using the same codebase. Restrict database access by module. Introduce clear internal interfaces. Separate release responsibilities without immediately adding a network hop to every function call.

Other constraints do justify a service. A specialized media pipeline may need an independent runtime and scaling policy. A domain with distinct availability and security requirements may need a narrower failure and credential boundary. A team may need to deploy its capability independently after the contract is stable.

Martin Fowler's [Monolith First essay](https://martinfowler.com/bliki/MonolithFirst.html) describes the operational premium of microservices and the difficulty of discovering stable boundaries early. It is an experience-based argument, not a universal theorem. I would use it to make the cost of distribution explicit, then evaluate the actual system's constraints.

## Examine the dependency graph, including the data

A proposed service that reads six other modules' tables and must coordinate every release with them has little independence. It has converted local dependencies into remote ones while retaining the coupling.

Map calls, shared tables, transactions, events and operational procedures. Count critical synchronous dependencies, but inspect their meaning rather than treating the count as a score. One payment dependency can matter more than ten optional enrichment calls.

Identify the domain owner of each write. Other modules can consume an API or a projection; they should not update the service's tables directly. If several modules require one atomic transaction across the same data, the proposed boundary may be misplaced.

```text
good extraction candidate
accepted job -> media service -> result event

coupled extraction candidate
request -> service A -> service B -> service C
           shared writes to the same tables
           coordinated schema changes
```

The first still needs reliability design, but it has a coherent accepted-work contract. The second may be a distributed monolith: separate processes with tightly coupled deployment and data behavior.

## Choose the consistency boundary deliberately

Within one database transaction, several state changes can commit atomically. Splitting those writes across services removes that simple boundary. You need a new business contract for the interval in which only some effects have happened.

For media processing, accepting a job and later receiving its result is naturally asynchronous. For transferring a balance between two accounts, splitting account ownership carelessly can make the financial invariant much harder to preserve.

Do not call eventual consistency an implementation detail when the user can observe it. Define intermediate states, deadlines, reconciliation and compensation. A canceled order with an already accepted shipment requires a business response; retrying messages does not decide that response.

Use durable operation identity for commands and idempotent handling for messages. Record which service owns the authoritative outcome. Consumers should tolerate duplicate delivery and reject obsolete versions when ordering matters.

PostgreSQL's [transaction-isolation documentation](https://www.postgresql.org/docs/16/transaction-iso.html) describes local concurrency semantics. A network call made inside a local transaction does not extend those semantics to the remote service. Keep that distinction visible in the design review.

## Price the synchronous request path

Every synchronous service dependency adds latency, a timeout policy and another availability condition. Parallel calls can reduce the critical path, but they increase simultaneous resource demand. Sequential calls can create a waterfall.

If a request requires three independent services and each has a hypothetical availability of 99.9%, their product is about 99.7% under the simplified independence assumption. Real failures can be correlated, and fallback behavior changes the result, so this arithmetic is a warning about composition rather than an availability forecast.

Measure dependency latency and error behavior. Assign an end-to-end deadline, propagate remaining budget and choose one layer to own retries for each operation. A service split that creates three retry layers can increase load during failure even when normal latency looks acceptable.

Avoid making a central authorization or configuration service an unbounded synchronous dependency without a failure policy. Caching can reduce calls, but stale grants or configuration may have correctness consequences. Decide which decisions can tolerate age and which must fail closed.

## Include the operational capabilities the new service requires

An independently deployed service needs an owner, deployment pipeline, secrets, monitoring, alerting, capacity plan, backup or rebuild procedure, and an incident response path. “The platform team handles it” should identify the actual supported capability, not transfer an unspecified burden.

Trace a business operation across boundaries using stable correlation and operation IDs. Logs should explain accepted work, pending work and uncertain outcomes without copying sensitive payloads everywhere.

Define compatibility rules for APIs and events. During rollout, producers and consumers can run different versions. Additive fields, unknown events, removed fields and changed semantics need explicit handling. A schema registry can validate structure; it cannot prove business meaning stayed compatible.

Test dependency failure and recovery. Stop the extracted service, delay its responses, duplicate messages and replay an old event. Verify that critical unrelated functions still work and that pending operations recover within their objective.

If the organization cannot support those operations yet, a separate worker deployment or a stronger module boundary may deliver much of the benefit with less risk.

## Extract the smallest coherent ownership boundary

Begin by putting an internal interface around the capability while it remains in process. Remove direct cross-module writes and clarify the contract. This exposes whether the domain boundary is viable before networking makes every adjustment more expensive.

Introduce the replacement through a routing seam. Use a stable cohort or operation owner, not a random per-request flag for a multi-step workflow. Shadow read-only behavior where useful, keeping extra load bounded and comparison evidence safe.

Transfer authoritative data with a migration plan. One writer plus durable propagation is usually easier to reason about than independent dual writes. Backfills need version-aware updates and checkpoints. Compare business invariants, not just row counts.

Define rollback before accepting new writes. If the old system cannot read new data, routing traffic back is not safe until it has caught up. Keep the compatibility period long enough for deployment overlap and the agreed recovery path.

The [original Strangler Fig application description](https://martinfowler.com/bliki/OriginalStranglerFigApplication.html) offers the gradual-replacement pattern. For this May 2024 context, the important implementation detail is coexistence with clear ownership, not a later framework-specific migration tool.

## Make a decision with explicit rejected alternatives

For the hypothetical SaaS, a reasonable first decision might be to extract media processing because it has a distinct runtime, long-running workload and an accepted-job boundary. Keep billing and accounts together while their local transaction requirements remain tightly coupled. Move reporting onto a projection or read path before creating a synchronous reporting service.

That decision should state what it improves and what it costs. Media jobs become independently scalable and a media failure need not block account management. The team now owns job admission, result delivery, schema compatibility and a separate deployment.

Record the conditions that would change the decision. A larger team may need a stable billing ownership boundary. A new compliance requirement may require credential isolation. A measured reporting bottleneck may justify another data store. Revisit based on those signals, not a general aspiration to have more services.

Avoid splitting by technical layer: one service for controllers, another for validation and another for database access. Such a topology distributes one business operation across several deployments while offering little independent ownership.

## Verify that the split delivered independence

After extraction, measure whether the promised constraint changed. Can the owning team deploy without coordinated releases? Can its capacity change without exhausting shared dependencies? Does its failure remain contained? Can the service restore or rebuild its state independently?

Track lead time and incidents with enough context to interpret them. A deployment count alone can rise because a change now requires releases to several services. Compare the business change's full path rather than celebrating a local pipeline metric.

Retire temporary adapters and broad database access after the migration is stable. Otherwise, the service boundary exists on a diagram while hidden writes preserve the old coupling.

The decision to split is justified when a coherent owner can change, scale and recover its capability with less coordination, and when the added distributed-system responsibilities are supported. A modular monolith remains a valid outcome when it meets the same product needs more economically.
