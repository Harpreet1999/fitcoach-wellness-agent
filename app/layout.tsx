import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'FitCoach AI — Personal Wellness Agent',
  description: 'An AI-powered fitness and wellness assistant built on Google Gemini. Calculates macros, tracks workouts, and generates personalized recommendations. Built at the Google Build with Gemini 2026 workshop.',
  keywords: ['FitCoach AI', 'Google Gemini', 'AI fitness coach', 'macro calculator', 'workout planner', 'Google ADK'],
  authors: [{ name: 'Harpreet Singh', url: 'https://harpreetsingh.xyz' }],
  openGraph: {
    title: 'FitCoach AI — Personal Wellness Agent',
    description: 'AI fitness coach built on Google Gemini. Track workouts, calculate macros, get personalized recommendations.',
    url: 'https://fitcoach-ai.vercel.app',
    siteName: 'FitCoach AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FitCoach AI — Personal Wellness Agent',
    description: 'AI fitness coach built on Google Gemini.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('kanso_theme');
                  if (t === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#f8f7f5] dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800 selection:text-neutral-800 dark:selection:text-white antialiased transition-colors duration-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
