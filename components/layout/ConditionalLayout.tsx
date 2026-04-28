'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageTransitionProvider from '@/components/client/PageTransitionProvider';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.includes('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <PageTransitionProvider>
      <Header />
      <main className="min-h-dvh">{children}</main>
      <Footer />
    </PageTransitionProvider>
  );
}
