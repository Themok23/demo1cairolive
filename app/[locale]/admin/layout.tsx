import { ReactNode } from 'react';
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
  const session = await auth();

  if (!session) {
    redirect(`/${locale}/admin/login?callbackUrl=/${locale}/admin`);
  }

  return (
    // Force dark theme in admin regardless of user's public-site preference.
    // Admin components use hardcoded dark design language; this ensures token
    // resolution always picks the dark values.
    <div className="dark flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-background text-text-primary">
        {children}
      </main>
    </div>
  );
}
