'use client';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800/60 bg-white dark:bg-neutral-900 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & tagline */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-neutral-800 dark:bg-white" />
              </div>
              <span className="font-semibold text-sm tracking-widest text-neutral-800 dark:text-white uppercase font-sans">FITCOACH AI</span>
            </div>
            <span className="text-xs font-mono text-neutral-500">
              Built at Google Build with Gemini 2026 · Powered by Gemini API · Developed by Harpreet Singh
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5 text-xs text-neutral-500 font-mono">
            <a
              href="https://harpreetsingh.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-neutral-800 dark:hover:text-white transition-colors"
            >
              harpreetsingh.xyz <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://github.com/Harpreet1999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-neutral-800 dark:hover:text-white transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.92.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg> GitHub
            </a>
            <a
              href="https://google.github.io/adk-docs/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-neutral-800 dark:hover:text-white transition-colors"
            >
              Google ADK Docs <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
