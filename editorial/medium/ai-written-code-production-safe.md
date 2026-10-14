# Reviewing generated code before it reaches production

How I assess a proposed implementation against the repository, the task and the system's failure boundaries.

Written with AI assistance.

A proposed implementation can compile and still solve the wrong problem. It may use an API the repository does not support, assume a permission the caller does not have or leave a failure path without recovery. Those problems matter whether the code came from a colleague, a model or your own first attempt.

When evaluating generated work, I start with the task and the source material. A confident explanation is not evidence that the implementation matches either one.

## Establish the reference first

The reviewer needs to know what counts as a correct result. That includes the requested behavior, the relevant repository conventions, the constraints and the evidence the solution must use.

For a frontend task, a reference might describe the current component contract, an API response shape and the behavior expected when a request fails. If those details are missing, reviewers can end up rewarding different solutions for incompatible reasons.

At micro1, I design frontend engineering evaluation tasks from supplied source material, write expert reference outputs and define objective assessment criteria. The examples in this article use public engineering scenarios; micro1 retains the internal task materials and model responses.

## Trace the implementation across boundaries

A feature rarely lives in one component. Follow the request from the browser through the API and persistence layer to any external integration. Check how the response returns to the interface and what happens if it does not.

For example, a loading flag needs a success path and a failure path. A request may time out, return an unexpected shape or finish after the user navigates away. A button that stays disabled indefinitely is a product bug even if the network call was technically valid.

On the server, check authorization and tenant scope before the mutation. Check whether retries preserve the operation's identity. Check what state remains if the process fails midway through the workflow.

## Make the criteria observable

“High-quality code” is too broad to grade consistently. Split the assessment into things a reviewer can inspect:

- Correctness: does the implementation produce the requested behavior, including the specified failure cases?
- Completeness: are the connected layers and necessary state transitions covered?
- Source use: does the implementation follow the supplied contracts rather than inventing interfaces?
- Security: are permissions, inputs and secret boundaries enforced in the relevant place?
- Maintainability: can another engineer understand the change without relying on the author's explanation?
- Performance: does the design add unnecessary work or unbounded concurrency for the expected workload?

These dimensions need task-specific evidence. A small UI fix should not be judged by the volume of its architecture discussion. A payment mutation should not pass just because the form looks right.

## Tests should challenge the claim

A test that repeats the implementation's assumptions can make a flawed solution look convincing. Better tests exercise the task's boundary: another tenant's resource, an interrupted request, a repeated event, an invalid response or a state transition that is no longer allowed.

For concurrency claims, use competing workers or processes when the distinction matters. An exception thrown inside one process does not reproduce every effect of that process disappearing.

SafeStripe's [reliability work](https://israel-oduguwa.vercel.app/work/safestripe) records the tested scenarios and their recovery results. Another engineer can inspect the tests and decide which failure paths their own application still needs to cover.

## Review a request history with controlled completions

A search component issues A, then B. Resolve B first and verify that it owns the visible result. Now resolve A. The result should remain B through every state write, not only at the final assertion. Repeat with A failing after B succeeds: an obsolete error must not replace the current success with a failure screen.

Then run A–B–A. The first and third requests contain the same text but have different lifetimes. A query-equality guard can admit the first completion after the third request starts. The contract concerns request ownership, so a counter, token or another valid identity mechanism needs to distinguish them.

Cancellation is useful resource management. Keep the ownership guard even when the transport supports abort. A mocked transport can deliberately ignore cancellation to exercise that guard, and another asynchronous processing stage may already have begun. Test disposal and account switching as ownership changes too.

Use an independently controlled recorder for publication. If the candidate supplies a log claiming that it ignored stale data, compare that claim with actual state writes or visible updates. An implementation-specific test expecting one variable name would reject valid alternatives while missing the behavior that matters.

## Inspect changes that make the evidence weaker

A generated patch can change the tests, installation command or mocks along with the feature. Some changes are necessary, but they alter what a passing run means. Retain an authoritative set of regression checks and inspect whether the patch bypassed validation, broadened credentials or replaced a real dependency contract with a constant answer.

For a server command, observe both success and forbidden effects. A successful response after a caught exception may conceal an uncommitted operation. An error response may conceal a partial write. Keep pre-state and post-state, required audit evidence and provider-call identity in the review artifact.

When a required environment cannot run, record that outcome separately. Do not infer that code is correct because the author supplied a convincing test transcript. Execute the command under the pinned repository revision and retain the actual exit status and artifacts.

## Keep the explanation tied to evidence

A good review can say which behavior is correct, where the implementation diverges and what would establish a fix. It should distinguish an observed failure from a suspected one and a tested scenario from an unverified claim.

The review should leave the next engineer with enough evidence to check the fix and maintain the system.

Originally published on [Israel Oduguwa's website](https://israel-oduguwa.vercel.app/articles/ai-written-code-production-safe).
