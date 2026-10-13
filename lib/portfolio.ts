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
    role: "Creator, architecture and implementation",
    period: "2026",
    summary:
      "A database-backed reliability layer for Stripe: durable operation identities, verified webhook ingestion, leased workers and transactional business effects across four storage adapters.",
    contribution:
      "I designed the reliability contracts and storage architecture, then built the TypeScript engine, PostgreSQL, MongoDB, Firestore and SQLite adapters, and Express and Next.js integrations. I also built process-level failure tests, adapter conformance coverage and the public evaluation sandbox.",
    tags: ["TypeScript", "Stripe", "PostgreSQL", "MongoDB", "Firestore", "SQLite", "Express", "Next.js"],
    image: "/images/projects/safestripe.jpg",
    imageAlt:
      "SafeStripe explainer illustrating one payment and repeated payment updates",
    theme: "stripe",
    metrics: [
      {
        value: "4",
        label: "Database adapters behind a shared storage contract",
      },
      { value: "5", label: "Reliability contracts with documented failure boundaries" },
    ],
    challenge:
      "Stripe and an application database cannot share a transaction. A request can succeed at Stripe while the application loses the response. Webhooks can repeat, and a worker can stop after claiming a job. The application has to remember what succeeded and which work still needs completion.",
    decisions: [
      {
        title: "Give each financial operation a stable identity",
        body: "The caller supplies an operation ID. SafeStripe stores its scope, parameters and progress, then uses a stable Stripe idempotency key. Changed parameters conflict instead of silently becoming another mutation. Older ambiguous outcomes require review.",
      },
      {
        title: "Persist verified events before acknowledgment",
        body: "The receiver verifies the original request bytes and Stripe signature before durable admission. If storage fails, the endpoint does not acknowledge work it has not saved. Workers process admitted jobs separately from the HTTP request.",
      },
      {
        title: "Fence worker ownership at the commit",
        body: "Jobs use expiring leases and ownership tokens. Completion checks the current owner in the transaction. The process-level tests kill real workers and verify that another worker can recover committed work without allowing a stale owner to overwrite the result.",
      },
      {
        title: "Give business effects their own identity",
        body: "Different webhook events can refer to the same business action. I used a stable effect key to guard supported local record changes, so deduplication follows the business effect as well as the event ID.",
      },
      {
        title: "Commit state changes and outbox intent atomically",
        body: "Supported billing-record updates, effect guards and outbox intent commit in one transaction. The dispatcher delivers at least once; receiving services deduplicate repeated delivery. I document that boundary explicitly because a local transaction cannot make an arbitrary external call exactly once.",
      },
      {
        title: "Define a portable storage contract",
        body: "PostgreSQL, MongoDB, Firestore and SQLite implement a shared storage contract with documented transaction boundaries. Adapter conformance and contention tests check the contract, while process-level worker tests exercise crash recovery and stale ownership across the supported implementation paths.",
      },
    ],
    result:
      "The published 0.3.0 package brings the five reliability contracts to four database adapters and Express/Next.js integrations. Its evidence includes adapter conformance, contention and process-level worker failure tests, reproducible benchmarks and CI. A retained Express + Firestore sandbox run recorded twelve journeys; its duplicate replay added ten admissions while preserving the original receipt and paid time.",
    boundary:
      "Version 0.3.0 is an evaluation preview. The linked sandbox run and benchmarks cover their stated scenarios and workloads. Applications supply authorization, stable operation and effect identities, durable storage and a recovery plan. Independent security review and enterprise capacity testing remain outside this preview's evidence.",
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
        label: "Benchmark results",
        href: "https://israel-oduguwa.github.io/SafeStripe/benchmarks/",
      },
    ],
  },
  {
    slug: "kinscare",
    name: "KinsCare",
    category: "Marketplace architecture and platform modernization",
    role: "Software engineer; architecture and technical leadership",
    period: "Oct 2022 - Dec 2025",
    summary:
      "I defined the architecture of a healthcare workforce marketplace, guided seven developers and built geospatial matching, retrieval-backed recommendations and production platform migrations.",
    contribution:
      "I owned architecture and technical decisions across caregiver onboarding, provider jobs, geospatial matching, subscriptions, conversations and administration. I guided seven developers through system design and code review, modernized the frontend and infrastructure, and planned and executed the Realm-to-Clerk migration for 5,000+ users.",
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
      { value: "≈60%", label: "Reduction in manual matching and triage review" },
      { value: "3 days", label: "Qualified matches through the matching workflow" },
    ],
    challenge:
      "Caregiver onboarding, provider jobs, matching and conversations needed to work as one product. At the same time, the frontend and identity platform needed to change without leaving existing users unable to access their accounts.",
    decisions: [
      {
        title: "Modernize the product and deployment together",
        body: "I migrated the frontend from React to Next.js and reworked production deployment and infrastructure. That let me address page performance and running costs in the same migration.",
      },
      {
        title: "Plan the identity migration around continuity",
        body: "The Realm-to-Clerk migration covered more than 5,000 users with limited exportable identity data. I planned the transition around preserving access to their existing accounts.",
      },
      {
        title: "Give recommendations a maintained data pipeline",
        body: "I built a Python and Express pipeline to refresh, normalize and index thousands of school, course and healthcare records. Persisted model and data artifacts, embeddings and retrieval supported personalized recommendation APIs, with cached results to keep responses consistent.",
      },
      {
        title: "Make matching and experimentation part of the architecture",
        body: "I combined caregiver profiles, provider requirements and geospatial signals to shortlist candidates and route review and scheduling. Weighted variant assignment, persisted user assignments and event recording supported controlled product experiments. Guided conversations connected user input to recommendation calls and cached results.",
      },
      {
        title: "Review the frontend, backend and integrations together",
        body: "I guided seven developers through system design and code review across the frontend, backend, integrations and infrastructure. The marketplace included geospatial matching, subscriptions, lead routing, guided conversations and administrative review.",
      },
    ],
    result:
      "Infrastructure spend fell by more than 75%, and the recorded Lighthouse performance score moved from 59 to 90, with SEO at 100. The identity migration preserved access for 5,000+ users. Matching and triage reduced manual agent review by approximately 60% and enabled qualified matches within three days.",
    boundary:
      "Results cover my October 2022 to December 2025 work at KinsCare. The live site provides current product context; KinsCare maintains the client code, user data and internal architecture.",
    links: [{ label: "Visit KinsCare", href: "https://www.kinscare.org/" }],
  },
  {
    slug: "excelcna",
    name: "Excel Health Careers",
    category: "Revenue systems and AI orchestration",
    role: "Senior software engineer, contract",
    period: "Mar 2025 - Apr 2026",
    summary:
      "I engineered the transaction layer and revenue-driven AI acquisition engine for a healthcare training business, connecting payment consistency, campaign orchestration and automated media production.",
    contribution:
      "I designed the platform's state transitions and transaction layer, established integration and end-to-end coverage, and built the AI acquisition engine and asynchronous media system. That work covered event deduplication, reconciliation, render concurrency, provider failures and publishing integrity.",
    tags: ["Next.js", "Stripe", "Firebase", "Remotion", "AWS"],
    image: "/images/projects/excelcna.jpg",
    imageAlt:
      "Public Excel Health Careers homepage with CPR and BLS course registration",
    theme: "training",
    metrics: [
      {
        value: "+60%",
        label: "Qualified acquisition increase supported by the AI campaign engine",
      },
      {
        value: "8,000+",
        label: "Successful transactions supported by the transaction layer",
      },
      { value: "+73%", label: "Completed enrollments after the workflow redesign" },
      { value: "-40%", label: "Manual operational work after the redesign" },
    ],
    challenge:
      "Course discovery, registration, payment and training administration needed to describe the same student journey. A successful Stripe payment had to become an accurate enrollment record even when delivery was delayed or repeated.",
    decisions: [
      {
        title: "Model the revenue workflow as state transitions",
        body: "I redesigned the Next.js platform around the registration, payment and training lifecycle. I established integration, end-to-end and regression coverage for critical state transitions and administrative processes, so the team could verify changes across the full workflow.",
      },
      {
        title: "Preserve consistency across asynchronous payment events",
        body: "I engineered the transaction layer connecting registration records, Stripe events, enrollment state and administrative tracking. Application-level event deduplication, reconciliation and recovery paths exercised duplicate, delayed, failed and out-of-order scenarios across 8,000+ successful transactions.",
      },
      {
        title: "Orchestrate AI services with bounded concurrency",
        body: "I built the media system coordinating OpenAI, ElevenLabs, Remotion and AWS Lambda. Asynchronous progress polling, bounded render concurrency, latency monitoring, retries and rollback paths covered render and publishing failures. I verified concurrency limits, service failures and publishing integrity.",
      },
      {
        title: "Connect campaign execution to revenue evidence",
        body: "I designed and launched the acquisition engine to analyze historical registration and Stripe revenue data, select campaign workflows and route execution through video, blog, graphics and advertising pipelines. Quality gates, failure recovery and workflow checks preceded release; campaign output was measured against resulting revenue.",
      },
    ],
    result:
      "The enrollment redesign increased completed enrollments by 73% and reduced manual operational work by 40%. The transaction layer supported more than 8,000 successful transactions. Acquisition work contributed to a 60% increase in qualified student acquisition; video generation completed in under eight minutes per item.",
    boundary:
      "Results cover my March 2025 to April 2026 contract. The live site provides product context. The client retains student records, payment data and private implementation details.",
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
    role: "AI evaluation expert · Frontend software engineering",
    period: "Jul 2026 - Present",
    description:
      "Design source-grounded frontend engineering evaluation tasks, expert reference outputs and objective assessment criteria. Review generated technical deliverables for reasoning, correctness, completeness, source use and instruction following.",
  },
  {
    company: "Excel Health Careers",
    role: "Senior software engineer · contract",
    period: "Mar 2025 - Apr 2026",
    description:
      "Engineered the platform transaction layer across 8,000+ successful payments and built a revenue-driven AI acquisition engine with asynchronous media orchestration, concurrency limits and failure recovery.",
    project: "/work/excelcna",
  },
  {
    company: "KinsCare",
    role: "Software engineer · technical leadership",
    period: "Oct 2022 - Dec 2025",
    description:
      "Defined marketplace architecture and guided seven developers. Built retrieval and matching services, modernized cloud infrastructure and migrated 5,000+ user accounts while reducing infrastructure spend by more than 75%.",
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
