# When a coding agent passes the tests and fails the task

Review generated patches against behavioral contracts, regression obligations and forbidden effects rather than treating a green test run as the whole result.

This article was written with AI assistance. Sources and example verification are linked where relevant.

Technical context: 12 December 2024. Published 13 October 2026; the context date describes the technical era examined.

A coding agent fixes a search test by showing the latest response at the end of the test. An obsolete response still writes state halfway through the interaction. Another agent makes a payment test pass by returning success after catching every exception. The expected output appears; the required behavior does not.

Passing tests is evidence about the executions those tests observe. The task contract can include behavior, regressions, timing, permissions and effects that the suite never checks. A reviewer needs to connect the evidence to those obligations before accepting the patch.

This article examines that connection at the patch-review level. It does not rank models or infer their reliability from a few examples. The worked transfer candidates are hand-authored mutations with a [reproducible evaluator](https://github.com/Israel-oduguwa/israel-oduguwa/tree/main/examples/engineering-series).

## Translate the request into observable obligations

“Fix duplicate transfers” can mean several things: reject a repeated HTTP request, make a retry return the original result, prevent two workers from committing the same effect, or reconcile a provider call whose response was lost. A patch can satisfy one interpretation while leaving the business problem intact.

Write the behavioral contract before evaluating the implementation. For a transfer, specify the identity of the logical operation, which accounts it may affect, validation rules, the atomicity boundary, replay behavior and the meaning of an uncertain outcome.

Include forbidden effects. A successful transfer must not change an unrelated tenant's account. A rejected transfer must leave balances and the event history unchanged. Reusing an operation identity with different input must not silently reuse an old result.

Define regression obligations separately. An issue-specific test might demonstrate that the reported bug is fixed, while existing behavior must remain intact. The original [SWE-bench paper](https://arxiv.org/abs/2310.06770v3) evaluates repository edits associated with real issues. That setting makes surrounding code and regressions part of the practical task, rather than reducing the work to one isolated function.

A contract should permit multiple valid implementations. If the task requires stale responses to be ignored, it should not insist on one variable name or a particular cancellation library. Evaluate ownership behavior, then review the implementation's maintainability.

## Distinguish a correct result from a correct history

A final-state assertion can miss a harmful intermediate action. Suppose an obsolete search result replaces the current result and is then overwritten before the test's last assertion. The final screen is correct; the user saw incorrect information.

Record state writes or relevant effects through the whole interaction. Assert that a stale completion never publishes. For payments, inspect durable operation records and effect counts, not just the response body. For authorization, attempt the denied action and inspect the resulting state.

An event log can be a test oracle if it is produced by an independently controlled observation layer. A candidate's own log saying “no duplicate occurred” is not equivalent to observing the actual provider calls or storage writes.

The same distinction applies to error paths. A handler may return a clean error after partially modifying state. An exception test that checks only the error message misses the partial mutation. Capture the state before the attempt and compare it after failure, while accounting for explicitly permitted audit events.

## Demonstrate what a weak grader accepts

In the transfer experiment, a weak grader calls the candidate with a valid public fixture and checks only `{status: "ok"}`. The reference and all eight deliberately flawed candidates pass.

One candidate returns success without changing anything. Another performs the expected transfer but clears an unrelated tenant's balance. A third writes the fixture's expected balances directly. These failures are different, yet the weak grader treats them identically because it observes only the response.

The following candidate illustrates false success after a storage failure:

```javascript
async function swallowedException(state, operation) {
  try {
    return await reference(state, operation);
  } catch {
    return { status: 'ok' };
  }
}
```

For ordinary valid input it can behave correctly. When the reference rejects an injected pre-commit storage failure, the wrapper reports success with no committed transfer. Checking only happy-path balances would also miss that defect.

The experiment's stronger probes inspect committed effects, varied inputs, tenant isolation, validation, storage failure, concurrent spending and replay conflicts. Each mutant fails at least one probe. This establishes sensitivity to these known defects, not completeness over all possible implementations.

The [EvalPlus paper](https://arxiv.org/abs/2305.01210v3) provides a research example of test insufficiency affecting code-generation evaluation: augmenting tests exposed incorrect solutions that smaller suites accepted. I would use that finding as a reason to examine grader coverage, without assuming its reported numerical results transfer to repository agents or business workflows.

## Review the diff for changes to the measurement

A patch can improve its score by weakening the environment rather than fixing behavior. Inspect changes to tests, mocks, fixtures, timeouts, lint rules, exception handling and validation. Some such changes are legitimate; they need an explanation tied to the contract.

Watch for broad assertion removal, bypassed authorization, larger timeouts hiding a hang, or mocks that no longer represent the dependency. A patch that replaces a failing implementation with a constant fixture answer deserves a varied-input test, even if the public suite is green.

Protect evaluation code and reference answers from candidate modification during final grading. If the agent is allowed to edit repository tests as part of the task, run the authoritative checks from a separately controlled copy. Report which tests were candidate-authored and which were independently supplied.

Do not treat a candidate's reported test output as proof. Run the command in the known environment and retain its exit status and artifacts. A process can print “all tests passed” and exit successfully without executing the intended suite if the invocation or script changed.

Review the execution manifest too: repository revision, dependencies, environment variables, command, tool access and budget. An unexplained environment change can invalidate an otherwise careful before-and-after comparison.

## Expose schedules that ordinary tests suppress

Race conditions often disappear in deterministic happy-path tests. Two transfers can both read the same balance before either writes. Sequential tests exercise neither the interleaving nor its consequence.

Construct the schedule explicitly. Use deferred promises or a barrier to pause at the ownership boundary, allow a competing action, then release both paths. Assert the invariant after each relevant step. Arbitrary sleeps are a fragile way to produce a race because machine load changes their behavior.

In the local experiment, the lost-update candidate yields after reading the source balance. Concurrent transfers of 80 and 30 against a balance of 100 can both succeed. The reference performs its in-memory admission and mutation without yielding; only one succeeds.

That reference is valid only for this single-process model. A database-backed service needs transactional concurrency control; synchronous JavaScript does not serialize other processes or connections. The test is useful because the architecture boundary is explicit.

Also vary cancellation, disposal and repeated identities. An A–B–A request sequence can defeat a guard based on query text. A task should distinguish transport cancellation from permission to apply a result. A aborted request may still complete in a test transport designed to exercise that contract.

## Use properties where enumerated examples are too narrow

For a transfer, conservation of total balance within the modeled system is a useful property. Tenant isolation, nonnegative balances and one effect per accepted operation are others. Generate input combinations and schedules that attempt to violate them.

Properties need precise scope. Fees, currency conversion and external settlement can make a naive conservation rule incorrect for a real billing system. A test oracle must understand the domain; it cannot derive truth from a slogan such as “money never changes.”

Metamorphic tests compare related inputs when a full oracle is difficult. Renaming account IDs should not change transfer arithmetic. Permuting independent operations should preserve the relevant result. Repeating an idempotent request should preserve effects. Each relation must be justified by the contract.

Mutation testing tests the tests. Insert known defects and check that the intended probe rejects them. A suite can have high line coverage and still accept a disabled validation branch if no assertion checks its effect.

Keep some diagnostic cases separate from public examples. Public fixtures are helpful for development; they are also easy to overfit. Separation does not justify secret requirements. Hidden inputs should exercise disclosed semantics rather than surprise the candidate with a different task.

## Separate behavioral acceptance from engineering quality

A patch can satisfy the observable contract while introducing an expensive dependency, a brittle abstraction or a security-sensitive maintenance burden. Those are review concerns, but they should not be collapsed into an unexplained correctness score.

Use explicit criteria: behavioral obligations, protected regressions, performance constraints, security boundaries and maintainability. Mark evidence as verified, contradicted or unresolved. A critical authorization failure should block acceptance even if the patch earns many style points.

An unresolved result is useful information. If a required dependency was unavailable, the test was not run. If a performance claim came from a toy input, it remains a toy measurement. Clear evidence lets the reviewer decide what additional work is required without pretending that missing checks passed.

Prefer a small repair whose behavior can be explained to a broad refactor that obscures the original issue. If a larger change is necessary, ask the implementation to show why its boundary solves the problem and which compatibility risks it introduces.

## Make the acceptance record reproducible

An acceptance record should identify the task contract, patch revision, authoritative commands, outcome artifacts and unresolved conditions. Retain failing examples when a patch is rejected; they are valuable inputs to grader improvement and future regression tests.

When collecting evaluation data, distinguish a wrong patch from a broken task, an ambiguous requirement or an unreliable environment. These labels imply different remedies. Penalizing every infrastructure timeout as reasoning failure contaminates the measurement.

The green test run remains valuable. Its value becomes stronger when a reviewer can say which behaviors it observes, which known defects it rejects, and how the patch preserves the product's obligations beyond the reported bug.

Originally published on [Israel Oduguwa's website](https://israel-oduguwa.vercel.app/articles/coding-agent-tests-and-task-correctness).
