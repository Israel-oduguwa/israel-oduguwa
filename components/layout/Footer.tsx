import React from "react";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 py-12 dark:border-white/5">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-lg font-medium text-slate-950 dark:text-white">Israel Oduguwa</p>
          <p className="text-sm text-slate-600 dark:text-gray-400">Frontend-heavy Full-Stack Engineer</p>
          <p className="text-xs text-slate-500 mt-2 dark:text-gray-500">Next.js • React • Node.js • AI</p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="mailto:hello@israeloduguwa.com"
            className="text-slate-500 hover:text-slate-950 transition-colors flex items-center justify-center w-5 h-5 dark:text-gray-400 dark:hover:text-white"
            aria-label="Email Israel Oduguwa"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
