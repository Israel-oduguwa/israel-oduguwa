const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  const data = payload as Record<string, unknown>;
  const fullName = readString(data.fullName);
  const email = readString(data.email).toLowerCase();
  const message = readString(data.message);
  const company = readString(data.company);

  if (company) {
    return Response.json({ message: "Message received." });
  }

  if (fullName.length < 2 || fullName.length > 120) {
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
      { message: "Please enter a project message between 10 and 4000 characters." },
      { status: 400 },
    );
  }

  const apiKey = "re_adz5tXxi_JDvohzca2dowVjxAcvHkrnvP";
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "oduguwa.israel22@gmail.com";
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? "Portfolio Contact <onboarding@resend.dev>";

  if (!apiKey) {
    return Response.json(
      { message: "Email service is not configured yet." },
      { status: 500 },
    );
  }

  const safeName = escapeHtml(fullName);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `Portfolio inquiry from ${fullName}`,
        text: `Name: ${fullName}\nEmail: ${email}\n\n${message}`,
        html: `
          <div style="font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #0f172a;">
            <h2 style="margin: 0 0 16px;">New portfolio inquiry</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
            <div style="margin-top: 24px;">
              <strong>Message:</strong>
              <div style="margin-top: 8px; padding: 16px; border-radius: 12px; background: #f8fafc;">
                ${safeMessage}
              </div>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      return Response.json(
        { message: "I could not send the message. Please email me directly." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "I could not send the message. Please email me directly." },
      { status: 502 },
    );
  }

  return Response.json({ message: "Message sent." });
}
