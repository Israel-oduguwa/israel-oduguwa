# Designing training data for coding agents: tasks, demonstrations and preferences

Build reproducible tasks and evidence-based labels before converting expert work into supervised or preference-training examples.

This article was written with AI assistance. Sources and example verification are linked where relevant.

Technical context: 20 February 2025. Published 13 October 2026; the context date describes the technical era examined.

A coding dataset can contain elegant explanations, valid syntax and thousands of green test runs while teaching the wrong behavior. The prompt may omit a requirement, the reference patch may depend on an unrecorded environment, or the preference label may reward confidence over correctness.

The engineering unit is a reproducible task with a defensible behavioral contract. Demonstrations and preferences are derived from that unit. If its environment or grader is unreliable, scaling annotation increases the volume of unreliable evidence.

This article proposes a data-production workflow for repository-based coding agents, using methods available by February 2025. It contains no proprietary task material, production training metrics or claim that the proposed pipeline has improved a model.

## Define the behavior the dataset is intended to teach

Start with a target workload. An agent that edits an existing backend needs different examples from a model that completes isolated algorithms. Repository navigation, dependency interpretation, tool use, regression checks and bounded changes are part of the former behavior.

Specify the agent configuration expected at deployment: available tools, file access, environment, interaction budget and permitted clarifications. A demonstration using a hidden debugger or an unavailable internal library is a poor target for an agent that cannot reproduce those actions.

Separate desired behavior from incidental expert habits. The dataset may need to teach checking authorization before mutation. It does not necessarily need to teach one expert's preferred folder names. Write acceptance criteria around observable obligations and explain which architectural constraints are part of the task.

Use a workload taxonomy that guides sampling: failure mode, language, framework, repository scale, concurrency requirement, security boundary and external dependency. Avoid collecting mostly convenient tasks and later describing them as representative of software engineering in general.

## Package a task so another engineer can reproduce it

A task package should pin the repository revision, installation procedure, runtime version and authoritative commands. Keep an environment digest or lockfile reference. Record network requirements and replace unstable external services with controlled fixtures where the task permits it.

Distinguish a baseline failure from environmental breakage. The starting repository should fail for the intended reason and retain passing regression checks. If dependency installation fails, the task has not established its baseline.

An illustrative record might look like this:

```json
{
  "task_id": "transfer-replay-014",
  "family_id": "transfer-idempotency",
  "repository_revision": "pinned-commit-in-task-manifest",
  "environment": "node20-postgres16",
  "contract_version": "2",
  "grader_version": "3",
  "required": ["one committed effect per operation identity"],
  "forbidden": ["cross-tenant mutation", "success without commit"],
  "source_license": "recorded-and-reviewed",
  "split": "train",
  "review_status": "accepted"
}
```

This is a schema illustration, not a runnable manifest. A production record needs real immutable identifiers, artifact locations and provenance. Store acceptance evidence beside the label so an audit can reconstruct why it was assigned.

Task instructions must contain the requirements that hidden checks enforce. Held-out inputs are useful; undisclosed semantics create ambiguous failures. If a task needs clarification, either encode the clarification interaction or repair the task before accepting it into a fixed-answer dataset.

## Validate the grader before producing demonstrations

Build a reference solution, then deliberately construct plausible wrong solutions. Check that the grader accepts the reference and rejects omitted validation, hard-coded fixtures, partial writes, stale results and duplicate effects where those failures are relevant.

