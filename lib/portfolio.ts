export const profile = {
  name: "Israel Oduguwa",
  role: "Senior full-stack software engineer",
  email: "oduguwa.israel22@gmail.com",
  url: "https://israel-oduguwa.vercel.app",
  github: "https://github.com/Israel-oduguwa",
  resume: "/documents/israel-oduguwa-resume.pdf",
};

export type Project = {
  slug: string;
  name: string;
  category: string;
  role: string;
  period: string;
  summary: string;
  contribution: string;
  tags: string[];
  image: string;
  imageAlt: string;
  theme: "stripe" | "care" | "training";
  metrics: { value: string; label: string }[];
  challenge: string;
  decisions: { title: string; body: string }[];
  result: string;
  boundary: string;
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "safestripe",
    name: "SafeStripe",
    category: "Open-source payment infrastructure",
    role: "Creator and maintainer",
    period: "2026",
    summary:
      "A TypeScript library for recovering Stripe workflows after timeouts, repeated webhooks and worker crashes. Processing state stays in your database.",
    contribution:
      "I built the TypeScript library, database adapters, framework integrations, failure tests and public sandbox. The difficult part is deciding what a retry is allowed to repeat.",
    tags: ["TypeScript", "Node.js", "Stripe", "PostgreSQL", "Firestore"],
    image: "/images/projects/safestripe.jpg",
    imageAlt:
      "SafeStripe explainer illustrating one payment and repeated payment updates",
    theme: "stripe",
    metrics: [
      {
        value: "10",
        label: "Duplicate admissions in the retained sandbox replay",
      },
      { value: "1", label: "Original paid receipt retained by that replay" },
    ],
    challenge:
      "Stripe and an application database cannot share a transaction. A request can succeed at Stripe while the application loses the response. Webhooks can repeat, and a worker can stop after claiming a job. The application has to remember what succeeded and which work still needs completion.",
    decisions: [
      {
        title: "Keep the business operation's identity",
        body: "The caller supplies an operation ID. SafeStripe stores its scope, parameters and progress, then uses a stable Stripe idempotency key. Changed parameters conflict instead of silently becoming another mutation. Older ambiguous outcomes require review.",
      },
      {
        title: "Save accepted work before acknowledging it",
        body: "The receiver verifies the original request bytes and Stripe signature before durable admission. If storage fails, the endpoint does not acknowledge work it has not saved. Workers process admitted jobs separately from the HTTP request.",
      },
      {
        title: "Make ownership expire safely",
        body: "Jobs use expiring leases and ownership tokens. Completion checks the current owner in the transaction. The process-level tests kill real workers and verify that another worker can recover committed work without allowing a stale owner to overwrite the result.",
      },
      {
        title: "Separate local effects from external delivery",
        body: "A stable business effect key protects supported local record writes and an outbox intent in one transaction. The dispatcher delivers at least once. The receiving service must deduplicate; a database transaction cannot make an arbitrary external call exactly once.",
      },
    ],
    result:
      "The published 0.3.0 package has a public evaluation sandbox, architecture decisions, reproducible benchmarks and CI. A retained Express + Firestore sandbox run recorded twelve journeys. Its duplicate replay added ten admissions while preserving the original receipt and paid time.",
    boundary:
      "Version 0.3.0 is an evaluation preview. Sandbox tests establish the recorded scenarios, not enterprise capacity or an independent security audit. Applications still supply authorization, stable operation and effect identities, database durability and a tested recovery plan.",
    links: [
      {
        label: "Repository",
        href: "https://github.com/Israel-oduguwa/SafeStripe",
      },
      {
        label: "Documentation",
        href: "https://israel-oduguwa.github.io/SafeStripe/",
      },
      { label: "Try the sandbox", href: "https://safestripe-demo.vercel.app/" },
      {
        label: "Watch the 30-second explainer",
        href: "https://israel-oduguwa.github.io/SafeStripe/demo/",
      },
      {
        label: "Retained Stripe test run",
        href: "https://github.com/Israel-oduguwa/SafeStripe/actions/runs/37600727941",
      },
      {
        label: "Benchmarks and their limits",
        href: "https://israel-oduguwa.github.io/SafeStripe/benchmarks/",
      },
    ],
  },
  {
    slug: "kinscare",
    name: "KinsCare",
    category: "Healthcare hiring marketplace",
    role: "Software engineer; technical leadership",
    period: "Oct 2022 - Dec 2025",
    summary:
      "A marketplace connecting care providers with caregivers. My work covered the product interface, matching services, identity and the infrastructure behind them.",
    contribution:
      "I guided a seven-developer team, migrated the React frontend to Next.js, and planned the transition from MongoDB Realm to Clerk for more than 5,000 users.",
    tags: ["Next.js", "Node.js", "Python", "MongoDB", "Clerk"],
    image: "/images/projects/kinscare-homepage.jpg",
    imageAlt:
      "Public KinsCare homepage showing the caregiver and provider marketplace",
    theme: "care",
    metrics: [
      {
        value: ">75%",
        label: "Infrastructure spend reduction after modernization",
      },
      { value: "5,000+", label: "Users in the identity migration" },
    ],
    challenge:
      "Caregiver onboarding, provider jobs, matching and conversations needed to work as one product. At the same time, the frontend and identity platform needed to change without leaving existing users unable to access their accounts.",
    decisions: [
      {
        title: "Modernize the product and deployment together",
        body: "I migrated the frontend from React to Next.js and reworked production deployment and infrastructure. The work addressed page delivery and infrastructure spend as part of the same modernization, rather than treating the frontend as an isolated redesign.",
      },
      {
        title: "Plan the identity migration around continuity",
        body: "The Realm-to-Clerk migration covered more than 5,000 users despite limited exportable identity data. Preserving access and account continuity was a requirement of the transition, not an assumption that could be left until launch.",
      },
      {
        title: "Give recommendations a maintained data pipeline",
        body: "A Python and Express pipeline refreshed, normalized and indexed school, course and healthcare records. Model and data artifacts, embeddings and retrieval supported recommendation APIs. Cached results and persisted experiment assignments kept product behavior consistent.",
      },
      {
        title: "Review the frontend, backend and integrations together",
        body: "I guided seven developers through system design and code review across the frontend, backend, integrations and infrastructure. The marketplace included geospatial matching, subscriptions, lead routing, guided conversations and administrative review.",
      },
    ],
    result:
      "The modernization reduced infrastructure spend by more than 75%. The recorded Lighthouse performance score moved from 59 to 90, with SEO at 100. The identity migration preserved account continuity for the existing user base. These are results from my work period, not a measurement of today's website.",
    boundary:
      "The live site shows the public product. Client source code, user data and internal architecture details are not published here. Results reflect the work period above. Subsequent product changes and current site ownership belong to KinsCare.",
    links: [{ label: "Visit KinsCare", href: "https://www.kinscare.org/" }],
  },
  {
    slug: "excelcna",
    name: "Excel Health Careers",
    category: "Enrollment, payments and acquisition",
    role: "Senior software engineer, contract",
    period: "Mar 2025 - Apr 2026",
    summary:
      "An online enrollment platform for healthcare training. I connected registration, Stripe payment events and administrative tracking so the business could follow a student's progress.",
    contribution:
      "I redesigned enrollment, added payment recovery, and built campaign and video-generation workflows with limits on concurrent rendering jobs.",
    tags: ["Next.js", "Stripe", "Firebase", "Remotion", "AWS"],
    image: "/images/projects/excelcna.jpg",
    imageAlt:
      "Public Excel Health Careers homepage with CPR and BLS course registration",
    theme: "training",
    metrics: [
      {
        value: "+73%",
        label: "Completed enrollments after the workflow redesign",
      },
      {
        value: "8,000+",
        label: "Successful transactions supported by the enrollment layer",
      },
    ],
    challenge:
      "Course discovery, registration, payment and training administration needed to describe the same student journey. A successful Stripe payment had to become an accurate enrollment record even when delivery was delayed or repeated.",
    decisions: [
      {
        title: "Treat enrollment as a sequence of state changes",
        body: "I redesigned the Next.js platform around a unified registration-to-training journey. Integration, end-to-end and regression coverage exercised critical state transitions and administrative processes.",
      },
      {
        title: "Connect payments to a recoverable local record",
        body: "The transaction layer connected registration records, Stripe events, enrollment state and administrative tracking. Event deduplication, reconciliation and recovery paths covered duplicate, delayed, failed and out-of-order scenarios.",
      },
      {
        title: "Bound asynchronous media work",
        body: "The video-generation system coordinated OpenAI, ElevenLabs, Remotion and AWS Lambda. It used progress polling, bounded render concurrency, latency monitoring, retries and recovery paths for rendering or publishing failures.",
      },
      {
        title: "Measure acquisition against enrollment revenue",
        body: "The acquisition engine used registration and Stripe revenue data to choose campaign workflows and measure their results. Video, blog, graphics and advertising pipelines included quality gates and failure recovery before release.",
      },
    ],
    result:
      "The enrollment redesign increased completed enrollments by 73% and reduced manual operational work by 40%. The transaction layer supported more than 8,000 successful transactions. Acquisition work contributed to a 60% increase in qualified student acquisition; video generation completed in under eight minutes per item.",
    boundary:
      "These figures describe my contract work and are not a current conversion-rate or benchmark claim. The public site is linked for product context. Student records, payment data and private implementation details remain with the client.",
    links: [
      {
        label: "Visit Excel Health Careers",
        href: "https://www.excelcna.com/",
      },
    ],
  },
];

