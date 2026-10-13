---
slug: "incremental-system-migrations"
title: "Changing a large system through incremental migrations"
description: "Design coexistence, data ownership and rollback before replacing a live system one boundary at a time."
date: "2026-10-13"
contextDate: "2024-10-10"
tags:
  - Architecture
  - Migrations
  - Reliability
---

A rewrite promises clean code and a simpler architecture. The existing system still receives orders, holds customer history and serves integrations whose behavior nobody has fully documented. Replacing it means reproducing enough of those contracts while the business keeps changing.

The hard engineering work is making old and new behavior coexist safely. A migration can be incremental in its deployment schedule and still be dangerous if both systems believe they own the same write.

I would plan a migration around a sequence of ownership transfers. Each step should deliver useful behavior, expose evidence that its contracts hold, and have a recovery path that accounts for data already written. The running example is a hypothetical move from a legacy order module to a new fulfillment boundary.

## State the outcome that justifies the migration

“Modernize the stack” is too broad to guide a difficult tradeoff. Name the constraint being removed: unsupported dependencies, deployment coupling, a throughput limit, recurring correctness failures or a feature that the existing design cannot support at acceptable cost.

Set observable outcomes. If the problem is deployment coupling, the new boundary should be deployable without coordinating unrelated changes. If it is recovery, demonstrate a failed delivery and subsequent repair. Cleaner classes alone do not establish either result.

Inventory contracts before changing them. Include browser behavior, API consumers, database readers, scheduled jobs, exports, support procedures and financial reports. Record which consumers can be upgraded and which need a compatibility period.

Characterization tests help capture behavior, but existing behavior can include defects. Decide which behavior must remain compatible and which is intentionally changing. Otherwise, the migration either faithfully preserves a bug or accidentally changes a relied-upon edge case.

Martin Fowler's [Strangler Fig article](https://martinfowler.com/bliki/StranglerFigApplication.html), revised in August 2024, describes gradually moving behavior through seams and accepting temporary architecture to make coexistence possible. That is the starting pattern. A concrete migration still needs rules for writes, reads and rollback.

## Find a seam that corresponds to business ownership

A seam might be an API facade, an internal interface, a message boundary or a routing rule. Prefer one that isolates a coherent business responsibility. Replacing all database access with a new ORM is a technical seam, but it may leave every business module coupled to the same schema.

For fulfillment, introduce an interface that accepts an order accepted by the sales domain and returns a fulfillment reference. The old implementation can live behind that interface first. This makes the seam useful before any traffic reaches the replacement.

```text
order acceptance
       |
       v
fulfillment interface
       |
       +-- legacy implementation
       |
       +-- replacement implementation
```

Define which side owns order acceptance, inventory reservation and shipment status. If the interface exposes every legacy table field, it has copied the coupling rather than removed it. Use a translation layer to preserve the public contract while the new domain adopts a clearer model.

Measure calls through the seam. A hidden batch job that still writes legacy fulfillment tables can invalidate the new ownership model. Migration progress should track behavior and writers, not just lines of code moved.

## Expand before switching, then contract later

A database migration must support deployment overlap. Old application instances can remain alive while new instances start. A queue may contain old messages. A rollback may restore yesterday's binary against today's schema.

Use an expand-and-contract sequence. Add a new nullable representation or table without removing the old one. Deploy code that understands both. Backfill existing data with a resumable job. Verify parity. Switch authoritative reads or writes deliberately. Remove the old representation only after consumers and rollback windows permit it.

A column rename performed in one deployment can break old instances immediately. An additive field is usually easier to make compatible, but its semantics matter: old code may omit it, new code may require it, and defaults may conceal missing information.

Backfills need checkpoints, a bounded batch size and an idempotent update rule. A job that restarts from zero after failure can overwhelm the database repeatedly. A job that overwrites newer customer edits with an older snapshot corrupts data more quietly.

One approach is to backfill only rows whose new representation is absent and to use a source version to avoid overwriting a concurrent update. The exact SQL depends on the data model. PostgreSQL's [transaction isolation rules](https://www.postgresql.org/docs/16/transaction-iso.html) should inform the race analysis rather than assuming a transaction turns multiple reads into a permanent snapshot at every isolation level.

## Decide how new and old data stay consistent

