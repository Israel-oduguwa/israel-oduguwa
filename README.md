<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./.github/profile/header-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./.github/profile/header-light.svg">
  <img src="./.github/profile/header-light.svg" alt="Israel Oduguwa. Senior Full Stack Software Engineer building SaaS products, payment systems and applied AI." width="1200">
</picture>

<br>

<img align="right" src="./.github/profile/portrait.png" alt="Israel Oduguwa" width="125">

I'm a senior full-stack software engineer. I build web products and the services behind them. My work includes healthcare marketplaces, enrollment and payment workflows, and AI model evaluation.

I work across React and Next.js, Node.js APIs and databases. I also guide engineering teams through architecture decisions, code review and production migrations. The work I care about makes a product easier to use, less expensive to operate, or easier to recover when something fails.

I'm the creator of **SafeStripe**, a TypeScript reliability layer for Stripe applications.

[Portfolio](https://israel-oduguwa.vercel.app/) &nbsp; · &nbsp; [Résumé](https://israel-oduguwa.vercel.app/documents/israel-oduguwa-resume.pdf) &nbsp; · &nbsp; [Email](mailto:oduguwa.israel22@gmail.com)

<br clear="right">

<p>
  <img src="./.github/profile/typescript.svg" alt="TypeScript" width="141">
  <img src="./.github/profile/react.svg" alt="React and Next.js" width="174">
  <img src="./.github/profile/node.svg" alt="Node.js and Express" width="193">
  <img src="./.github/profile/payments.svg" alt="Payments" width="140">
  <img src="./.github/profile/ai-evaluation.svg" alt="AI evaluation" width="164">
</p>

## Selected work

### SafeStripe

**Payment reliability for Node.js, Express and Next.js.**

A Stripe request can succeed while your application loses the response. Webhooks can repeat, and a worker can crash after claiming a job. SafeStripe stores operation history and accepted work in your database so recovery can continue the original workflow.

I built the library, storage adapters, framework integrations, failure tests and public sandbox. The repository documents retry boundaries, worker ownership and transactional effects, with architecture decisions and reproducible benchmarks. The published 0.3.0 release is an evaluation preview.

[Source](https://github.com/Israel-oduguwa/SafeStripe) &nbsp; · &nbsp; [Documentation](https://israel-oduguwa.github.io/SafeStripe/) &nbsp; · &nbsp; [Try the sandbox](https://safestripe-demo.vercel.app/) &nbsp; · &nbsp; [Benchmarks](https://israel-oduguwa.github.io/SafeStripe/benchmarks/)

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>KinsCare</h3>
      <p>A healthcare hiring marketplace connecting caregivers with care providers.</p>
      <p>I guided a seven-developer team, migrated the frontend to Next.js, and worked on identity migration, matching services and infrastructure costs.</p>
      <p><sub>Next.js · Node.js · Python · MongoDB · Clerk</sub></p>
      <p><a href="https://israel-oduguwa.vercel.app/work/kinscare">Case study</a> · <a href="https://www.kinscare.org/">Live product</a></p>
    </td>
    <td width="50%" valign="top">
      <h3>Excel Health Careers</h3>
      <p>Enrollment and payment workflows for a healthcare training business.</p>
      <p>I connected registration, Stripe events and administrative records, and built acquisition and video-generation workflows with recovery paths.</p>
      <p><sub>Next.js · Stripe · Firebase · Remotion · AWS</sub></p>
      <p><a href="https://israel-oduguwa.vercel.app/work/excelcna">Case study</a> · <a href="https://www.excelcna.com/">Live product</a></p>
    </td>
  </tr>
</table>

## AI evaluation

On a one-month software engineering project with **micro1**, I designed source-grounded frontend evaluation tasks, expert reference outputs and objective criteria. I reviewed generated solutions for correctness, completeness, source use, security and maintainability.

That work sits alongside my application engineering: tracing requests through a frontend, API and database, identifying the failing layer, and checking whether a proposed fix actually addresses it.

## Tools I use

| Area | Tools and work |
| --- | --- |
| Product interfaces | TypeScript, JavaScript, React, Next.js, responsive CSS, accessibility |
| Services and data | Node.js, Express, Python, PostgreSQL, MongoDB, Firebase |
| Payments and operations | Stripe, webhook processing, recovery workflows, AWS, CI |
| Applied AI | OpenAI APIs, LangChain, agent integrations, evaluation tasks and rubrics |

## Technical writing

- [Stripe idempotency does not finish the payment workflow](https://israel-oduguwa.vercel.app/articles/stripe-idempotency-your-app-still-needs-it): where request retries, webhook deduplication and business effects meet.
- [What a crashed payment worker leaves behind](https://israel-oduguwa.vercel.app/articles/worker-ownership-and-payment-recovery): leases, ownership checks and the transaction boundary behind recovery.

[More articles](https://israel-oduguwa.vercel.app/articles)

## Background

I started programming in 2015 through an interest in mobile games, then explored Scratch and Python before moving into web development. My work since then has included product implementation, technical leadership, teaching and AI evaluation.

Recent study includes [Building AI Agents with OpenAI](https://coursera.org/verify/specialization/J6PYEOZO0PN5) and [Generative AI for NodeJS: OpenAI, LangChain, TypeScript](https://www.udemy.com/certificate/UC-3eb8e8b7-669e-42de-bb6a-cc4766816210/).

---

I'm open to full-stack engineering roles, software engineering evaluation work and contract projects.

**[See my work](https://israel-oduguwa.vercel.app/) &nbsp; · &nbsp; [Get in touch](mailto:oduguwa.israel22@gmail.com)**

<details>
  <summary>Portfolio development</summary>
  <p>This repository also contains the portfolio website. The <a href="./docs/portfolio-development.md">development guide</a> covers local setup, checks and deployment.</p>
</details>