export const experience = [
  {
    company: "micro1",
    role: "Software engineer · AI model evaluation project",
    period: "Jul 2026 · one month",
    description:
      "Designed source-grounded frontend engineering tasks, expert reference outputs and objective evaluation criteria. Reviewed generated solutions for correctness, completeness, source use, performance, security and maintainability.",
  },
  {
    company: "Excel Health Careers",
    role: "Senior software engineer · contract",
    period: "Mar 2025 - Apr 2026",
    description:
      "Enrollment and Stripe payment consistency, administrative workflows, acquisition systems and asynchronous media generation.",
    project: "/work/excelcna",
  },
  {
    company: "KinsCare",
    role: "Software engineer · technical leadership",
    period: "Oct 2022 - Dec 2025",
    description:
      "Marketplace architecture, a seven-developer team, Next.js modernization, identity migration and recommendation services.",
    project: "/work/kinscare",
  },
  {
    company: "Silicio",
    role: "Full-stack developer & frontend instructor",
    period: "Nov 2021 - Apr 2022",
    description:
      "Registration, payment and administration for a training platform. Taught and mentored more than 800 learners across two academic semesters.",
  },
  {
    company: "CareerAwesome",
    role: "Full-stack developer",
    period: "Feb 2020 - Aug 2021",
    description:
      "Client and server features for job discovery, career planning and personalized guidance, working with product designers and engineers on the MVP.",
  },
];

export const credentials = [
  {
    title: "Building AI Agents with OpenAI",
    issuer: "Edureka · Coursera specialization",
    date: "13 Apr 2026",
    description:
      "A three-course specialization covering agent design, development and deployment.",
    image: "/images/certificates/coursera.jpg",
    document: "/documents/coursera-ai-agents.pdf",
    verify: "https://coursera.org/verify/specialization/J6PYEOZO0PN5",
  },
  {
    title: "Generative AI for NodeJS: OpenAI, LangChain - TypeScript",
    issuer: "Udemy · Alex Dan",
    date: "13 Jul 2024",
    description:
      "A 7.5-hour course on generative AI integrations in a Node.js and TypeScript stack.",
    image: "/images/certificates/udemy.jpg",
    document: "/documents/udemy-generative-ai-nodejs.pdf",
    verify:
      "https://www.udemy.com/certificate/UC-3eb8e8b7-669e-42de-bb6a-cc4766816210/",
  },
];
