# Verification boundaries

The portfolio's client results are taken from the owner's résumé and work description. They are not independent measurements of today's public client sites. The case studies distinguish personal responsibility, client work period and private material.

SafeStripe's public preview links to retained sandbox evidence and benchmarks. It does not claim universal enterprise capacity or an independent security review.

The profile image is the owner's supplied `public/images/israel-portrait.png`, also copied to `.github/profile/portrait.png`. Its bytes match the supplied file, including the checkerboard background, as requested. The globe supports manual rotation with stationary routes. Motion and hardware preferences use a static rendering of the existing geographic data.

The collaboration routes are illustrative. They do not identify the owner's location or represent a list of customers. Location text is omitted from the current pages and downloadable résumé.

The homepage payment card is a local visual illustration, clearly labeled in the interface. Its counter demonstrates the concept of repeated deliveries and one receipt; it is not a Stripe test result. Actual recovery evidence is linked in the SafeStripe case study.

`npm audit --omit=dev` reports zero known production vulnerabilities at the time of the check. The full development audit still reports an unpatched `braces` advisory through Next.js's ESLint plugin. This is a tooling dependency; untrusted glob patterns are not accepted by the portfolio. See https://github.com/advisories/GHSA-vfj7-8cjw-p6xm. Do not downgrade the framework just to hide the audit result.

Contact tests mock the email provider. They verify request limits, input validation, escaping, origin checks and safe provider failure. They do not establish that a particular Resend credential or sender configuration can deliver an email.
