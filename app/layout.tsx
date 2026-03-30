import type { Metadata } from 'next';
import './globals.css';

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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
