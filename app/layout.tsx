import type { Metadata } from 'next';
import './globals.css';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const notoArabic = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-arabic', display: 'swap' });

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
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={`${inter.variable} ${notoArabic.variable}`}>
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=(t==='light'||t==='dark')?t:(t==='system'?(m?'dark':'light'):'dark');document.documentElement.classList.add(resolved);}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning className="bg-background text-text-primary transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
