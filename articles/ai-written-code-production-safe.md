---
slug: "ai-written-code-production-safe"
title: "Reviewing generated code before it reaches production"
description: "How I assess a proposed implementation against the repository, the task and the system's failure boundaries."
date: "2025-08-13"
updatedAt: "2026-10-09"
tags:
  - AI evaluation
  - Code review
---

A proposed implementation can compile and still solve the wrong problem. It may use an API the repository does not support, assume a permission the caller does not have or leave a failure path without recovery. Those problems matter whether the code came from a colleague, a model or your own first attempt.

When evaluating generated work, I start with the task and the source material. A confident explanation is not evidence that the implementation matches either one.

## Establish the reference first

The reviewer needs to know what counts as a correct result. That includes the requested behavior, the relevant repository conventions, the constraints and the evidence the solution must use.

For a frontend task, a reference might describe the current component contract, an API response shape and the behavior expected when a request fails. If those details are missing, reviewers can end up rewarding different solutions for incompatible reasons.

In my one-month micro1 project, I designed source-grounded frontend engineering evaluation tasks, reference outputs and objective criteria. That is the public scope described here. I do not publish internal task materials, model responses or confidential project information.

## Trace the implementation across boundaries

A feature rarely lives in one component. Follow the request from the browser through the API and persistence layer to any external integration. Check how the response returns to the interface and what happens if it does not.

For example, a loading flag needs a success path and a failure path. A request may time out, return an unexpected shape or finish after the user navigates away. A button that stays disabled indefinitely is a product bug even if the network call was technically valid.

On the server, check authorization and tenant scope before the mutation. Check whether retries preserve the operation's identity. Check what state remains if the process fails midway through the workflow.

## Make the criteria observable

“High-quality code” is too broad to grade consistently. Split the assessment into things a reviewer can inspect:

- Correctness: does the implementation produce the requested behavior, including the specified failure cases?
- Completeness: are the connected layers and necessary state transitions covered?
- Source use: does the implementation follow the supplied contracts rather than inventing interfaces?
- Security: are permissions, inputs and secret boundaries enforced in the relevant place?
- Maintainability: can another engineer understand the change without relying on the author's explanation?
- Performance: does the design add unnecessary work or unbounded concurrency for the expected workload?

These dimensions need task-specific evidence. A small UI fix should not be judged by the volume of its architecture discussion. A payment mutation should not pass just because the form looks right.

## Tests should challenge the claim

A test that repeats the implementation's assumptions can make a flawed solution look convincing. Better tests exercise the task's boundary: another tenant's resource, an interrupted request, a repeated event, an invalid response or a state transition that is no longer allowed.

For concurrency claims, use competing workers or processes when the distinction matters. An exception thrown inside one process does not reproduce every effect of that process disappearing.

SafeStripe's [reliability work](/work/safestripe) is an example of documenting those boundaries. Its tests and recorded sandbox run support specific claims. They do not justify a blanket promise of production safety for every application.

## Keep the explanation tied to evidence

A good review can say which behavior is correct, where the implementation diverges and what would establish a fix. It should distinguish an observed failure from a suspected one and a tested scenario from an unverified claim.

That is also a useful discipline for everyday engineering. The final explanation should help the next person maintain the system, not make the author sound more certain than the evidence allows.
