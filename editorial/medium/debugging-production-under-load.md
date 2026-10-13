# Debugging a production service that slows down under load

Separate waiting from work, locate the first saturated resource, and verify a fix with realistic arrival rates and failure conditions.

This article was written with AI assistance. Sources and example verification are linked where relevant.

Technical context: 22 February 2024. Published 13 October 2026; the context date describes the technical era examined.

A service responds in 80 milliseconds during a quiet test. At the busiest hour, its slowest requests take several seconds. CPU utilization looks unremarkable, database queries are individually fast, and adding application instances provides only temporary relief.

This is a useful diagnostic scenario because several different failures produce the same symptom. A database connection pool can make requests wait before a query starts. A slow dependency can occupy request slots. A synchronous callback can delay unrelated work on the Node.js event loop. Retries can multiply the workload after the initial slowdown.

I would begin by accounting for the time in one request and the resources occupied by all requests. A flame graph answers where CPU time went. It cannot, by itself, explain five seconds spent waiting for a connection.

The examples below assume a Node.js 20 service backed by PostgreSQL. The latency and capacity numbers are hypothetical; they describe a diagnosis to reproduce, not a production incident I am claiming to have observed.

## Define the symptom precisely enough to falsify an explanation

“The API is slow” mixes several populations. Successful reads, failed writes, requests rejected at admission, and jobs that finish asynchronously need separate measurements. An average can improve while the most important operation deteriorates.

Start with the external contract: which operation has a deadline, how much traffic it receives, what counts as success, and where latency begins. Measure at the gateway as well as the application. An application timer that starts after admission misses time spent waiting upstream. A client timer includes network behavior the server cannot see.

Record the arrival rate, admitted rate, completion rate, timeout rate and number of requests in flight. Split latency by operation and outcome. Keep a bounded set of labels: route templates, dependency names and outcome classes. Raw user IDs and request URLs create expensive, high-cardinality telemetry and can expose private information.

The distinction between successful and failed latency matters. Rejecting most requests quickly can make an overall latency chart look healthy while useful throughput collapses. Google's [monitoring chapter](https://sre.google/sre-book/monitoring-distributed-systems/) organizes the basic service signals around latency, traffic, errors and saturation. For this investigation, I would add explicit queue and resource ownership measurements.

Write competing hypotheses before changing capacity. For example: pool wait dominates; an expensive callback blocks the event loop; a hot row serializes updates; or requests wait on an external API whose latency rises with concurrency. Each hypothesis needs a signal that could disprove it.

## Draw the request timeline, including acquisition time

A useful trace distinguishes acquiring a resource from using it:

```text
gateway admission
  -> application admission
  -> acquire database connection
  -> execute query
  -> acquire downstream request slot
  -> call downstream service
  -> serialize response
  -> socket completion
```

Suppose a request spends 1,800 ms acquiring a connection, 35 ms executing SQL, 70 ms calling a dependency and 12 ms serializing its response. Optimizing the SQL by 10 ms will barely change the result. The question is why connections remain occupied long enough to produce that wait.

Inspect transaction duration separately from query duration. A handler may hold a database transaction open while it sends an email or waits for a payment API. Every query can be fast while the connection is unavailable to other requests for seconds. Moving the remote call outside the transaction can release capacity, but the replacement needs a durable intent or reconciliation path if the two systems must agree.

Parallel spans also require care. Adding every child span duration can exceed the request duration because work overlaps. Follow the critical path and distinguish wall-clock time from accumulated resource time. For unsampled slow requests, preserve a compact summary of the phases or use a sampling policy that retains slow and failed traces without pretending that biased trace samples represent the whole latency distribution.

## Use queueing arithmetic to check whether the dashboard is plausible

For a stable observation interval, Little's law relates average work in the system to throughput and average time:

```text
average in-flight work = throughput × average time in system
```

If a dependency receives 200 calls per second and an average call occupies a slot for 0.1 seconds, it needs about 20 slots on average. If occupancy rises to one second at the same arrival rate, average demand becomes about 200 slots. A 40-slot limit will accumulate waiting work or reject it.

These numbers do not determine the right pool size. The relationship uses averages over a stable population; it says little about bursts, tail latency or a downstream capacity limit. Its value is exposing contradictions. A dashboard showing ten requests in flight, 200 completed requests per second and a one-second average duration may have mismatched scopes or missing instrumentation.

Adding a larger pool can simply move the queue into PostgreSQL. Likewise, doubling application instances can double the number of possible database connections. Inventory the aggregate budget:

```text
12 instances × 20 connections = 240 possible application connections
plus workers, migrations, monitoring and administrative access
```

The budget must fit the database's workload capacity and connection limits, including a failover or deployment overlap. “More connections” is a hypothesis to test, not a performance improvement by definition.

## Separate event-loop delay from CPU and worker-pool contention

Node.js can have available machine CPU while a particular process cannot schedule JavaScript promptly. A single busy event-loop thread and several idle cores produce exactly that pattern. Large JSON processing, expensive regular expressions and synchronous library calls deserve inspection.

