'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function NotFound() {
  const locale = useLocale();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-bold text-gold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4 text-text-primary">Page Not Found</h2>
      <p className="text-text-secondary mb-8 max-w-md">The page you are looking for does not exist or has been moved.</p>
      <Link
        href={`/${locale}`}
        className="px-6 py-3 bg-gold text-background rounded-lg font-medium hover:bg-amber transition-colors duration-200"
      >
        Back to Home
      </Link>
    </div>
  );
}
