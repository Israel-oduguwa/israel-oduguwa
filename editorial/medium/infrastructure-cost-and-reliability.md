# Reducing infrastructure cost while preserving recovery capacity

Use workload economics, failure-mode capacity and reversible experiments to remove waste without buying a cheaper outage.

This article was written with AI assistance. Sources and example verification are linked where relevant.

Technical context: 20 June 2024. Published 13 October 2026; the context date describes the technical era examined.

A service runs at 25% average CPU utilization. The obvious proposal is to halve its instances. Whether that saves money safely depends on what the other 75% represents: idle waste, burst capacity, a slow scaling controller, deployment overlap or the capacity needed after an availability-zone failure.

Cost engineering starts by distinguishing those explanations. A lower monthly bill is an outcome worth pursuing, but a capacity reduction that makes recovery impossible transfers cost into outages, emergency work and lost business.

I would optimize the cost of delivering a successful business operation within its service objectives. That unit connects infrastructure decisions to the product's actual workload. The financial examples here use invented prices and volumes for arithmetic; they are not current cloud quotes or measured customer savings.

## Establish a cost model with a useful denominator

A bill tells you which vendor resources cost money. It rarely tells you which product behavior caused the cost. Map spend to workload paths: interactive requests, imports, media processing, search indexing, exports, retention and operational telemetry.

Include compute, database, storage, network transfer, managed-service requests and observability. Keep a separate view of engineering and incident-response effort. Allocating every shared dollar perfectly can take longer than making the first useful improvement. Record the allocation rule and its uncertainty instead of hiding either.

Choose a denominator that represents delivered value. Cost per API request can improve merely because the product adds cheap polling requests. Cost per completed import, active customer-month or successfully reconciled invoice is often more meaningful. Track unsuccessful attempts separately: retries, rejected work and abandoned jobs still consume capacity.

An illustrative monthly model might be:

```text
compute                 $3,600
database                $2,400
network + storage       $1,200
telemetry                 $800
total                   $8,000
completed jobs          40,000
infrastructure/job        $0.20
```

If completed jobs fall to 20,000 while the fixed footprint remains, unit cost becomes $0.40 even though the bill does not change. If jobs double, unit cost may decline until a database or dependency forces a step up in capacity. Model both fixed and variable terms rather than extrapolating one month indefinitely.

