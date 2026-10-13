# Engineering article examples

Run with Node.js 20 or later:

```sh
node --test examples/engineering-series/examples.test.mjs
node examples/engineering-series/evaluator.mjs
```

The evaluator compares eight deliberately flawed, hand-authored implementations with an in-memory reference against seven independent behavioral probes. It writes `evaluator-results.json`. These are mutation tests of a grader, not outputs from a language model, training results or a production payment system.

The reference uses synchronous state mutation within a single JavaScript process. Its atomicity does not extend to database connections, processes or machines. Database-backed transfers require transactional admission, concurrency control and durable idempotency.

`workflow.mjs` is a pure transition example; a database transaction must persist its version update, audit entry and outbox intents together. `ui-state.mjs` prevents validation results from applying to a newer draft. The tests exercise actor restrictions, conflicting versions, stale completions, and evaluator blind spots.

SQL and framework integration snippets in the articles are explanatory designs. The standalone modules here are the executable teaching examples. No PostgreSQL instance is included.
