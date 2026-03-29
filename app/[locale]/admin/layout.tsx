import { ReactNode } from 'react';
import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/sidebar';

interface AdminLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const session = await auth();

  if (!session) {
    redirect(`/${params.locale}/admin/login?callbackUrl=/${params.locale}/admin`);
  }

  return (
    <div className="flex h-screen bg-[#0a0a0f]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
