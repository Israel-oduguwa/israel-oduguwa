import React from "react";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 py-12 dark:border-white/5">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-lg font-medium text-slate-950 dark:text-white">
            Israel Oduguwa
          </p>
          <p className="text-sm text-slate-600 dark:text-gray-400">
            Full-Stack Software Engineer
          </p>
          <p className="text-xs text-slate-500 mt-2 dark:text-gray-500">
            Next.js • React • Node.js • AI
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/Israel-oduguwa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-5 w-5 items-center justify-center text-slate-500 transition-colors hover:text-slate-950 dark:text-gray-400 dark:hover:text-white"
            aria-label="GitHub profile"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5 fill-current"
            >
              <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.52 2.87 8.35 6.84 9.71.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.38-3.37-1.38-.45-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.93.85.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.71 0 0 .84-.28 2.75 1.05A9.33 9.33 0 0 1 12 6.93c.85 0 1.7.12 2.5.35 1.9-1.33 2.74-1.05 2.74-1.05.55 1.4.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.08 10.08 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
            </svg>
          </a>
          <a
            href="mailto:oduguwa.israel22@gmail.com"
            className="flex h-5 w-5 items-center justify-center text-slate-500 transition-colors hover:text-slate-950 dark:text-gray-400 dark:hover:text-white"
            aria-label="Email Israel Oduguwa"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
