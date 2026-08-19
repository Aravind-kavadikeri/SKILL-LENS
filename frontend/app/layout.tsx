import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/providers';
import AppShell from '@/components/layout/AppShell';
import SplashScreen from '@/components/layout/SplashScreen';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'SkillLENS — Career Intelligence Platform',
  description:
    'AI-powered career intelligence platform providing real-time job market insights, skill analytics, salary predictions, and personalized career roadmaps.',
  keywords: [
    'career intelligence',
    'job market',
    'skill analytics',
    'salary prediction',
    'career roadmap',
    'AI career coach',
  ],
  openGraph: {
    title: 'SkillLENS — Career Intelligence Platform',
    description:
      'AI-powered career intelligence platform providing real-time job market insights, skill analytics, salary predictions, and personalized career roadmaps.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <AppShell>{children}</AppShell>
          <SplashScreen />
        </Providers>
      </body>
    </html>
  );
}
