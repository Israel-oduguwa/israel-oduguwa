# Article revision review, 14 October 2026

The nineteen-piece collection was expanded to 43,933 words including code. The full twenty-five-article library contains 51,529 words including code and 49,929 prose words. The earlier short notes gained concrete request histories and recovery analysis. The benchmark-validity article already had a substantial executed experiment and retained its body.

## Editorial decisions and evidence

The revision adds identity cutover, concurrent command admission, export authorization, stale-worker recovery, quota reservations, usage-period closure, cache-fill ownership, evaluator isolation and dataset lineage. These sections develop the individual article's problem rather than repeating a general architecture checklist. KinsCare statements use the existing résumé record: seven developers, a Realm-to-Clerk migration covering 5,000+ accounts and infrastructure savings greater than 75%. The detailed worked systems are identified as illustrative examples.

Primary-source checks included PostgreSQL 16 activity, locking, view and constraint documentation; Stripe's v1 idempotency, proration and test-clock contracts; React's external-store contract; Next.js security and release documentation; OWASP SSRF guidance; RFC 8725; EvalPlus; METR; and the SWE-bench evaluation guide. Writing references included engineering posts by Stripe, AWS, Google Cloud, Vercel, OpenAI and Airbnb on Medium. Their structures and wording were not copied into the articles.

The local writing diagnostic ran in technical/rendered-Markdown mode for all twenty-five articles. Its residuals include the product name Realm, a cited source title, technical uses of features, actionable error outcomes and the distinction between verified and forged crawlers. These are meaning-bearing or protected material, retained after review. The diagnostic is a copy-review aid, not an authorship determination. One editorial pass developed the articles; a targeted second pass removed repeated scope announcements and generic closers. Existing code-block contents remain unchanged. Seven vector diagrams were authored in source and rendered as PNG for Medium; no generated photographs or stock illustrations were added.

Article bylines and listing rows show a single readable publication date. Actual publication and revision metadata remain accurate. The historical context dates remain in archived editorial metadata and are omitted from Medium bodies. Medium exports use the concise policy disclosure "Written with AI assistance." Website prose contains no AI-assistance boilerplate.

## Execution and interface review

`npm run check` passed lint, TypeScript, nineteen tests and the production build. The new deterministic load model records 500 offered arrivals: unbounded queuing produces 20 timely and 480 late completions; deadline-aware admission produces 260 timely completions and 240 rejections. The model assumes fixed, known service cost; it is an accounting experiment, not a production capacity benchmark.

The article library passed 150 layout checks at 320, 390 and 1440 pixels in both themes. After adding intrinsic diagram dimensions and bounding the contents panel, the seven diagram pages passed 42 further image/layout checks, with every diagram loaded and no overflow. All 265 unique contents links reached their existing anchors. Every article's return link reached the writing index; keyboard activation was also exercised. Horizontal code scrolling accepts keyboard input and has a visible outline. Syntax tokens had a lowest measured contrast of 7.12:1 on the code surface. The unchanged body and metadata colours retain the previous measured AA contrast.

The contents panel now scrolls independently, keeping a long article's final links accessible. Diagram space is reserved before lazy loading, and the source drawings render uncropped. Highlighting runs on the server and renders escaped React text nodes, with line numbers excluded from the accessible code text. Unsupported language fences remain plain readable source. Production dependency audit reported zero known vulnerabilities; the existing development-only ESLint dependency chain retained five audit findings. No forced framework downgrade was applied.

Local verification records are in `output/article-revision/`: layout and diagram matrices, anchor navigation, token contrast, source preservation, word counts and writing diagnostics. Existing navigation, résumé, form and project behaviours retain their earlier recorded review in `portfolio-review.md` and `engineering-series-review.md`.

## Antislop delivery gate

Design read: retain the owner's Bricolage Grotesque headings, DM Sans body, slate surfaces and blue accent. ENERGY 2 / RHYTHM 2 / MOTION 2. Code colours distinguish syntax; the diagrams explain ownership and failure boundaries. No new ornamental motion or decorative component was added.

