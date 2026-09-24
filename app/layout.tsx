import type { Metadata } from 'next'
import './globals.css'

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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-neutral-800 selection:text-white antialiased">
        {children}
      </body>
    </html>
  )
}