This is mutation-based grader validation. It does not prove completeness, but it exposes specific blind spots before they become labels. The [EvalPlus research](https://arxiv.org/abs/2305.01210v3) shows why inadequate tests can accept incorrect generated programs; the data pipeline should address that measurement problem before training on its outcomes.

Keep the final grading environment under separate control. Candidate code should not be able to rewrite the authoritative tests, discover reference answers or manufacture the result artifact. Run untrusted code with bounded compute, filesystem and network access appropriate to the task.

Classify flaky outcomes explicitly. Repeated grading under the same controlled conditions should produce consistent results. A test that relies on arbitrary timing sleeps may label the same patch differently across machines. Replace the uncontrolled schedule with an explicit barrier where possible.

## Build SFT demonstrations from verified behavior

Supervised fine-tuning trains on target sequences. For a coding agent, that sequence may include repository inspection, tool calls, patch construction, execution and a final explanation. The chosen format determines which tokens and actions become learning targets.

The [InstructGPT paper](https://arxiv.org/abs/2203.02155) describes collecting demonstrations for supervised training, followed by rankings used for reinforcement learning from human feedback. Its general instruction-following results do not establish coding-agent performance; the relevant lesson here is the distinction between demonstrated behavior and comparative feedback.

Review the demonstration's final artifact and its trajectory. A correct patch reached by copying an answer unavailable at deployment teaches an unusable policy. A failed command can be educational when followed by a valid diagnosis and repair, but fabricated tool output should never be presented as executed evidence.

Decide the loss mask deliberately. User prompts, tool observations and assistant actions have different roles. An agent should learn to issue valid tool calls, while tool output normally represents environmental context rather than text it should invent. The training system must document how those message types are encoded and supervised.

Truncation is a data-quality issue. If the context window drops the original requirement while retaining the final patch, the example no longer teaches the intended conditional behavior. Check tokenized length, retained context and the final artifact's relationship to the prompt. Do not silently trim every long trajectory from the same end.

Avoid converting every successful run into a demonstration. Success under the grader is necessary evidence, but a run may contain unsafe commands, unnecessary repository-wide changes or inaccurate claims. Apply the behavioral and execution policy together.

## Collect preferences with a reason the model should learn

A preference pair needs the same task and comparable starting conditions. One candidate given more time or additional context is not a clean comparison unless the training objective explicitly includes those differences.

Apply critical correctness gates first. A patch that leaks another tenant's data should not win because its explanation is clearer. Among candidates satisfying required behavior, compare justified concerns such as regression scope, unnecessary coupling, execution cost and clarity.

Do not force a preference when both candidates fail for unrelated reasons or the evidence is insufficient. Preserve ties, ambiguous pairs and task defects in the source data. A later training format may exclude them, but the audit record should retain their meaning.

Counterbalance presentation order and remove irrelevant identity cues. Reviewers can prefer a candidate because it is longer, appears first or uses familiar language. Record evidence-specific reasons: which invariant held, which regression failed, or which change created unnecessary risk.

Preference labels can conflict because experts prioritize different valid tradeoffs. Adjudicate critical disagreements, update the rubric where it is ambiguous, and measure agreement by task slice. A single global agreement number can hide a weak security or concurrency slice.

## Understand what RLHF and DPO optimize

In a common RLHF pipeline, preference comparisons train a reward model, and a policy is optimized against that learned reward with a constraint on drift from a reference policy. The reward is an approximation to the labeling process. It can inherit shortcuts and amplify them during optimization.

[Direct Preference Optimization](https://arxiv.org/abs/2305.18290v3) derives a direct objective over preferred and rejected responses relative to a reference policy. It avoids a separate explicit reward-model fit and online reinforcement-learning loop in that training formulation. It does not remove the need for valid preferences or independent evaluation.

At the sequence level, the standard DPO loss can be written as:

```text
-log sigmoid(beta × [
  log p_policy(chosen | prompt) - log p_reference(chosen | prompt)
  - log p_policy(rejected | prompt) + log p_reference(rejected | prompt)
])
```

The probabilities must use the intended response tokens and conditioning context. Sequence length, masking and trajectory format affect the actual objective. A chosen response containing a long copied tool log is not interchangeable with a chosen sequence of assistant actions.

The coefficient and reference policy shape the optimization tradeoff; they do not turn noisy labels into calibrated correctness probabilities. Monitor whether the model learns to satisfy the task or merely produce features the preference process rewards, such as longer explanations and repeated claims of verification.

## Split by related problems, not just rows

Random row splitting can place near-identical bugs, sibling pull requests or variants of one synthetic template on both sides of the evaluation boundary. The apparent held-out score then measures familiarity with a task family more than generalization.

Group related tasks before splitting. Use repository lineage, issue family, code similarity, shared fixtures and synthetic-generation ancestry. Decide whether the evaluation claims generalization to new issues in known repositories, new repositories, new frameworks or new failure modes. Each claim needs an appropriate split.

Exact hashes catch identical artifacts. Normalized text hashes can catch formatting variants, but normalization can discard meaningful differences. Near-duplicate detection using token similarity or syntax structure needs review because common scaffolding can make unrelated tasks look similar.

Record source availability dates and known benchmark overlap. A time-based split can reduce some leakage paths; it cannot prove absence from a model's unknown pretraining corpus. Use private or newly authored tasks when appropriate and state what contamination checks actually covered.

Deduplicate demonstrations and preference pairs as well as prompts. Repeating the same patch under several paraphrases can distort weights. Remove accidental duplicates while retaining deliberately designed variants whose difference is the capability being tested.

## Design difficulty with expert and baseline evidence

Difficulty is conditional on the tools, context and budget. A task that takes an expert five minutes after being shown the relevant file may take an agent much longer when it must locate that file. Record those conditions.

Pilot tasks with experts and baseline configurations. Track completion rate, time, failure mode and annotation effort. Use those measurements to identify broken tasks and to balance the curriculum. Do not manufacture a difficulty label solely from how intimidating the prompt sounds.

Include easy tasks that teach safe routine behavior, harder tasks requiring composition, and diagnostic tasks that isolate known weaknesses. Their sampling weights should reflect the intended training objective. A diagnostic collection full of rare adversarial cases is valuable, but it is not automatically representative of deployment demand.

Expert review is most useful at the boundaries: ambiguity, hidden side effects, concurrency, permissions and compatibility. Purely stylistic cleanup should not consume the same review budget as deciding whether a transaction preserves a financial invariant.

## Close the loop with an independent evaluation set

Version the dataset, rubric, grader and environment together. Keep accepted artifacts reproducible and quarantined records traceable. Corrections to an old label should create an auditable revision rather than silently rewriting history.

Evaluate trained configurations on an independently held-out workload with slice-level results and execution evidence. Compare against the pre-training baseline under comparable budgets. Inspect regressions, not just aggregate gains. A higher average score can conceal worse authorization or recovery behavior.

The deliverable from a strong data team is more than examples per day. It is a collection whose requirements, provenance, execution and labels can survive an engineering review. That makes the data useful to SFT, preference optimization and future evaluators even when the training method changes.

Originally published on [Israel Oduguwa's website](https://israel-oduguwa.vercel.app/articles/coding-agent-training-data).
