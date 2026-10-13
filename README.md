<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./.github/profile/coverImage.png">
  <source media="(prefers-color-scheme: light)" srcset="./.github/profile/coverImage.png">
  <img src="./.github/profile/coverImage.png" alt="Israel Oduguwa. Senior Full Stack Software Engineer working on platform architecture, payment infrastructure and AI systems." width="1200">
</picture>

<br>

<img align="right" src="./.github/profile/portrait.png" alt="Israel Oduguwa" width="125">

I'm Israel, a senior full stack software engineer with 6+ years designing and building production systems. My work spans platform architecture, backend and data services, payment infrastructure, applied AI and technical leadership.

At KinsCare, I defined marketplace architecture, guided seven developers and migrated 5,000+ user accounts while modernizing the platform and cloud infrastructure. At Excel Health Careers, I engineered a transaction layer supporting 8,000+ successful payments and built an AI acquisition engine that connects campaign execution to revenue data.

I created and maintain [SafeStripe](https://github.com/Israel-oduguwa/SafeStripe), an open-source reliability layer for Stripe with five explicit reliability contracts, four database adapters and Express/Next.js integrations. I also work at micro1 as an AI evaluation expert in frontend software engineering.

[Portfolio](https://israel-oduguwa.vercel.app/) &nbsp; · &nbsp; [Résumé](https://israel-oduguwa.vercel.app/documents/israel-oduguwa-resume.pdf) &nbsp; · &nbsp; [Email](mailto:oduguwa.israel22@gmail.com)

<br clear="right">

## My works
### SafeStripe

Database-backed payment reliability infrastructure for Node.js, Express and Next.js.

I designed SafeStripe around five contracts: stable operation identity, durable webhook admission before acknowledgment, recoverable worker ownership, one committed effect per business key, and atomic state/outbox intent. The architecture separates financial operations, event ingestion, worker execution and downstream delivery, with explicit failure boundaries for each.

I built the TypeScript engine, PostgreSQL, MongoDB, Firestore and SQLite adapters, framework integrations, adapter conformance coverage and process-level worker failure tests. The public sandbox and reproducible benchmarks let another engineer inspect those contracts. Version 0.3.0 remains an evaluation preview.

[Source](https://github.com/Israel-oduguwa/SafeStripe) &nbsp; · &nbsp; [Documentation](https://israel-oduguwa.github.io/SafeStripe/) &nbsp; · &nbsp; [Try the sandbox](https://safestripe-demo.vercel.app/) &nbsp; · &nbsp; [Benchmarks](https://israel-oduguwa.github.io/SafeStripe/benchmarks/)

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>KinsCare</h3>
      <p>Marketplace architecture, geospatial matching and production platform modernization.</p>
      <p>I defined the system architecture and guided seven developers. I built retrieval and matching services, migrated 5,000+ user accounts and reduced infrastructure spend by more than 75%.</p>
      <p><sub>Next.js · Node.js · Python · MongoDB · Clerk</sub></p>
      <p><a href="https://israel-oduguwa.vercel.app/work/kinscare">Case study</a> · <a href="https://www.kinscare.org/">Live product</a></p>
    </td>
    <td width="50%" valign="top">
      <h3>Excel Health Careers</h3>
      <p>Transaction consistency, revenue-driven acquisition and AI media orchestration.</p>
      <p>I engineered the transaction layer across 8,000+ successful payments, designed the AI acquisition engine and orchestrated media services with bounded concurrency, failure recovery and publishing checks. Acquisition work contributed to a 60% increase in qualified student acquisition.</p>
      <p><sub>Next.js · Stripe · Firebase · Remotion · AWS</sub></p>
      <p><a href="https://israel-oduguwa.vercel.app/work/excelcna">Case study</a> · <a href="https://www.excelcna.com/">Live product</a></p>
    </td>
  </tr>
</table>

## Current work at micro1

**AI Evaluation Expert / Frontend SWE · Jul 2026 - Present**

I design frontend software engineering evaluation tasks from realistic technical prompts and structured source material. I create expert reference outputs and objective assessment criteria, then review generated deliverables for reasoning, correctness, completeness, source use and instruction following.

I use the same approach in application work: follow a request through the frontend, API and database, find the failing layer, and check the proposed fix against it.

## Tools I use

| Area | Tools and work |
| --- | --- |
| Product interfaces | TypeScript, JavaScript, React, Next.js, responsive CSS, accessibility |
| Services and data | Node.js, Express, Python, PostgreSQL, MongoDB, Firebase |
| Architecture and delivery | System design, transaction consistency, asynchronous processing, authorization, AWS, GCP, CI/CD |
| Payment infrastructure | Stripe, durable operation identity, webhook admission, worker ownership, transactional outbox |
| Applied AI | OpenAI APIs, LangChain, agent integrations, evaluation tasks and rubrics |

## Technical writing

- [Validating AI coding benchmarks](https://israel-oduguwa.vercel.app/articles/validating-ai-coding-benchmarks): a runnable grader experiment, task sampling, judge calibration and decision rules for coding-agent evaluations.
- [Stripe idempotency does not finish the payment workflow](https://israel-oduguwa.vercel.app/articles/stripe-idempotency-your-app-still-needs-it): where request retries, webhook deduplication and business effects meet.
- [What a crashed payment worker leaves behind](https://israel-oduguwa.vercel.app/articles/worker-ownership-and-payment-recovery): leases, ownership checks and the transaction boundary behind recovery.

[More articles](https://israel-oduguwa.vercel.app/articles)

## Background

I started programming in 2015 through an interest in mobile games, then explored Scratch and Python before moving into web development. My work since then has included building products, guiding engineering teams, teaching and AI evaluation.

Recent study includes [Building AI Agents with OpenAI](https://coursera.org/verify/specialization/J6PYEOZO0PN5) and [Generative AI for NodeJS: OpenAI, LangChain, TypeScript](https://www.udemy.com/certificate/UC-3eb8e8b7-669e-42de-bb6a-cc4766816210/).

---

I'm open to senior engineering roles and contract projects involving platform architecture, backend systems, payment infrastructure or applied AI.

[View my portfolio](https://israel-oduguwa.vercel.app/) &nbsp; · &nbsp; [Email me](mailto:oduguwa.israel22@gmail.com)

<details>
  <summary>Portfolio development</summary>
  <p>This repository also contains the portfolio website. The <a href="./docs/portfolio-development.md">development guide</a> covers local setup, checks and deployment.</p>
</details>
