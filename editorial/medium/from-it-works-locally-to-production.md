# What changes when a workflow reaches production

A deployment review focused on failure recovery, observable state and the cost of running the product.

This article was edited with AI assistance.

Local development makes a lot of things feel immediate. The database is nearby, the browser belongs to you, and restarting the process is cheap. A production workflow has slower dependencies, other users and work that must survive a restart.

Before a release, I want to understand how the workflow behaves when a dependency stops responding. A successful happy-path test is necessary, but it does not answer what the business should do with an unfinished enrollment, a pending payment or a render job whose worker disappeared.

## Follow one workflow all the way through

Choose a critical journey and follow its state across the interface, API, database and external services. For an enrollment, that might mean a registration record, a Stripe checkout, an accepted payment update and an administrative record.

At every boundary, ask what is already durable and what is still an assumption. If the browser closes, is the record still recoverable? If the payment succeeds while the API times out, which state tells an operator what happened? If the event repeats, what prevents repeating the business action?

The answer should be visible in the data model and recovery paths. It should not depend on a particular person remembering what to click in a dashboard.

## Put limits on background work

A media workflow can look simple as a sequence of API calls. Under load, rendering, polling and retrying create competing work. Unbounded concurrency can increase both failures and costs.

Bound the number of active jobs and make progress durable where the workflow requires it. Separate a transient provider error from a permanent invalid request. Set retry limits and give exhausted jobs an inspectable state rather than letting them disappear into logs.

At [Excel Health Careers](https://israel-oduguwa.vercel.app/work/excelcna), I bounded render concurrency, polled for progress and added recovery paths to the media workflow. The case study records the results from that contract.

## Measure the user-visible failure

A healthy process does not mean a healthy product. A worker can be running while the queue grows. An API can return quickly while enrollment records remain incomplete.

Useful signals include the age of the oldest pending item, failed state transitions, retry exhaustion and the time between a successful external event and its local business effect. Record operation identifiers so an engineer can follow a workflow without logging credentials or private payment data.

Google's [SRE monitoring chapter](https://sre.google/sre-book/monitoring-distributed-systems/) describes monitoring in terms of the service's behavior and symptoms. For a small team, a few relevant signals with an actionable runbook are more useful than a large dashboard nobody knows how to interpret.

## Review the running cost

Infrastructure cost is a product constraint. Track what drives it: continuously running compute, database access patterns, media processing, storage, data transfer and external API usage. A cheaper component is not automatically a cheaper system if it adds operational work or causes repeated processing.

At KinsCare, I worked on frontend modernization and infrastructure changes together. Infrastructure spend fell by over 75% during that work period. The [case study](https://israel-oduguwa.vercel.app/work/kinscare) describes the migration and the results.

## Release with a recovery path

A release should include a way to identify incomplete work, a way to retry only the appropriate operation, and a way to stop writes if the system's history is no longer trustworthy. Database restore scenarios deserve particular attention because external systems may have progressed beyond the restored local state.

Write down who can make that decision and what evidence they need. Then exercise the path in a disposable environment. A runbook becomes useful when another engineer can follow it under pressure, not when it contains every command the author happened to run.

A release is easier to operate when the team knows how to find unfinished work, which retries are safe and who can make the recovery decision.

Originally published on [Israel Oduguwa's website](https://israel-oduguwa.vercel.app/articles/from-it-works-locally-to-production).
