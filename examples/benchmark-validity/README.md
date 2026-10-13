# Frontend grader validity experiment

Run from the repository root with Node.js 20 or later:

```sh
node examples/benchmark-validity/run.mjs
```

No dependencies, API keys or model calls are required. The script evaluates five deliberately hand-written candidates against four ordinary checks and four diagnostic checks. It writes each observed verdict and assertion failure to `results.json`.

The contract is that only the latest started request can publish completion state, including errors, and no completion may publish after disposal. The transport deliberately permits completion after cancellation. Tests resolve deferred promises explicitly; elapsed time and network conditions play no role.

The ordinary suite checks final state only. Its overlap case deliberately misses an invalid intermediate write. The diagnostic suite checks both final state and absence of stale writes. This contrast is the experiment: passing a weak grader can conceal a contract violation.

`epoch` is a passing reference for this limited request-controller contract. The four other candidates are intentional mutations. These results measure the sensitivity of this small grader to those mutations. They are not model performance, a frontend benchmark, or a completeness claim about React lifecycle behavior, accessibility, caching or browser integration.

The published diagnostic cases are public examples. An actual evaluation needs separately authored, protected cases and independent review of valid alternative solutions.