| Item | Status | Evidence |
| --- | --- | --- |
| R-02 | PASS | Source checks found no em dashes in article text; technical identities and code retained. |
| R-03 | PASS | 150 article layouts and 42 final diagram layouts; no page or figure overflow. |
| R-17 | PASS | Client figures come from the existing résumé record; model numbers have executed results; hypothetical prices remain identified. |
| R-18 | PASS | No testimonial or invented person introduced. |
| R-23 | PASS | Owner requested diagrams; seven source drawings added; supplied portrait unchanged. |
| R-24 | PASS | Twenty-five existing article routes and 265 valid heading destinations; return navigation exercised. |
| R-25 | PASS | Syntax contrast minimum 7.12:1; captions use slate on a light surface; unchanged body colours retain previous AA measurements. |
| R-26 | PASS | Theme, contents links, return navigation and keyboard code scrolling operate; new figures are static explanatory content. |
| R-27 | PASS | No new asynchronous application workflow; existing form states retained; code supports unknown-language fallback. |
| R-28 | PASS | No template FAQ added. |
| R-32 | PASS | Focused code scroll region has visible outline; keyboard return navigation works; contents panel permits access to final links. |
| R-33 | PASS | Renderer, date display and CSS edited directly in source; inspection scripts only produce evidence and diagram/export artifacts. |
| R-34 | PASS | Both themes passed the article and final diagram matrices. |
| R-35 | PASS | Production build, nineteen tests, 265 anchor checks and twenty-five return journeys recorded. |
| R-36 | PASS | No universal capacity, security, model improvement or detector-evasion claim; recorded and illustrative evidence distinguished. |
| R-37 | PASS | Existing portfolio direction and dials stated before editing. |
| R-38 | PASS | Real author/work record; examples identified; source links and asset files resolve. |
| R-01 | PASS | No new gradient or glow; code surface groups source apart from prose. |
| R-04 | PASS | Existing navigation icons retained; no generic decorative icon added. |
| R-06 | PASS | Existing identity fonts retained; monospace is confined to code and identifiers. |
| R-07 | PASS | No decorative grid or dot background added. |
| R-08 | PASS | Existing directional links retained; diagram arrows encode processing order. |
| R-09 | PASS | Existing article topic tags support browsing; no promotional badge added. |
| R-10 | PASS | Existing navigation remains the only translucent surface. |
| R-12 | PASS | Article figures have no shadow; existing navigation elevation retained. |
| R-13 | PASS | No glow introduced. |
| R-14 | PASS | Prose, code and drawings follow each topic's content; no uniform feature-card template. |
| R-19 | PASS | No new animation; existing motion and reduced-motion behaviour retained. |
| R-22 | PASS | Drawings explain actual described boundaries; no generic stock artwork. |
| Explicit dials | PASS | ENERGY 2 / RHYTHM 2 / MOTION 2 inherited from the portfolio direction. |
| Dial consistency | PASS | Quiet metadata, varied prose/code/figure sections and no added motion. |
| Focal point | PASS | Each route begins with its problem-specific title; code and diagrams support the explanation. |
| Structural whitespace | PASS | Existing section spacing retained; figures and code have distinct reading boundaries. |
| Deliberate accent | PASS | Blue marks links and flow arrows; syntax hues carry language meaning. |
| Identity motif | PASS | Owner's heading typography, slate palette and blue reference treatment retained. |
| Design read | PASS | Declared before rendering edits; reasons recorded above. |
| C-1 | PASS | Highlighting, reserved image dimensions and bounded contents height serve observed reading needs. |
| C-2 | PASS | All new navigable or focusable elements have verified behaviour. |
| C-3 | PASS | New sections develop concrete histories, failure boundaries and decision evidence. |
| C-4 | PASS | Phone/desktop and both themes verified; long code and contents remain navigable. |
| C-5 | PASS | No fabricated incident, outcome, quote or professional claim. |
| R-05 | PASS | Retained editorial layout; additions vary by subject and evidence. |
| R-11 | PASS | Code and figure corners retain content-specific shapes; no new pills. |
| R-15 | PASS | Existing descriptive article and project links retained. |
| R-16 | PASS | Reviewed prose uses engineering mechanisms rather than promotional slogans. |
| R-20 | PASS | Owner's name, public library and supported client work ground the writing. |
| R-21 | PASS | Both existing themes retained; neither forced. |
| R-29 | PASS | Existing slate/blue UI palette; additional token colours encode grammar with measured contrast. |
| R-30 | PASS | Company articles inform evidence quality; their visual layouts and prose were not copied. |
| R-31 | PASS | Typography, code surface, diagram size, date display and contents scrolling have stated reading purposes. |
