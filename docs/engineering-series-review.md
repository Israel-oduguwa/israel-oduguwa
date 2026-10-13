# Engineering collection review

13 October 2026. Nineteen articles, each with a distinct engineering decision, concrete failure cases and primary references. Historical context dates span 25 January 2024 through 19 February 2026. Actual website publication dates remain 13 October 2026. All nineteen are live on the website. Nine are published on Medium; ten verified saved drafts await its rolling 24-hour limit resetting.

## Writing review

The named Antislop, Antislop Copywriting, anti-defensive-writing, Humanizer and Avoid AI Writing skills were applied. Antislop during mode and the existing editorial design were retained. The initial manual review checked claims, examples, version scope, repetition and unnecessary caveats. One targeted cleanup pass changed three articles; the other sixteen needed no prose changes after drafting. No article used a second cleanup pass. Quote normalization ran only on the edited prose fragments against their original fragments; it left the selected wording and quote style intact.

All nineteen original-to-final preservation checks passed, including frontmatter, code, headings, links and numeric content. The local writing detector ran in technical / rendered-markdown mode before and after cleanup. Its outputs are writing diagnostics, not authorship evidence or a promise about other detectors. Residual flags were reviewed and retained where the wording served a technical purpose: noun “features” in two articles, “genuine crawler traffic” distinguishing verified traffic from a spoofed user agent, and “actionable errors” in a protected state diagram. Stop reason: no justified prose edits remained.

| Article | Prose words reported by detector | Cleanup passes |
| --- | --- | --- |
| coding-agent-reward-hacking.md | 1678 | 0 |
| coding-agent-tests-and-task-correctness.md | 1643 | 0 |
| coding-agent-training-data.md | 1848 | 0 |
| crud-to-workflow-engine.md | 1762 | 1 |
| debugging-production-under-load.md | 1792 | 0 |
| deciding-when-to-split-a-monolith.md | 1517 | 0 |
| engineering-seo-at-scale.md | 1796 | 1 |
| incremental-system-migrations.md | 1608 | 0 |
| infrastructure-cost-and-reliability.md | 1737 | 0 |
| maintainable-frontend-systems.md | 1547 | 0 |
| multi-tenant-authorization-boundaries.md | 1595 | 0 |
| nextjs-rendering-strategy-tradeoffs.md | 1612 | 0 |
| node-backend-overload-and-security.md | 1757 | 0 |
| production-web-security-architecture.md | 1648 | 0 |
| react-nextjs-architecture-boundaries.md | 1520 | 0 |
| reliable-multi-step-ui-state.md | 1631 | 0 |
| reliable-saas-billing-workflows.md | 1742 | 1 |
| saas-scaling-and-unit-economics.md | 1609 | 0 |
| useful-architecture-decision-records.md | 1445 | 0 |

## Technical evidence

- Eight deliberately flawed, hand-authored transfer implementations plus a reference; seven probes produce 63 recorded verdicts. All nine pass the response-only probe, the reference passes every probe, and every mutant fails at least one. The source and JSON results are committed under examples/engineering-series. This tests known grader blind spots, not model behavior or training performance.
- Four meaningful teaching-example tests cover approval authority and versioning, stale validation, evaluator sensitivity, and bounded admission with idempotent release and shutdown. They run with the existing tests in the repository test command.
- Lint, TypeScript checks, all 14 tests and the production build passed. All 25 article routes were generated, including the 19 new routes.
- SQL and framework integration fragments are explicitly illustrative. PostgreSQL was not run. No provider transaction, SFT job, preference-training job or production load experiment is represented as executed. Hypothetical capacity and cost values are labeled.
- Primary-source research checked Node 20/22 API semantics, PostgreSQL 16 policies and isolation, dated Fowler and Nygard essays, EvalPlus, SWE-bench v3, InstructGPT methodology, DPO v3 equation 7, METR June 2025 observations, React/Next.js release behavior, RFC 9700, OWASP guidance, Stripe billing/webhooks, and Google Search documentation. New claims use capabilities available by each labeled context date.

## Browser evidence

- GitHub checks and Vercel deployment passed for `ad0a2a6`. All nineteen live pages have the expected title, full content, canonical URL, context label, Open Graph publication date and JSON-LD publication date.
- Every paragraph and code block in nine published Medium stories was compared with the source. Canonical URLs, disclosures and actual publication timestamps were verified. The ten remaining saved drafts passed the same content checks after reload. The original seven drafts and existing posts were preserved.
- Medium rejected further publishing and scheduling under its rolling 24-hour limit. The exact draft queue is retained, and the active 09:00 Africa/Lagos automation will finish only this approved collection from 15 October. Newly written daily articles remain review-only. This is an external publication limit; the ten pending stories are not claimed as published.
- All nineteen routes checked at 320, 390 and 1440 pixels in both themes: 114 layout checks, with no document or prose overflow. Long code and text diagrams scroll locally.
- All 156 table-of-contents links clicked and their URL fragments verified. All nineteen index links and nineteen return links clicked. The index contains 25 entries numbered 01 through 25.
- All forty-five distinct article reference links were clicked. Primary-source research verified their destinations and version scope; representative browser destinations were also inspected. Links to the teaching examples now resolve to committed public source.
- Theme toggle works in both modes; mobile menu opens and closes; keyboard Enter activates the skip link to main-content. Existing shared controls retain the prior reviewed handlers and focus styles.
- No captured browser console errors during the collection checks. Header descriptions and date bylines measure 5.94:1 in light mode and 8.90:1 in dark mode. Body and code colors retain the previously verified palette.

