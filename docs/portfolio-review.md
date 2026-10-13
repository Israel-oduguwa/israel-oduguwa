# Portfolio review, 13 October 2026

The portfolio, project pages, articles and GitHub profile README were edited with Antislop in during mode. Anti Defensive Writing was used for repeated caveats and negative framing. The owner requested that the supplied portrait remain unchanged, including its checkerboard background.

## Direction and decisions

Reading this as a portfolio for engineering hiring teams, using the existing bold headings, blue accent and varied sections. ENERGY 2 / RHYTHM 2 / MOTION 2.

| Decision | Reason |
| --- | --- |
| Keep the existing blue and slate palette | Preserve the portfolio's identity; lighter blue makes links readable on dark surfaces. |
| Keep Bricolage Grotesque and DM Sans | Distinctive headings identify the owner; the body font supports longer engineering case studies. |
| Keep the name and portrait as the first focal point | Visitors need to identify the person before reviewing the work. |
| Use the supplied portrait unchanged | The owner explicitly chose to keep the supplied file and its background. |
| Remove portrait orbits, the floating label and the role indicator | The photo and role already provide that information. |
| Keep the featured SafeStripe project and two client projects | The open-source library has an interactive explanation; the client work has product screenshots and recorded results. |
| Replace capability cards with a definition list | These are descriptions of the owner's work, so headings and short explanations are enough. |
| Retain the experience timeline, certificate rows and article list | Dates, documents and writing each need a different reading pattern. |
| Use larger spacing between sections and smaller spacing within them | Keep related evidence together while separating work, background and contact. |
| Keep a single translucent navigation surface | The fixed navigation remains readable while content scrolls beneath it. |
| Keep relevant action and status icons | Moon and sun identify themes; document icons identify the resume; checks and replay identify the illustration's states and actions. |
| Keep outward arrows on external references | They identify links that open a separate site or document; repeated internal-link arrows were removed. |
| Keep the globe as an illustration of remote work | Its label describes illustrative routes; the routes use one blue tone and stay still. |
| Retain only restrained entry and hover motion | Section reveals establish reading order; hover and counter transitions acknowledge actions. Reduced motion uses static content. |
| Keep the globe's atmospheric edge as the only glow | It separates the globe's silhouette from the dark availability section. |
| Retain shadows on navigation and the illustration | They separate fixed navigation and the interactive example from their surrounding surfaces. |
| Use compact button corners and larger image/card corners | Controls and content containers have distinct shapes. |

## Verification

`npm run check` passed: lint, TypeScript, all 10 existing tests and the production build. Browser review used the production build on `127.0.0.1:3005`.

The homepage was reviewed at 320, 375, 390, 768 and 1440 pixels in both themes. All three case studies, the article index and all five articles were reviewed at 390 and 1440 pixels in both themes. All 46 combinations returned their expected pages, with no horizontal overflow or application errors. The lowest measured normal-text contrast was 4.72:1; the lowest large-text contrast was 4.84:1.

Additional form-state checks measured placeholder contrast at 5.94:1 in light mode and 8.90:1 in dark mode. Success messages measured 4.72:1 and 13.03:1; error messages measured 6.09:1 and 9.64:1. Contact success and error responses were intercepted locally. These checks verified interface feedback and did not send email.

The portrait in `public/images/israel-portrait.png` and `.github/profile/portrait.png` matches the supplied file byte for byte: SHA-1 `6ef5227b3db7895e1050c9dfcc6d270e95292252`.

Project figures retain the owner's existing work record and work periods. The linked SafeStripe lifecycle run was verified as completed successfully. The case studies state the period or workload covered by their evidence.

The browser reported an upstream Three.js Clock deprecation warning during globe rendering. It reported no application errors. Udemy's verification link opened its certificate URL behind a provider challenge; the original certificate PDF also opened locally. Email links were checked against the owner's address; delivery through a visitor's email application depends on their setup.

## Delivery gate

Each PASS records the requirement and its evidence. Static project, credential and article lists come from repository content; the contact form and decorative globe provide the relevant runtime states.

### Hard gates