The [AWS Well-Architected cost pillar](https://docs.aws.amazon.com/wellarchitected/2023-04-10/framework/cost-optimization.html) frames optimization around business value. For an engineering review, I would translate that into an explicit workload, a cost boundary and a reliability constraint before choosing an instance type.

## Calculate capacity during failure, not just during normal operation

Consider six instances spread evenly across three zones. Suppose load tests establish that each can deliver 100 useful requests per second while meeting the latency objective for the tested workload. Normal aggregate capacity is 600 requests per second. Losing one zone leaves four instances and 400 requests per second.

At a peak of 300 requests per second, remaining capacity appears sufficient. But the estimate must include the workload distribution, connection limits, traffic redistribution and capacity consumed by recovery. A cold cache after failover can increase work per request. A downstream database can become the limiting resource before application CPU does.

Reducing to three instances, one per zone, gives 300 requests per second in normal operation and 200 after losing a zone. The same peak now exceeds failure-mode capacity. An average CPU chart did not answer that question.

This arithmetic is deliberately simple. Measured safe capacity is not linear forever. Tail latency, hot keys, garbage collection, shared dependencies and uneven routing can make the six-instance system deliver less than six times one-instance throughput. Verify the relevant failure mode with a controlled experiment.

Reserve capacity with a reason attached: the failure it covers, the time needed to replace it, and the service objective during that interval. Once a reserve has an owner and a test, teams can revisit it intelligently. Unexplained headroom becomes either permanent waste or an easy target for unsafe cuts.

## Remove work before replacing the hardware that performs it

The highest-quality cost reduction often eliminates unnecessary operations. A repeated query, an unbounded scan, a duplicate message or an overly chatty polling loop consumes several resources at once.

For a job that queries metadata once per item, fetching a bounded batch may reduce round trips and connection ownership. It can also increase memory and extend locks. Measure the whole job and its effect on interactive traffic. An optimization that makes one batch fast while starving every other tenant is a poor trade.

Use query plans and representative data. PostgreSQL's [EXPLAIN documentation](https://www.postgresql.org/docs/16/using-explain.html) explains estimated and actual plan behavior. `EXPLAIN ANALYZE` executes the statement; it needs particular care for writes and expensive queries. A new index can reduce read cost while adding write, storage and maintenance cost. Evaluate the workload balance before declaring it free performance.

Look for failed work that repeats. If a job deterministically fails on invalid input and is retried ten times, a validation change can save more than a compute discount. Keep retryable infrastructure failures distinct from permanent input errors. Bound retries and make exhausted work visible.

Reducing payload size can lower serialization, memory, transfer and storage together. Avoid shipping a full object graph when the user needs a summary. Make the response contract explicit so trimming data does not silently break a downstream consumer.

## Treat caching as an economic and correctness decision

A cache is worthwhile when it avoids enough expensive work to cover its own cost and operational complexity. Measure hit rate by workload, not just globally. A high hit rate on cheap lookups can obscure a low hit rate on the expensive path.

Define acceptable staleness, cache identity and invalidation ownership. Include tenant and authorization scope when cached data is private. A shared key that omits the tenant can make an inexpensive service unsafe.

Calculate what happens during a cold start or mass expiration. If a cache makes ordinary operation affordable but its absence overwhelms the origin, the cache is part of the capacity architecture. Test request coalescing, bounded fills, stale-data policies and admission limits. A synchronized expiration time can create a burst that average metrics conceal.

Do not use a cache to conceal an unbounded query whose cost keeps rising with customer data. It delays the failure until the next cold miss. Fix query shape or bound the work, then decide what remains worth caching.

An economic review should include the miss penalty and failure mode. For an expensive report, returning a previously generated version with an explicit timestamp may be acceptable. For authorization, stale grants can be dangerous. The product's semantics determine whether stale data is a recovery tool.

## Choose pricing mechanisms that fit the workload's interruptibility

Commitment discounts address price, not waste. Buy them against a stable baseline after understanding demand and the obligation's term. Forecast uncertainty matters: a discount on unused committed capacity is still a cost.

Interruptible compute can suit batch work that checkpoints safely, resumes elsewhere and tolerates delayed completion. It is a poor fit for a job whose only progress exists in memory or whose interruption produces an uncertain external side effect without recovery.

Before moving a worker pool, define the job checkpoint, ownership lease, duplicate-delivery behavior and maximum recovery delay. Record which work requires non-interruptible capacity. A mixed pool can reserve predictable capacity for deadlines while using lower-cost capacity for flexible work, but the scheduler must actually enforce those priorities.

Serverless changes the cost shape. It can remove idle compute for bursty workloads while charging for invocation, duration and associated services. High steady utilization, long execution, network transfer and database connection behavior can reverse the apparent advantage. Compare the complete path with measured duration and concurrency; do not compare only one headline compute price.

## Include data retention and observability in the review

Storage growth is usually a policy question before it is a compression question. Define which records are required for product behavior, audit, recovery and customer agreements. Assign retention and deletion rules to each class. A lower-cost archive must still meet retrieval and restore needs.

Repeated log fields and high-cardinality metrics can consume a substantial budget. Keep operational evidence useful: bounded labels, structured events, targeted sampling and explicit retention. Do not remove the only record of an uncertain payment operation because its log volume is expensive. Move authoritative business evidence into durable application records and use logs for diagnosis.

Backups require a restore budget. A cheaper backup tier with a long retrieval delay can violate the recovery-time objective. Measure the time to restore, verify and reconnect the application, including missing credentials, schema compatibility and replay of queued work. A successful backup job is not a successful recovery test.

Cross-region and cross-zone transfer needs attention because an architecture change can add recurring network cost. Co-locating everything may lower transfer cost while concentrating failure risk. Evaluate the business consequence of the chosen failure domain explicitly.

## Run a reversible cost experiment

Choose one change and name its success criteria before rollout. For example: reduce worker concurrency for a low-priority export queue, preserve the interactive API's latency objective, keep export age below its product deadline, and lower compute cost per completed export under comparable demand.

Roll out to a bounded workload cohort. Record the configuration, observation window, offered demand, completed work and relevant failures. Compare cohorts with similar data sizes and customer patterns. A quiet week after a change is weak evidence of efficiency.

Set rollback triggers tied to behavior: rising queue age, a protected operation missing its objective, failed recovery or an increase in repeated work. Preserve enough capacity to reverse the change promptly. Deleting the old footprint before proving replacement capacity can turn a reversible experiment into a prolonged incident.

Include deployment overlap and autoscaling lag in the test. An aggressively reduced minimum can look efficient overnight and fail at the first traffic burst. Measure how long capacity takes to become usable, including initialization, connection establishment and cache warmup.

## Make the result a decision record

A useful cost report explains which work was removed, which price mechanism changed, and which reliability tests support the new operating point. Keep measured savings separate from forecast savings. Include the date and assumptions of any vendor price used in a forecast.

Document residual limits: the peak workload tested, the failure mode retained, the recovery time observed, and the owner of the next review. If savings depend on customer behavior staying below a threshold, expose that threshold as an operational signal.

Cost and reliability often improve together when redundant work, long resource ownership and uncontrolled retries are removed. The difficult tradeoffs begin when savings consume recovery options. Make those options visible before the bill becomes the only number in the conversation.

Originally published on [Israel Oduguwa's website](https://israel-oduguwa.vercel.app/articles/infrastructure-cost-and-reliability).
