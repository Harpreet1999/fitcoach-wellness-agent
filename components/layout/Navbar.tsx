'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Menu, X, ExternalLink, Sun, Moon } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Capabilities', href: '#capabilities' },
  { name: 'Demo', href: '#demo' },
  { name: 'Architecture', href: '#architecture' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/60 py-3 shadow-xs'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 group-hover:scale-105 transition-transform duration-200">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 dark:bg-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base tracking-widest text-neutral-800 dark:text-white uppercase font-sans">
                FITCOACH
              </span>
              <span className="text-[10px] tracking-widest font-mono text-neutral-500 uppercase -mt-1">
                AI // WELLNESS
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-3.5 text-xs font-normal uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            {navLinks.map((link, idx) => (
              <div key={link.name} className="flex items-center gap-3.5">
                {idx > 0 && (
                  <span className="text-neutral-300 dark:text-neutral-700 select-none font-light" aria-hidden="true">
                    |
                  </span>
                )}
                <a
                  href={link.href}
                  className="hover:text-neutral-800 dark:hover:text-white transition-colors duration-200 relative group py-1"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-neutral-800 dark:bg-white transition-all duration-200 group-hover:w-full" />
                </a>
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-white transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <a
              href="https://github.com/Harpreet1999"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.92.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            </a>

            <a
              href="#demo"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800 text-neutral-100 hover:bg-neutral-700 dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-neutral-100 text-xs font-semibold uppercase tracking-wider active:scale-98 transition-all duration-200 shadow-xs"
            >
              <span>Try Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-[#f8f7f5]/98 dark:bg-neutral-900/98 backdrop-blur-xl px-6 py-6 animate-fade-in">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white flex items-center justify-between py-2 border-b border-neutral-200/50 dark:border-neutral-800/50 text-sm font-normal uppercase tracking-wider"
              >
                <span>{link.name}</span>
                <ExternalLink className="w-4 h-4 opacity-50" />
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
