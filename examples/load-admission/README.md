# Arrival accounting and admission

A deterministic queue model accompanying the production-load article. Run:

```sh
node examples/load-admission/run.mjs
node --test examples/load-admission/simulate.test.mjs
```

The 500 arrivals are spaced 10 milliseconds apart. Four slots each need exactly
80 milliseconds per job. A useful completion must finish within 250 milliseconds
of its offered arrival. The queue policy accepts all work. The deadline policy
rejects a job immediately if its modeled completion would miss that deadline.

`results.json` records every outcome category in the denominator. The model
has perfect knowledge of fixed service duration and excludes network, database,
CPU, cancellation and scheduling variation. Real admission uses estimates and
must be tested with actual workloads; these results demonstrate accounting and
the cost of retaining late work, not Node.js capacity or customer performance.
