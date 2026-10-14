import assert from "node:assert/strict";
import { test } from "node:test";
import { highlightCode } from "../lib/highlighting.ts";

test("highlighting preserves source, including markup-looking strings and blank lines", async () => {
  const code = 'const sample = "<script>alert(1)</script>";\n\n// A comment\n';
  const rendered = await highlightCode(code, "js");
  assert.equal(rendered.label, "JavaScript");
  assert.equal(rendered.lines.map(line => line.map(token => token.content).join("")).join("\n"), code);
  assert.ok(new Set(rendered.lines.flat().map(token => token.color)).size > 1);
});

test("unsupported languages remain readable source rather than failing publication", async () => {
  const code = "first -> second\n  final";
  const rendered = await highlightCode(code, "workflow-trace");
  assert.equal(rendered.lines.map(line => line.map(token => token.content).join("")).join("\n"), code);
});
