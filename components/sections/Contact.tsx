import { ArrowRight } from "lucide-react";

export function Contact() {
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
              action="mailto:oduguwa.israel22@gmail.com"
              method="post"
              encType="text/plain"
            >
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
                ></textarea>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
                >
                  Send Message
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-primary">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