## Antislop delivery gate

| Item | Status | Evidence |
| --- | --- | --- |
| R-02 | PASS | No em dashes in the nineteen manuscripts; concrete terminology and reviewed prose. |
| R-03 | PASS | 114 route/width/theme checks; no document or prose overflow. |
| R-17 | PASS | 63 matrix verdicts reproduced; capacity, price and workload arithmetic labeled hypothetical. |
| R-18 | PASS | No testimonial or fictional professional history added. |
| R-23 | PASS | User explicitly requested code and drawings; diagrams are text-based, with no new raster asset. |
| R-24 | PASS | 156 section links plus 38 index/return actions verified; existing navigation retained. |
| R-25 | PASS | New byline and description colors measure 5.94:1 / 8.90:1; retained body and code palette verified previously. |
| R-26 | PASS | Section, index, return, theme and mobile menu controls exercised. |
| R-27 | PASS | Static reading pages render directly; existing not-found and application error states retained. |
| R-28 | PASS | No FAQ added. |
| R-32 | PASS | Semantic links and visible focus rules retained; keyboard Enter activates the skip link. |
| R-33 | PASS | Changes written directly in source; exporter generates publication artifacts only. |
| R-34 | PASS | All nineteen articles checked in both themes at three widths. |
| R-35 | PASS | Production build, 14 tests and recorded click-through; inherited shared controls use the prior review. |
| R-36 | PASS | No security, compliance, model-performance or customer-success claim invented. |
| R-37 | PASS | Existing fonts, palette, editorial layout and ENERGY 2 / RHYTHM 2 / MOTION 2 declared before editing. |
| R-38 | PASS | Experiments, hypothetical scenarios and unchecked integration sketches labeled according to evidence. |
| R-01 | PASS | No gradient introduced. |
| R-04 | PASS | Existing navigation icons convey direction; no decorative icon added. |
| R-06 | PASS | Retained Bricolage Grotesque / DM Sans; monospace identifies code and diagrams. |
| R-07 | PASS | No background pattern introduced. |
| R-08 | PASS | Existing navigation arrows retained; diagram arrows express actual relationships. |
| R-09 | PASS | Existing topic tags identify article subjects; no promotional status badge. |
| R-10 | PASS | No glass effect added. |
| R-12 | PASS | No new shadow or floating card treatment. |
| R-13 | PASS | No glow added. |
| R-14 | PASS | Editorial list with content-driven titles; no feature-card template. |
| R-19 | PASS | No animation introduced; retained navigation and theme behavior. |
| R-22 | PASS | No generic illustration or AI-generated raster image. |
| Liveliness: dials | PASS | ENERGY 2 / RHYTHM 2 / MOTION 2 explicit and retained. |
| Liveliness: consistency | PASS | Restrained editorial typography and existing interaction match the declared dials. |
| Liveliness: focal point | PASS | Article title leads every reading page. |
| Liveliness: whitespace | PASS | Sections, paragraphs and source blocks define reading rhythm. |
| Liveliness: accent | PASS | Blue identifies links and actions in the retained palette. |
| Liveliness: identity | PASS | Engineering decisions, tested ownership examples and technical editorial voice. |
| Liveliness: design read | PASS | Existing portfolio direction recorded before source edits. |
| C-1 | PASS | Each addition supports navigation, evidence, chronology or a technical explanation. |
| C-2 | PASS | New links and existing theme/menu actions work; no incomplete control. |
| C-3 | PASS | Each article develops its own engineering question; overlapping topics have separate scope. |
| C-4 | PASS | Phone and desktop, both themes, keyboard and local code overflow verified. |
| C-5 | PASS | Actual example results and primary references; hypothetical arithmetic marked. |
| R-05 | PASS | Content-led article sections; no imitation terminal or generic marketing layout. |
| R-11 | PASS | Retained moderate code radius and varied editorial shapes. |
| R-15 | PASS | Specific section titles and existing All writing / case-study actions. |
| R-16 | PASS | Technical AI vocabulary describes training and evaluation, without promotional claims. |
| R-20 | PASS | Specific workflow, authorization and evaluator examples reflect the engineering subject. |
| R-21 | PASS | Existing light default with a working dark toggle. |
| R-29 | PASS | Retained slate/blue palette; no additional decorative colors. |
| R-30 | PASS | Original manuscripts and teaching examples; no copied product layout. |
| R-31 | PASS | Editorial navigation supports long reading; code and diagrams support inspection. |
