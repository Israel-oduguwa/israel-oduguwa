"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

type SubmitState = "idle" | "loading" | "success" | "error";

export function Contact() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [toastMessage, setToastMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitState("loading");
    setToastMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          message: formData.get("message"),
          company: formData.get("company"),
        }),
      });

      const result = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!response.ok) {
        throw new Error(result?.message ?? "Message could not be sent.");
      }

      form.reset();
      setSubmitState("success");
      setToastMessage("Message sent. I’ll get back to you soon.");
    } catch (error) {
      setSubmitState("error");
      setToastMessage(
        error instanceof Error
          ? error.message
          : "Message could not be sent. Please try again.",
      );
    }
  }

  const isSubmitting = submitState === "loading";
  const isSuccess = submitState === "success";

  return (
    <section
      className="bg-[#f9fafb] py-28 text-slate-900 dark:bg-[#050816] dark:text-white md:py-32"
      id="contact"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-8 items-start">
          {/* Left Column: Contact Info */}
          <div className="space-y-8 max-w-lg">
            <div>
              <h2 className="text-5xl font-bold leading-tight tracking-tight text-slate-900 text-balance dark:text-white md:text-7xl lg:text-[5.5rem]">
                Contact Me
              </h2>
              <p className="mt-6 text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
                Tell me what you’re building, what needs fixing, or what product
                flow needs to work better. I’ll reply with clear next steps.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              <div>
                <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">
                  Email
                </p>
                <a
                  href="mailto:oduguwa.israel22@gmail.com"
                  className="break-words text-lg  transition-colors hover:text-blue-600 dark:text-sky-100 dark:hover:text-sky-300 sm:text-xl"
                >
                  oduguwa.israel22@gmail.com
                </a>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Available for product builds, frontend systems, performance
                work, and full-stack features.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-12">
            <form
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <div className="hidden" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  placeholder="Enter your full name..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-slate-900 placeholder:text-slate-400 transition-[border-color,box-shadow,background-color] focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-300 dark:focus:ring-sky-300"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  spellCheck={false}
                  placeholder="Enter your email address..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-slate-900 placeholder:text-slate-400 transition-[border-color,box-shadow,background-color] focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-300 dark:focus:ring-sky-300"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Tell me about the project, role, or problem you need help
                  with.
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Enter your message..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-slate-900 placeholder:text-slate-400 transition-[border-color,box-shadow,background-color] focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-300 dark:focus:ring-sky-300"
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-primary">
                    {isSubmitting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <ArrowRight className="h-3 w-3" />
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {toastMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 sm:bottom-8"
        >
          <div
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-[0_24px_70px_rgba(15,23,42,0.18)] backdrop-blur-xl ${
              isSuccess
                ? "border-emerald-200 bg-emerald-50/95 text-emerald-950 dark:border-emerald-400/25 dark:bg-emerald-500/15 dark:text-emerald-50"
                : "border-red-200 bg-red-50/95 text-red-950 dark:border-red-400/25 dark:bg-red-500/15 dark:text-red-50"
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            <p>{toastMessage}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