Node's [event-loop guidance](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop) distinguishes JavaScript callback work from operations delegated to the worker pool. An asynchronous API name does not make every stage of an operation free of CPU cost. Some filesystem, DNS and cryptographic work competes for worker-pool capacity, while callback processing still returns to the event loop.

The following instrumentation measures event-loop delay in milliseconds. The histogram reports nanoseconds, so the conversion is deliberate:

```javascript
import { monitorEventLoopDelay } from 'node:perf_hooks';

const delay = monitorEventLoopDelay({ resolution: 20 });
delay.enable();

const timer = setInterval(() => {
  metrics.observe('event_loop_delay_p99_ms',
    delay.percentile(99) / 1e6);
  delay.reset();
}, 10_000);
timer.unref();
```

Here, `metrics` represents the application's existing telemetry adapter. This is an integration sketch, not a complete monitoring package. The [Node 20.11.1 API reference](https://nodejs.org/download/release/v20.11.1/docs/api/perf_hooks.html#perf_hooksmonitoreventloopdelayoptions) documents the histogram and its resolution. A delayed sampling callback is evidence of scheduling delay, not a diagnosis of which function caused it.

Correlate delay with CPU profiles, garbage collection, heap growth and request phases. Capture profiles on a representative instance for a bounded period. Avoid enabling expensive profiling everywhere during an incident. Check container CPU throttling and per-process utilization; a machine-wide percentage can hide a process exhausting its allocation.

If parsing large documents is the cause, moving that work to a bounded worker pool may help. Spawning an unbounded worker per request replaces one resource problem with another. Define payload limits, admission limits and a deadline for the work before deciding how to execute it.

## Look for amplification and serialization

An initial slowdown often becomes a larger incident because requests outlive their callers. A client times out after two seconds, retries, and leaves the first request consuming a database connection. The server sees both attempts. A timeout is not proof that the original write did not commit.

Measure attempts per logical operation and work continuing after cancellation. Use operation identity for side effects, a bounded retry policy and a remaining deadline. Cancellation should reach dependencies that support it, but the service still needs to reconcile an uncertain outcome.

Serialization creates a different signature. A small set of rows may receive most writes, causing lock waits even when the database's CPU is low. Inspect lock wait events, blocking transactions and transaction age. A missing index on a relationship check can also lengthen locks indirectly. Query plans from quiet development data do not establish production behavior; cardinality, skew and concurrent writes matter.

Cache misses can amplify both patterns. When many requests miss the same key, they may all perform the same expensive fetch. Request coalescing can reduce duplicate work, but ownership must be bounded: failed fills must release waiters, different tenants must not share private values, and expired work must not populate a cache after its result is obsolete.

## Design a load test that cannot conceal overload

A fixed number of clients that waits for each response before sending another request is a closed workload. As the service slows, those clients naturally send less traffic. That can be useful for modeling a fixed user population, but it can hide a service's response to a sustained arrival rate.

For capacity testing, also use an arrival-driven workload and measure when the generator falls behind. Record scheduled arrival time, actual send time, completion time and failures. Report offered load separately from delivered load. A load generator that cannot keep up is not evidence that the server handled the requested rate.

Preserve the relevant workload mix: cache-hit ratio, expensive operations, tenant skew, payload sizes, reads and writes. Warm caches and connections deliberately, then run a separate cold-start test. Use production-like data distributions without copying sensitive records into the test environment.

Increase offered load in steps, hold each step long enough to observe backlog and memory behavior, and then reduce it. Recovery is part of the test. A system that accepts a short burst but spends twenty minutes draining obsolete work has exceeded useful capacity even if it eventually completes everything.

Include a slower dependency and loss of one application instance. Set a stop condition before testing a shared environment: error budget consumption, queue age, database connection pressure or a protected operation's latency. Load tests need an owner who can stop them.

## Choose the intervention that changes the limiting resource

If pool wait dominates because transactions include remote calls, shorten ownership and preserve the workflow through durable effects. If event-loop delay dominates, reduce callback cost or isolate bounded CPU work. If a hot row dominates, reconsider the contention point; application replicas will not remove a database serialization requirement.

If the service accepts more work than it can finish within the deadline, admission control may improve useful throughput before any capacity increase. Shed work early enough to avoid expensive acquisition, distinguish retryable overload from permanent validation errors, and protect critical operations. Google's [overload chapter](https://sre.google/sre-book/handling-overload/) discusses the need to account for request cost rather than treating every request as equivalent.

Verify one intervention against the original hypothesis. Keep the workload and measurement boundaries comparable. Look for lower queue wait, stable useful throughput, bounded in-flight work and recovery after a burst. Check the database and dependencies for displaced pressure.

The strongest incident report is a causal account: which resource saturated first, how waiting or retries propagated the symptom, what changed ownership or demand, and what evidence shows the system now recovers within its operating limits. A before-and-after average latency chart is only one part of that account.

Originally published on [Israel Oduguwa's website](https://israel-oduguwa.vercel.app/articles/debugging-production-under-load).
