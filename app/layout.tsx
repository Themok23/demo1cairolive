import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Cairo Live - Every Egyptian Has a Story',
  description:
    'Discover remarkable Egyptians through their stories and digital profiles. Celebrate extraordinary achievements, innovations, and personal journeys from Cairo and beyond.',
  keywords:
    'Egyptian profiles, Cairo, people, articles, inspiration, storytelling, Egypt, remarkable people',
  authors: [{ name: 'Cairo Live' }],
  creator: 'The Mok Company',
  openGraph: {
    title: 'Cairo Live - Every Egyptian Has a Story',
    description:
      'Discover remarkable Egyptians through their stories and digital profiles.',
    type: 'website',
    url: 'https://cairolive.com',
    siteName: 'Cairo Live',
    locale: 'en_EG',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cairo Live',
    description:
      'Discover remarkable Egyptians through their stories and digital profiles.',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <head>
        <meta name="theme-color" content="#0A0A0B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} bg-background`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
