# Technical writing and publication

Israel's audience is engineering leads and teams producing expert training data and evaluations for AI systems, including micro1. The writing should demonstrate engineering judgment through observable requirements, execution evidence, carefully designed comparisons and useful failure analysis.

## Review and cadence

Prepare one draft each day at **9:00 AM Africa/Lagos**. Israel chose review before publication. Save new drafts in `editorial/drafts/YYYY-MM-DD-topic.md`, outside `articles/`, so building the website cannot publish them accidentally. Prepare a matching Medium version and add a dated entry to `editorial/drafts/index.md` when a draft is ready.

Present the draft and its sources in this chat. Commit, push, website publication and Medium upload require Israel's approval for those daily drafts. Avoid notifications during research; notify once the finished draft is ready. A research or access blocker should identify the missing evidence or action precisely.

## Topic sequence

The first article, published on 2026-10-13, is `validating-ai-coding-benchmarks`. It includes an executable grader-sensitivity experiment with recorded results. Extend specific parts through focused articles, rather than repeating its overview.

| Priority | Proposed article | Evidence or artifact | Reader value |
| --- | --- | --- | --- |
| 1 | Testing the evaluator with valid alternative solutions | A contract with two different passing implementations and a false-rejection probe | Distinguish grader rigidity from model failure |
| 2 | Why A–B–A breaks query-based request ownership | A component-level example, controlled completions and lifecycle tests | Extend the controller experiment to actual frontend behavior |
| 3 | Designing a calibration set for a code-review judge | Public patch examples, criterion-level labels and order/style probes | Make judge error measurable |
| 4 | What is the independent unit in a coding-agent benchmark? | A clearly labeled synthetic simulation with paired repository effects | Avoid overstated model comparisons |
| 5 | Evaluator outages and the score denominator | A run manifest and deterministic failure examples | Make retry and missing-data policy reviewable |
| 6 | From an expert correction to a protected transfer task | A public defect, reference correction and separately authored case | Connect training feedback to an evaluation claim |
| 7 | Measuring correctness under an agent's time budget | A runnable task with predeclared stop rules and cost accounting | Compare configurations under equal constraints |
| 8 | Preventing a stale worker from committing an effect | SafeStripe public contracts and existing process-level tests | Connect operation identity to production reliability |
| 9 | Testing authorization across a tenant boundary | A small public service contract and negative tests | Evaluate security behavior with execution evidence |
| 10 | Tracing failures through an asynchronous media pipeline | A generalized example grounded in the public portfolio record | Demonstrate orchestration and recovery design |
| 11 | Versioning a rubric without losing comparability | Retained outputs regraded under two explicit versions | Explain score changes caused by measurement repair |
| 12 | Turning production incidents into benchmark tasks | A fictional scenario labeled as such, or a permitted public incident | Preserve realism without exposing client material |
| 13 | Reviewing source use in a repository-grounded answer | Public documentation and deliberately conflicting answer artifacts | Assess grounded reasoning beyond confident prose |
| 14 | What an evaluation release report should contain | A complete manifest and report for the public controller experiment | Give teams a reusable review artifact |

After these topics, choose the next article from documented gaps, user feedback and current primary-source research. Do not invent search-volume estimates, interviews, deployments, model outputs or measurements.

## Writing and evidence

- Answer one specific engineering question per article. Use connected prose, precise examples and technical detail that earns its place.
- Verify claims through papers, official documentation, public repositories or an executed experiment. Link the supporting source near the claim.
- Describe proposed methods as proposed methods. Label hand-written probes and synthetic simulations accurately; model comparisons require real retained outputs and equal run conditions.
- Ground professional claims in Israel's résumé and public work. micro1 is an ongoing role beginning July 2026. Keep internal tasks, responses, client code and personal records private.
- Use Antislop and anti-defensive writing as needed. Remove stock introductions, inflated claims and unnecessary caveats; preserve limits that affect interpretation.
- Read the draft aloud for awkward cadence and repeated formulas. An article should sound like an engineer explaining a decision, with enough evidence for another engineer to challenge it.

## Medium cross-posts

Use each published website article as the canonical source. Medium's official import tool creates a draft from the URL and automatically sets the canonical link and original date. Inspect the imported body before publishing: title, subtitle, lists, code, links, author text and any duplicated page navigation. If importing fails, use the prepared Markdown version and set the canonical link through Medium's story settings.

Keep a publication ledger in `editorial/medium/publication-ledger.md`. Record actual Medium URLs only after verifying them. Distinguish exported, imported draft and published states. Check for existing stories before importing to avoid duplicates.

Medium requires disclosure of generated or assisted written content within the first two paragraphs. The export includes a short accurate note for each story. Preserve that note on Medium. Do not put generated writing behind a paywall. The import tool can omit code blocks, so compare the imported draft with the Markdown source and restore missing code through the prepared HTML version before publishing.

On 2026-10-13 Medium rejected direct portfolio `vercel.app` links in the article body. The HTML export omits those body links; the imported canonical URL still points to the website and was verified after publication. Preserve technical citations to allowed primary sources.

References: [Medium import instructions](https://help.medium.com/hc/en-us/articles/214550207-Importing-a-post-to-Medium), [manual migration instructions](https://help.medium.com/hc/en-us/articles/360033931713-Trouble-importing-content-using-the-import-tool), [Medium AI content policy](https://help.medium.com/hc/en-us/articles/22576852947223-Artificial-Intelligence-AI-content-policy).
