import { ReactNode } from 'react';
import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/sidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();

  if (!session) {
    redirect('/admin/login?callbackUrl=/admin');
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
