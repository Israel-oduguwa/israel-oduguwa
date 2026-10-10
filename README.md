# Israel Oduguwa

My portfolio: selected engineering work, case studies and technical writing.

Live site: https://israel-oduguwa.vercel.app/

Built with Next.js, TypeScript and Tailwind CSS. Project results and experience live in `lib/portfolio.ts`; articles live in `articles/`. The case studies distinguish client work from SafeStripe's open-source preview and link to available evidence.

## Local development

Use Node.js 22 or later.

```bash
npm ci
npm run dev
```

The contact form reads `RESEND_API_KEY` from the server environment. Copy `.env.example` to `.env.local` for local use, and configure the variables in Vercel for deployment. Without a key, visitors receive a direct-email fallback. Do not put credentials in source code or public variables.

## Checks

```bash
npm run check
npm audit
```

Checks cover linting, TypeScript, contact validation and provider failures, content links, and the production build. Email delivery is mocked in tests; running the suite does not send messages. Browser review covers desktop and mobile layout, theme switching, navigation and document links.

## Deployment

Vercel deploys the default branch. Pull requests run the checks before merge. Configure the Resend key and a sender allowed by the Resend account. Protect the public contact endpoint with Vercel's rate-limiting controls if abusive traffic appears; the honeypot and origin validation are not a distributed abuse-control service.

Review project claims against the underlying work record when editing. Keep original article dates and expose revision dates when an existing article changes substantially. Never publish private client code, student data or internal evaluation materials.

The profile uses the original `public/images/profile.png` without image edits. The original globe visual remains; its arcs illustrate remote collaboration, not a list of client locations. Reduced-motion and low-power settings use the static fallback.

Bricolage Grotesque and DM Sans are served locally from `app/fonts/`, with their Open Font License files alongside them. The site does not request fonts from Google at runtime. Page motion uses CSS and one intersection observer; offscreen sections reveal once, and the first screen remains visible before JavaScript loads. Reduced-motion settings disable these animations.

The SafeStripe card is an interactive illustration of duplicate webhook handling. It does not call Stripe or process a payment. The case study links to the actual sandbox evidence and recovery tests.
