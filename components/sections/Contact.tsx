"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { profile } from "@/lib/portfolio";

export function Contact() {
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setBusy(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fields)),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json().catch(() => null);
      if (!result)
        throw new Error(
          "The form received an unexpected response. Please email me directly instead.",
        );
      if (!response.ok)
        throw new Error(result.message || "Please email me directly instead.");
      setFeedback({
        success: true,
        message: "Thanks, your message has been sent. I’ll reply by email.",
      });
      form.reset();
    } catch (error) {
      setFeedback({
        success: false,
        message:
          error instanceof TypeError
            ? "The connection failed. Please email me directly instead."
            : error instanceof Error && error.name !== "TimeoutError"
              ? error.message
              : "The request took too long. Please email me directly instead.",
      });
    } finally {
      setBusy(false);
    }
  }
  return (
    <section id="contact" className="contact-section">
      <div className="shell contact-grid">
        <div>
          <p className="section-kicker">Contact</p>
          <h2>Get in touch</h2>
          <p className="section-description">
            I’m open to senior full-stack roles and contract projects. Send a
            role description or a short note about your project, and I’ll reply
            by email.
          </p>
          <a className="email-link" href={`mailto:${profile.email}`}>
            {profile.email}
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
          <p className="contact-location">
            Based in Lagos, Nigeria. Experienced working remotely with US teams.
          </p>
        </div>
        <form onSubmit={send} className="contact-form" aria-busy={busy}>
          <div className="form-row">
            <label htmlFor="fullName">
              Your name
              <input
                id="fullName"
                name="fullName"
                autoComplete="name"
                required
                minLength={2}
                maxLength={120}
                placeholder="Name"
              />
            </label>
            <label htmlFor="email">
              Email address
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={160}
                placeholder="you@company.com"
              />
            </label>
          </div>
          <label htmlFor="message">
            What would you like to work on?
            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              maxLength={4000}
              rows={5}
              placeholder="A role, a project, or a technical problem…"
            />
          </label>
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="company">
              Leave this field empty
              <input
                id="company"
                name="company"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>
          <div className="form-bottom">
            <p>Your details are used to reply to this message.</p>
            <button className="button primary" disabled={busy} type="submit">
              {busy ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="spinner"
                    aria-hidden="true"
                  />{" "}
                  Sending…
                </>
              ) : (
                <>
                  Send message <ArrowUpRight size={17} aria-hidden="true" />
                </>
              )}
            </button>
          </div>
          <p
            aria-live="polite"
            role={feedback?.success === false ? "alert" : "status"}
            className={`form-feedback ${feedback?.success === false ? "error" : ""}`}
          >
            {feedback?.message}
          </p>
        </form>
      </div>
    </section>
  );
}