| Rule | Status | Evidence |
| --- | --- | --- |
| R-02: natural copy and punctuation | PASS | Reviewed rendered copy, articles, metadata and README; no em dashes or listed marketing filler in the edited content. |
| R-03: mobile layout | PASS | Five homepage widths and two widths for every content page; no horizontal overflow; action targets enlarged to 44 pixels. |
| R-17: real figures | PASS | Existing project results and their work periods retained; no new metric added. |
| R-18: real testimonials | PASS | No testimonial section or invented person added. |
| R-23: authorized assets | PASS | Supplied portrait copied unchanged at the owner's request; existing navigation and identity retained. |
| R-24: navigation destinations | PASS | Desktop and mobile links reached existing sections and the article index; heading links reached actual article headings. |
| R-25: contrast | PASS | All measured text meets 4.5:1 for normal text and 3:1 for large text; form placeholders and feedback measured separately. |
| R-26: working controls | PASS | Links, theme toggle, menu, replay/reset and contact feedback exercised; records below. |
| R-27: states | PASS | Empty form validation, sending state, success/reset, provider-error fallback and static globe fallback verified. |
| R-28: relevant questions | PASS | No template FAQ added. |
| R-32: keyboard access | PASS | Visible skip-link focus, Enter navigation, keyboard replay, menu Enter/Escape and focus return verified. |
| R-33: direct source edits | PASS | Changes made in the application components and styles; review scripts only inspected the browser and generated review artifacts. |
| R-34: working themes | PASS | All 46 page/theme/width combinations passed; contact feedback and placeholders checked in both themes. |
| R-35: execution and click-through | PASS | Production build passed; recorded navigation and interaction review below; zero application errors. |
| R-36: accurate claims | PASS | Existing facts retained; repeated caveats consolidated; preview and client work periods remain explicit. |
| R-37: design direction | PASS | Existing portfolio direction retained and design read declared before editing. |
| R-38: honest content | PASS | Example order and webhook counts labeled as an illustration; existing client work and supplied portrait used. |

### Purpose gates

| Rule | Status | Evidence |
| --- | --- | --- |
| R-01: color treatments | PASS | Removed decorative dots, grids and social-card orbs; existing blue identity retained. |
| R-04: relevant icons | PASS | Removed generic capability glyphs; retained document, theme, menu and illustration action/status icons. |
| R-06: typography | PASS | Existing heading/body typefaces retained for identity and readability; monospace limited to actual code and identifiers. |
| R-07: backgrounds | PASS | Removed the page grid and featured-card dot background. |
| R-08: arrows | PASS | Removed internal-link and submit arrows; retained the scroll cue and external-reference cues. |
| R-09: labels | PASS | Role is plain text; availability labels describe actual work sought; paid status belongs to the labeled example. |
| R-10: translucent surfaces | PASS | Fixed navigation is the single translucent surface in the rendered routes. |
| R-12: shadows | PASS | Shadows separate fixed navigation, image controls and the interactive illustration; capability rows are flat. |
| R-13: glow | PASS | Globe atmospheric edge is a single silhouette treatment; role indicator glow removed. |
| R-14: hierarchy | PASS | Featured library, client screenshots, experience timeline, capability list and certificate rows serve different content. |
| R-19: motion | PASS | Stationary globe routes and no auto-rotation; motion retained for entry, hover and user-triggered counts; reduced-motion fallback verified. |
| R-22: illustrations | PASS | Supplied portrait, real project screenshots and explicitly labeled existing teaching illustrations. |

### Liveliness

| Item | Status | Evidence |
| --- | --- | --- |
| Explicit dials | PASS | ENERGY 2 / RHYTHM 2 / MOTION 2 declared before edits. |
| Consistent dials | PASS | Bold name, mixed section compositions and restrained transitions visible in the browser review. |
| Focal point | PASS | Name/portrait first; project title, experience heading or article title leads each section. |
| Structural whitespace | PASS | Wider section spacing separates topics; tighter rows connect related evidence. |
| Deliberate accent | PASS | Existing blue identifies names, key actions and links; other surfaces remain neutral. |
| Identity motif | PASS | Existing IO wordmark and distinctive name typography connect navigation, page and footer. |
| Design read | PASS | Recorded above and announced before generation. |

### Craftsmanship and quality locks

