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
  Compass,
  MapPin,
  Inbox,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: `/${locale}/admin`,              label: 'Dashboard',   icon: LayoutDashboard },
    { href: `/${locale}/admin/pillars`,      label: 'Pillars',     icon: Compass },
    { href: `/${locale}/admin/places`,       label: 'Places',      icon: MapPin },
    { href: `/${locale}/admin/people`,       label: 'People',      icon: Users },
    { href: `/${locale}/admin/articles`,     label: 'Articles',    icon: FileText },
    { href: `/${locale}/admin/experiences`,  label: 'Experiences', icon: Sparkles },
    { href: `/${locale}/admin/submissions`,  label: 'Submissions', icon: MessageSquare },
    { href: `/${locale}/admin/inquiries`,    label: 'Inquiries',   icon: Inbox },
    { href: `/${locale}/admin/subscribers`,  label: 'Subscribers', icon: Mail },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-surface-elevated border border-gold/20 text-text-primary hover:bg-border/30 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 h-screen bg-surface border-r border-gold/10 z-30 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gold/10">
            <Link href={`/${locale}/admin`} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                <span className="text-background font-bold text-lg">C</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-text-primary text-sm">Cairo Live</span>
                <span className="text-gold text-xs">Admin</span>
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
                    ? 'bg-gold/10 text-gold border border-gold/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gold/10">
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
          className="fixed inset-0 bg-background/60 backdrop-blur-sm md:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
