const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maxBodyBytes = 16384;
const deliveryFailure =
  "I could not send the message. Please email me directly.";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function readBody(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBodyBytes) {
        await reader.cancel();
        throw new RangeError("Body too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json(
      { message: "Please use the contact form on this website." },
      { status: 403 },
    );
  }
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return Response.json(
      { message: "Please send a JSON request." },
      { status: 415 },
    );
  }
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > maxBodyBytes) {
    return Response.json(
      { message: "The message is too large." },
      { status: 413 },
    );
  }
  let payload: unknown;
  try {
    payload = await readBody(request);
  } catch (error) {
    return Response.json(
      {
        message:
          error instanceof RangeError
            ? "The message is too large."
            : "Invalid request body.",
      },
      { status: error instanceof RangeError ? 413 : 400 },
    );
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }
  const data = payload as Record<string, unknown>;
  const fullName = readString(data.fullName);
  const email = readString(data.email).toLowerCase();
  const message = readString(data.message);
  if (readString(data.company))
    return Response.json({ message: "Message received." });
  if (fullName.length < 2 || fullName.length > 120 || /[\r\n]/.test(fullName)) {
    return Response.json(
      { message: "Please enter your full name." },
      { status: 400 },
    );
  }
  if (!emailPattern.test(email) || email.length > 160) {
    return Response.json(
      { message: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (message.length < 10 || message.length > 4000) {
    return Response.json(
      { message: "Please enter a message between 10 and 4000 characters." },
      { status: 400 },
    );
  }
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey)
    return Response.json(
      { message: "The contact form is unavailable. Please email me directly." },
      { status: 503 },
    );
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(10000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.RESEND_FROM_EMAIL ??
          "Portfolio Contact <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL ?? "oduguwa.israel22@gmail.com"],
        reply_to: email,
        subject: `Portfolio inquiry from ${fullName}`,
        text: `Name: ${fullName}\nEmail: ${email}\n\n${message}`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.7"><h2>Portfolio inquiry</h2><p><strong>Name:</strong> ${escapeHtml(fullName)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p>${escapeHtml(message).replaceAll("\n", "<br />")}</p></div>`,
      }),
    });
    if (!response.ok)
      return Response.json({ message: deliveryFailure }, { status: 502 });
  } catch {
    // Provider responses and request headers are deliberately excluded from logs.
    return Response.json({ message: deliveryFailure }, { status: 502 });
  }
  return Response.json({ message: "Message sent." });
}