| Item | Status | Evidence |
| --- | --- | --- |
| C-1: intent | PASS | Major decisions and their reasons are recorded above. |
| C-2: complete interactions | PASS | Controls exercised, with contact responses intercepted and email links address-checked. |
| C-3: content composition | PASS | Each section supplies work, experience, background, credentials, writing or contact information. |
| C-4: resilience | PASS | Both themes, mobile layouts, keyboard controls, form failure and reduced motion verified. |
| C-5: evidence | PASS | Existing owner work record and public project references retained; no invented result or quote. |
| R-05: page structure | PASS | Capability tiles replaced with a list; projects, timeline, certificates and writing retain distinct compositions. |
| R-11: radii | PASS | Buttons use compact corners; cards/images use larger corners; navigation remains a distinct grouped surface. |
| R-15: specific actions | PASS | View my work, Read the case study, All articles, Verify credential, Contact me and Send message name their actions. |
| R-16: specific wording | PASS | First-person descriptions name projects and responsibilities; generic promotional language removed. |
| R-20: identity | PASS | Supplied portrait, name typography, actual work history and project evidence identify this owner. |
| R-21: theme choice | PASS | Light default and working saved theme toggle retained. |
| R-29: palette | PASS | Blue and slate identity retained; green/red used for meaningful success/error states. |
| R-30: originality | PASS | Existing portfolio identity refined; no third-party product design copied. |
| R-31: decision reasons | PASS | Color, type, layout, spacing, imagery, icons, motion and surfaces documented above. |

## Copy review

The revised copy leads with the owner's work, uses first person where appropriate and retains details such as mobile games, CS50 and the Food Science degree. Technical references to AI describe the owner's actual coursework and evaluation experience. The edit adds no project, customer, result, date of employment or testimonial. Original article publication dates remain intact; revision dates are 13 October 2026.

## Recorded controls and destinations

The following records come from the browser review. Repeated mobile checks were replaced by the final checks that waited for the destination URL in both themes. Shared navigation/footer components were tested on the homepage; additional page-specific links were tested in each case study and article.

