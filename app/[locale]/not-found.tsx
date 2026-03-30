'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function NotFound() {
  const locale = useLocale();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
<<<<<<< HEAD
      <h1 className="text-8xl font-bold text-gold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4 text-text-primary">Page Not Found</h2>
      <p className="text-text-secondary mb-8 max-w-md">The page you are looking for does not exist or has been moved.</p>
      <Link
        href={`/${locale}`}
        className="px-6 py-3 bg-gold text-background rounded-lg font-medium hover:bg-amber transition-colors duration-200"
      >
=======
      <h1 className="text-8xl font-bold text-[#D4A853] mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4 text-white">Page Not Found</h2>
      <p className="text-gray-400 mb-8 max-w-md">The page you are looking for does not exist or has been moved.</p>
      <Link href={`/${locale}`} className="px-6 py-3 bg-[#D4A853] text-[#0a0a0f] rounded-lg font-medium hover:bg-[#E8C97A] transition-colors duration-200">
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
        Back to Home
      </Link>
    </div>
  );
}
