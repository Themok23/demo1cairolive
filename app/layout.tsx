import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Demo1 Cairo Live - Egyptian Profiles & Articles',
  description:
    'Celebrating extraordinary Egyptians and inspiring stories from around the globe. Browse profiles, read articles, and connect with remarkable people.',
  keywords:
    'Egyptian profiles, Cairo, people, articles, inspiration, storytelling, Egypt',
  authors: [{ name: 'Demo1 Cairo Live' }],
  openGraph: {
    title: 'Demo1 Cairo Live',
    description:
      'Celebrating extraordinary Egyptians and inspiring stories from around the globe.',
    type: 'website',
    url: 'https://demo1cairolive.com',
    siteName: 'Demo1 Cairo Live',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Demo1 Cairo Live',
    description:
      'Celebrating extraordinary Egyptians and inspiring stories from around the globe.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