| Page/theme | Control | Result |
| --- | --- | --- |
| Homepage | Skip to content | navigated: /#main-content |
| Homepage | IO. | navigated: /#top |
| Homepage | Work | navigated: /#work |
| Homepage | Experience | navigated: /#experience |
| Homepage | About | navigated: /#about |
| Homepage | Availability | navigated: /#availability |
| Homepage | Writing | navigated: /articles |
| Homepage | Résumé | opened new tab: /documents/israel-oduguwa-resume.pdf |
| Homepage | Contact me | navigated: /#contact |
| Homepage | SafeStripe | navigated: /#work |
| Homepage | KinsCare | navigated: /work/kinscare |
| Homepage | Excel Health Careers | navigated: /work/excelcna |
| Homepage | View my work | navigated: /#work |
| Homepage | Read my résumé | opened new tab: /documents/israel-oduguwa-resume.pdf |
| Homepage | See project results | navigated: /#work |
| Homepage | SafeStripe | navigated: /work/safestripe |
| Homepage | Read the case study | navigated: /work/safestripe |
| Homepage | kinscare.orgRead case study | navigated: /work/kinscare |
| Homepage | KinsCare | navigated: /work/kinscare |
| Homepage | Read the case study | navigated: /work/kinscare |
| Homepage | excelcna.comRead case study | navigated: /work/excelcna |
| Homepage | Excel Health Careers | navigated: /work/excelcna |
| Homepage | Read the case study | navigated: /work/excelcna |
| Homepage | Download full résumé | opened new tab: /documents/israel-oduguwa-resume.pdf |
| Homepage | Read the case study | navigated: /work/excelcna |
| Homepage | Read the case study | navigated: /work/kinscare |
| Homepage | Open certificate: Building AI Agents with OpenAI | opened new tab: /documents/coursera-ai-agents.pdf |
| Homepage | Verify credential | opened new tab: https://www.coursera.org/account/accomplishments/specialization/J6PYEOZO0PN5 |
| Homepage | Open certificate: Generative AI for NodeJS: OpenAI, LangChain - TypeScript | opened new tab: /documents/udemy-generative-ai-nodejs.pdf |
| Homepage | Verify credential | opened new tab: https://www.udemy.com/certificate/UC-3eb8e8b7-669e-42de-bb6a-cc4766816210/ |
| Homepage | All articles | navigated: /articles |
| Homepage | 01Systems · Reliability · 3 min readWhat a crashed payment worker leaves behindHow SafeStripe uses leases, ownership checks and transactions to recover work aft | navigated: /articles/worker-ownership-and-payment-recovery |
| Homepage | 02Operations · Reliability · 3 min readWhat changes when a workflow reaches productionA deployment review focused on failure recovery, observable state and the  | navigated: /articles/from-it-works-locally-to-production |
| Homepage | 03AI evaluation · Code review · 3 min readReviewing generated code before it reaches productionHow I assess a proposed implementation against the repository, th | navigated: /articles/ai-written-code-production-safe |
| Homepage | Read my résumé | opened new tab: /documents/israel-oduguwa-resume.pdf |
| Homepage | IO. | navigated: /#top |
| Homepage | GitHub | opened new tab: https://github.com/Israel-oduguwa |
| Homepage | Writing | navigated: /articles |
| Homepage | Résumé | opened new tab: /documents/israel-oduguwa-resume.pdf |
| Homepage | Replay webhook | 2 deliveries, 1 receipt |
| Homepage | Reset | returns to 1 delivery and disables reset |
| Homepage | Send message with empty fields | browser requires name |
| Homepage | Contact success (intercepted response) | sending state, success message, fields reset; no email sent |
| Homepage | Contact error (intercepted response) | direct-email fallback shown, fields retained; no email sent |
| Homepage | Keyboard skip link | Tab shows focus; Enter reaches #main-content |
| Homepage | Theme toggle | scroll-smooth light |
| /work/safestripe | Selected work | navigated: /#work |
| /work/safestripe | Repository | opened new tab: https://github.com/Israel-oduguwa/SafeStripe |
| /work/safestripe | Documentation | opened new tab: https://israel-oduguwa.github.io/SafeStripe/ |
| /work/safestripe | Try the sandbox | opened new tab: https://safestripe-demo.vercel.app/ |
| /work/safestripe | Watch the 30-second explainer | opened new tab: https://israel-oduguwa.github.io/SafeStripe/demo/ |
| /work/safestripe | Retained Stripe test run | opened new tab: https://github.com/Israel-oduguwa/SafeStripe/actions/runs/37600727941 |
| /work/safestripe | Benchmark results | opened new tab: https://israel-oduguwa.github.io/SafeStripe/benchmarks/ |
| /work/safestripe | Discuss a project | navigated: /#contact |
| /work/kinscare | Selected work | navigated: /#work |
| /work/kinscare | Visit KinsCare | opened new tab: https://www.kinscare.org/ |
| /work/kinscare | Discuss a project | navigated: /#contact |
| /work/excelcna | Selected work | navigated: /#work |
| /work/excelcna | Visit Excel Health Careers | opened new tab: https://www.excelcna.com/ |
| /work/excelcna | Discuss a project | navigated: /#contact |
| /articles | 01Systems · Reliability · 3 min readWhat a crashed payment worker leaves behindHow SafeStripe uses leases, ownership checks and transactions to recover work aft | navigated: /articles/worker-ownership-and-payment-recovery |
| /articles | 02Operations · Reliability · 3 min readWhat changes when a workflow reaches productionA deployment review focused on failure recovery, observable state and the  | navigated: /articles/from-it-works-locally-to-production |
| /articles | 03AI evaluation · Code review · 3 min readReviewing generated code before it reaches productionHow I assess a proposed implementation against the repository, th | navigated: /articles/ai-written-code-production-safe |
| /articles | 04Security · Backend · 3 min readA role is not enough to authorize a requestChecking ownership, tenant scope and resource state at the point where an applicatio | navigated: /articles/authorization-architecture-beyond-roles |
| /articles | 05Payments · Reliability · 4 min readStripe idempotency does not finish the payment workflowHow request retries, repeated webhooks and local business effects ne | navigated: /articles/stripe-idempotency-your-app-still-needs-it |
| /articles | Read the SafeStripe case study | navigated: /work/safestripe |
| /articles/worker-ownership-and-payment-recovery | All writing | navigated: /articles |
| /articles/worker-ownership-and-payment-recovery | 0.3 preview | opened new tab: /work/safestripe |
| /articles/worker-ownership-and-payment-recovery | a Stripe sandbox lifecycle run | opened new tab: https://github.com/Israel-oduguwa/SafeStripe/actions/runs/37600727941 |
| /articles/worker-ownership-and-payment-recovery | architecture and reliability contracts | opened new tab: https://israel-oduguwa.github.io/SafeStripe/ |
| /articles/worker-ownership-and-payment-recovery | Explore my work | navigated: /#work |
| /articles/worker-ownership-and-payment-recovery | A claim is temporary ownership | navigated: /articles/worker-ownership-and-payment-recovery#a-claim-is-temporary-ownership |
| /articles/worker-ownership-and-payment-recovery | Save the event before returning success | navigated: /articles/worker-ownership-and-payment-recovery#save-the-event-before-returning-success |
| /articles/worker-ownership-and-payment-recovery | Commit the local business decision together | navigated: /articles/worker-ownership-and-payment-recovery#commit-the-local-business-decision-together |
| /articles/worker-ownership-and-payment-recovery | Test the disappearance | navigated: /articles/worker-ownership-and-payment-recovery#test-the-disappearance |
| /articles/worker-ownership-and-payment-recovery | The limits are part of the design | navigated: /articles/worker-ownership-and-payment-recovery#the-limits-are-part-of-the-design |
| /articles/worker-ownership-and-payment-recovery | Related projectSafeStripeHow webhook retries and worker recovery work. | navigated: /work/safestripe |
| /articles/from-it-works-locally-to-production | All writing | navigated: /articles |
| /articles/from-it-works-locally-to-production | Excel Health Careers | opened new tab: /work/excelcna |
| /articles/from-it-works-locally-to-production | SRE monitoring chapter | opened new tab: https://sre.google/sre-book/monitoring-distributed-systems/ |
| /articles/from-it-works-locally-to-production | case study | opened new tab: /work/kinscare |
| /articles/from-it-works-locally-to-production | Explore my work | navigated: /#work |
| /articles/from-it-works-locally-to-production | Follow one workflow all the way through | navigated: /articles/from-it-works-locally-to-production#follow-one-workflow-all-the-way-through |
| /articles/from-it-works-locally-to-production | Put limits on background work | navigated: /articles/from-it-works-locally-to-production#put-limits-on-background-work |
| /articles/from-it-works-locally-to-production | Measure the user-visible failure | navigated: /articles/from-it-works-locally-to-production#measure-the-user-visible-failure |
| /articles/from-it-works-locally-to-production | Review the running cost | navigated: /articles/from-it-works-locally-to-production#review-the-running-cost |
| /articles/from-it-works-locally-to-production | Release with a recovery path | navigated: /articles/from-it-works-locally-to-production#release-with-a-recovery-path |
| /articles/from-it-works-locally-to-production | Related projectSafeStripeHow webhook retries and worker recovery work. | navigated: /work/safestripe |
| /articles/ai-written-code-production-safe | All writing | navigated: /articles |
| /articles/ai-written-code-production-safe | reliability work | opened new tab: /work/safestripe |
| /articles/ai-written-code-production-safe | Explore my work | navigated: /#work |
| /articles/ai-written-code-production-safe | Establish the reference first | navigated: /articles/ai-written-code-production-safe#establish-the-reference-first |
| /articles/ai-written-code-production-safe | Trace the implementation across boundaries | navigated: /articles/ai-written-code-production-safe#trace-the-implementation-across-boundaries |
| /articles/ai-written-code-production-safe | Make the criteria observable | navigated: /articles/ai-written-code-production-safe#make-the-criteria-observable |
| /articles/ai-written-code-production-safe | Tests should challenge the claim | navigated: /articles/ai-written-code-production-safe#tests-should-challenge-the-claim |
| /articles/ai-written-code-production-safe | Keep the explanation tied to evidence | navigated: /articles/ai-written-code-production-safe#keep-the-explanation-tied-to-evidence |
| /articles/ai-written-code-production-safe | Related projectSafeStripeHow webhook retries and worker recovery work. | navigated: /work/safestripe |
| /articles/authorization-architecture-beyond-roles | All writing | navigated: /articles |
| /articles/authorization-architecture-beyond-roles | OWASP authorization guidance | opened new tab: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html |
| /articles/authorization-architecture-beyond-roles | Explore my work | navigated: /#work |
| /articles/authorization-architecture-beyond-roles | Start with the resource | navigated: /articles/authorization-architecture-beyond-roles#start-with-the-resource |
| /articles/authorization-architecture-beyond-roles | Keep enforcement near the write | navigated: /articles/authorization-architecture-beyond-roles#keep-enforcement-near-the-write |
| /articles/authorization-architecture-beyond-roles | Workers are actors too | navigated: /articles/authorization-architecture-beyond-roles#workers-are-actors-too |
| /articles/authorization-architecture-beyond-roles | Test the denied paths | navigated: /articles/authorization-architecture-beyond-roles#test-the-denied-paths |
| /articles/authorization-architecture-beyond-roles | A boundary libraries cannot invent | navigated: /articles/authorization-architecture-beyond-roles#a-boundary-libraries-cannot-invent |
| /articles/authorization-architecture-beyond-roles | Related projectSafeStripeHow webhook retries and worker recovery work. | navigated: /work/safestripe |
| /articles/stripe-idempotency-your-app-still-needs-it | All writing | navigated: /articles |
| /articles/stripe-idempotency-your-app-still-needs-it | SafeStripe's case study | opened new tab: /work/safestripe |
| /articles/stripe-idempotency-your-app-still-needs-it | Stripe's idempotent request documentation | opened new tab: https://docs.stripe.com/api/idempotent_requests |
| /articles/stripe-idempotency-your-app-still-needs-it | webhook delivery documentation | opened new tab: https://docs.stripe.com/webhooks |
| /articles/stripe-idempotency-your-app-still-needs-it | Explore my work | navigated: /#work |
| /articles/stripe-idempotency-your-app-still-needs-it | What Stripe's key protects | navigated: /articles/stripe-idempotency-your-app-still-needs-it#what-stripes-key-protects |
| /articles/stripe-idempotency-your-app-still-needs-it | A timeout is an unknown outcome | navigated: /articles/stripe-idempotency-your-app-still-needs-it#a-timeout-is-an-unknown-outcome |
| /articles/stripe-idempotency-your-app-still-needs-it | Webhook deduplication is a different guard | navigated: /articles/stripe-idempotency-your-app-still-needs-it#webhook-deduplication-is-a-different-guard |
| /articles/stripe-idempotency-your-app-still-needs-it | Where the transaction ends | navigated: /articles/stripe-idempotency-your-app-still-needs-it#where-the-transaction-ends |
| /articles/stripe-idempotency-your-app-still-needs-it | What to test | navigated: /articles/stripe-idempotency-your-app-still-needs-it#what-to-test |
| /articles/stripe-idempotency-your-app-still-needs-it | References | navigated: /articles/stripe-idempotency-your-app-still-needs-it#references |
| /articles/stripe-idempotency-your-app-still-needs-it | Related projectSafeStripeHow webhook retries and worker recovery work. | navigated: /work/safestripe |
| light | Mobile Work | navigates and closes menu: /#work |
| light | Mobile Experience | navigates and closes menu: /#experience |
| light | Mobile About | navigates and closes menu: /#about |
| light | Mobile Availability | navigates and closes menu: /#availability |
| light | Mobile Writing | navigates and closes menu: /articles |
| light | Mobile Contact | navigates and closes menu: /#contact |
| light | Keyboard menu | Enter opens; Escape closes and returns focus |
| light | Keyboard replay | Enter produces 2 deliveries and 1 receipt |
| light | Placeholder readability | Measured contrast 5.94, 5.94, 5.94:1; opacity 1 |
| light | Contact success | feedback shown; no email sent; text contrast 4.72:1 |
| light | Contact error | direct-email fallback shown; no email sent; text contrast 6.09:1 |
| dark | Mobile Work | navigates and closes menu: /#work |
| dark | Mobile Experience | navigates and closes menu: /#experience |
| dark | Mobile About | navigates and closes menu: /#about |
| dark | Mobile Availability | navigates and closes menu: /#availability |
| dark | Mobile Writing | navigates and closes menu: /articles |
| dark | Mobile Contact | navigates and closes menu: /#contact |
| dark | Keyboard menu | Enter opens; Escape closes and returns focus |
| dark | Keyboard replay | Enter produces 2 deliveries and 1 receipt |
| dark | Placeholder readability | Measured contrast 8.90, 8.90, 8.90:1; opacity 1 |
| dark | Contact success | feedback shown; no email sent; text contrast 13.03:1 |
| dark | Contact error | direct-email fallback shown; no email sent; text contrast 9.64:1 |
| Homepage | Reduced motion | static globe fallback and visible sections |