Naive dual writes call the old store and the new store sequentially. The first succeeds, the second times out, and the request now has two different outcomes. Retrying can duplicate one side or reverse which side is newer.

Where both representations are in one database, a transaction can update them together during a compatibility period. That keeps local atomicity but retains schema coupling and extra write cost. Where stores are separate, prefer one authoritative write plus a durable propagation mechanism, such as an outbox or change capture, with reconciliation.

```text
authoritative write + propagation intent
                 |
                 v
versioned event -> projection in replacement store
                 |
                 v
lag and parity verification
```

Projection writes should be idempotent and reject obsolete versions. Events may be duplicated or arrive out of order. Deleting a record needs an explicit representation so an old event cannot recreate it accidentally. A backfill and live event stream also need a documented ordering or version rule.

Do not switch reads merely because the row counts match. Compare business meaning: order totals, current fulfillment state, tenant ownership and required relationships. Hashes can reveal differences, but a normalized hash that discards a meaningful field can manufacture parity.

## Shadow reads safely and interpret disagreements

A shadow read sends a read to both implementations while only one response serves the user. It can reveal differences without exposing the replacement result. It also doubles some work and can worsen an already constrained dependency.

Sample deliberately, bound concurrency and strip sensitive data from comparison logs. Ensure the shadow path has no side effects. A function named `getOrder` may update a last-accessed timestamp or trigger lazy materialization; inspect the implementation before duplicating it.

Define expected differences. Two reads taken at different moments may disagree because the underlying data changed. Compare versioned snapshots where possible, or classify such disagreements rather than labeling every mismatch a migration bug.

Retain examples for manual review. A parity percentage hides the severity of the remaining failures. A difference in display formatting is not equivalent to assigning a shipment to the wrong tenant. Release criteria should include critical invariants that cannot be averaged away.

## Make routing sticky enough for the business operation

Feature flags should select ownership at a stable unit: tenant, account, workflow instance or operation identity. A random per-request flag can send the first half of a workflow to the old system and its continuation to the new one.

Persist the owner where an operation spans multiple requests. A worker retry should not discover that a flag changed and repeat an external effect through a different implementation. Flag evaluation failure also needs a defined behavior. For existing operations, recorded ownership is often safer than whichever global default is currently available.

Use a small cohort with meaningful workload characteristics. An internal test tenant is useful for smoke tests but cannot represent large customer data, integrations or concurrency. Expand by cohorts whose differences are understood.

Watch business outcomes alongside technical metrics. The replacement may have lower latency while dropping a required notification or delaying a finance export. A migration dashboard should show adoption, parity, propagation lag, errors and the age of operations requiring reconciliation.

## Define rollback as a data operation

Rolling back a binary is easy to describe. Rolling back ownership after the new system has accepted writes is harder. The old system must be able to interpret those writes or have a replay path that brings it current.

For each stage, write down whether rollback means routing back, restoring an earlier application version, rebuilding a projection, or running a compensating migration. State the point after which immediate routing rollback is no longer safe.

If reverse propagation is required, build and test it before moving the authoritative writer. Otherwise, a feature flag gives an illusion of reversibility. Keeping the old database online does not make it current.

Avoid destructive schema contraction during the same release that switches ownership. Retain a compatibility interval tied to real deployment and recovery needs. Backups are a last-resort recovery mechanism, not a convenient rollback for live customer edits made after the backup.

Test a rollback drill on a representative environment: write through the new path, fail it, restore the old path, and verify that those accepted writes remain visible and correct. Record the time and operational steps required.

## Retire the temporary architecture with evidence

Temporary adapters and compatibility fields have ongoing cost. Give them owners and explicit removal criteria. If the old path still has unexplained traffic, investigate before deleting it.

Track the remaining legacy writers, readers, queued message versions and active workflow instances. A code search is useful but cannot reveal an external report reading a database directly. Access logs and consumer ownership records help close that gap.

Remove flags after the decision is stable, simplify the contract where compatibility no longer requires translation, and delete old operational procedures. Keep the decision record and migration evidence so the next engineer understands why the final boundary exists.

A successful incremental migration leaves a system that can change more easily. It also leaves a credible account of which system owned each operation during the transition, how accepted data was preserved, and how the team recovered when a step failed.
