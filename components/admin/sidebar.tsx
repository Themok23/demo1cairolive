'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Mail,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: `/${locale}/admin`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/${locale}/admin/people`, label: 'People', icon: Users },
    { href: `/${locale}/admin/articles`, label: 'Articles', icon: FileText },
    { href: `/${locale}/admin/submissions`, label: 'Submissions', icon: MessageSquare },
    { href: `/${locale}/admin/subscribers`, label: 'Subscribers', icon: Mail },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-[#1a1a1f] border border-[#D4A853]/20 text-white hover:bg-[#2a2a2f] transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 h-screen bg-[#1a1a1f] border-r border-[#D4A853]/10 z-30 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#D4A853]/10">
            <Link href={`/${locale}/admin`} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#D4A853] flex items-center justify-center">
                <span className="text-[#0a0a0f] font-bold text-lg">C</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-sm">Cairo Live</span>
                <span className="text-[#D4A853] text-xs">Admin</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href as any}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(href)
                    ? 'bg-[#D4A853]/10 text-[#D4A853] border border-[#D4A853]/20'
                    : 'text-gray-400 hover:text-white hover:bg-[#2a2a2f]'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-[#D4A853]/10">
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/10 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
