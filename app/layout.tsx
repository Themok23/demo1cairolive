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
<<<<<<< HEAD
=======
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
<<<<<<< HEAD
  return children;
}
=======
  return (
    <html suppressHydrationWarning>
      <body className="bg-[#0a0a0f] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
