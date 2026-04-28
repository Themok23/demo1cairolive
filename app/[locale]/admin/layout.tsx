import { ReactNode } from 'react';
import { headers } from 'next/headers';
import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/sidebar';

interface AdminLayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale } = await params;

  // Read the current pathname from the middleware-set header.
  // The login page must NOT trigger an auth redirect, otherwise we get an
  // infinite redirect loop on first visit (login -> login -> login...).
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isLoginPage = pathname.includes('/admin/login');

  if (!isLoginPage) {
    const session = await auth();
    if (!session) {
      redirect(`/${locale}/admin/login?callbackUrl=/${locale}/admin`);
    }
  }

  // The login page renders without sidebar — it's a centered standalone form.
  if (isLoginPage) {
    return (
      <div className="dark min-h-dvh bg-background text-text-primary">
        {children}
      </div>
    );
  }

  return (
    // Force dark theme in admin regardless of user's public-site preference.
    <div className="dark flex h-dvh bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-background text-text-primary">
        {children}
      </main>
    </div>
  );
}
