import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { getAllArticles, getArticleBySlug } from "../lib/articles.ts";
import { credentials, projects } from "../lib/portfolio.ts";

test("published article URLs survive the refresh and dates remain explicit", () => {
  for (const slug of [
    "stripe-idempotency-your-app-still-needs-it",
    "authorization-architecture-beyond-roles",
    "from-it-works-locally-to-production",
    "ai-written-code-production-safe",
  ]) {
    const article = getArticleBySlug(slug);
    assert.ok(article);
    assert.equal(article.updatedAt, "2026-10-13");
    assert.ok(article.date < article.updatedAt);
  }
  assert.equal(getArticleBySlug("../../package.json"), undefined);
  const all = getAllArticles();
  assert.equal(new Set(all.map((article) => article.slug)).size, all.length);
  for (const article of all) {
    assert.match(article.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(article.body.length > 1000);
    assert.ok(!article.body.includes("images.unsplash.com"));
  }
});

test("project and credential assets exist and internal links resolve", () => {
  const projectUrls = new Set(
    projects.map((project) => `/work/${project.slug}`),
  );
  assert.equal(projectUrls.size, projects.length);
  for (const asset of [
    ...projects.map((project) => project.image),
    ...credentials.flatMap((item) => [item.image, item.document]),
  ]) {
    assert.ok(fs.existsSync(path.join(process.cwd(), "public", asset)), asset);
  }
  for (const article of getAllArticles()) {
    for (const match of article.body.matchAll(/\]\((\/[^)]+)\)/g))
      assert.ok(projectUrls.has(match[1]), match[1]);
  }
});

test("article navigation and headings use the same stable identifiers", async () => {
  const { headingId } = await import("../lib/markdown.ts");
  assert.equal(
    headingId("What Stripe's key protects"),
    "what-stripes-key-protects",
  );
  assert.equal(headingId("A **stable** `operationId`"), "a-stable-operationid");
  for (const article of getAllArticles()) {
    const ids = article.body
      .split("\n")
      .filter((line) => line.startsWith("## "))
      .map((line) => headingId(line.slice(3)));
    assert.equal(ids.length, new Set(ids).size, article.slug);
  }
});
