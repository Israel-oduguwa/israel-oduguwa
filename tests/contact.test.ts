import assert from "node:assert/strict";
import { test } from "node:test";
import { POST } from "../app/api/contact/route.ts";

const valid = {
  fullName: "Example Visitor",
  email: "visitor@example.com",
  message: "I would like to discuss a software project.",
  company: "",
};
function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://portfolio.example/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

test("invalid payloads and fields never call the email provider", async (t) => {
  const calls: unknown[] = [];
  t.mock.method(globalThis, "fetch", async (...args: unknown[]) => {
    calls.push(args);
    return new Response("{}", { status: 200 });
  });
  for (const payload of [
    null,
    [],
    {},
    { ...valid, fullName: "A" },
    { ...valid, fullName: "Name\nInjected" },
    { ...valid, email: "not-an-email" },
    { ...valid, message: "short" },
    { ...valid, message: "a".repeat(4001) },
  ]) {
    assert.equal((await POST(request(payload))).status, 400);
  }
  assert.equal(calls.length, 0);
});

test("rejects foreign origins, malformed JSON and non-JSON requests", async () => {
  assert.equal(
    (await POST(request(valid, { origin: "https://other.example" }))).status,
    403,
  );
  assert.equal(
    (
      await POST(
        new Request("https://portfolio.example/api/contact", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: "{",
        }),
      )
    ).status,
    400,
  );
  assert.equal(
    (await POST(request(valid, { "content-type": "text/plain" }))).status,
    415,
  );
});

test("enforces the size limit on streamed bytes without content-length", async () => {
  assert.equal(
    (await POST(request({ ...valid, message: "a".repeat(18000) }))).status,
    413,
  );
  assert.equal(
    (await POST(request(valid, { "content-length": "18000" }))).status,
    413,
  );
});

test("honeypot submissions are acknowledged without sending mail", async (t) => {
  let sent = false;
  t.mock.method(globalThis, "fetch", async () => {
    sent = true;
    return new Response("{}");
  });
  assert.equal(
    (await POST(request({ ...valid, company: "spam" }))).status,
    200,
  );
  assert.equal(sent, false);
});

test("missing configuration offers a direct-email fallback", async (t) => {
  const previous = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  t.after(() => {
    if (previous !== undefined) process.env.RESEND_API_KEY = previous;
  });
  assert.equal((await POST(request(valid))).status, 503);
});

test("escapes HTML, normalizes reply-to and bounds provider delivery", async (t) => {
  const previous = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "unit-test-placeholder";
  t.after(() => {
    if (previous === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previous;
  });
  t.mock.method(
    globalThis,
    "fetch",
    async (url: string | URL | Request, options?: RequestInit) => {
      assert.equal(url, "https://api.resend.com/emails");
      assert.ok(options?.signal);
      const body = JSON.parse(String(options?.body));
      assert.equal(body.reply_to, "visitor@example.com");
      assert.ok(body.html.includes("&lt;script&gt;"));
      assert.ok(!body.html.includes("<script>"));
      assert.ok(body.text.includes("<script>"));
      return new Response("{}", { status: 200 });
    },
  );
  const response = await POST(
    request(
      {
        ...valid,
        email: " VISITOR@EXAMPLE.COM ",
        message: "<script>example</script>\nA real message.",
      },
      { origin: "https://portfolio.example" },
    ),
  );
  assert.equal(response.status, 200);
});

test("provider rejection and network failure return a safe fallback", async (t) => {
  const previous = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "unit-test-placeholder";
  t.after(() => {
    if (previous === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previous;
  });
  const mocked = t.mock.method(
    globalThis,
    "fetch",
    async () => new Response("private provider details", { status: 429 }),
  );
  let response = await POST(request(valid));
  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes("private provider"));
  mocked.mock.mockImplementation(async () => {
    throw new Error("private network details");
  });
  response = await POST(request(valid));
  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes("private network"));
});
