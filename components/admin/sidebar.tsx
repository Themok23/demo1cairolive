'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, Users, FileText, MessageSquare, Mail,
  Compass, MapPin, Inbox, LogOut, Menu, X, Sparkles,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Content',
    items: [
      { href: (l: string) => `/${l}/admin`,             label: 'Dashboard',    icon: LayoutDashboard, exact: true },
      { href: (l: string) => `/${l}/admin/pillars`,     label: 'Pillars',      icon: Compass },
      { href: (l: string) => `/${l}/admin/places`,      label: 'Places',       icon: MapPin },
      { href: (l: string) => `/${l}/admin/people`,      label: 'People',       icon: Users },
      { href: (l: string) => `/${l}/admin/articles`,    label: 'Articles',     icon: FileText },
      { href: (l: string) => `/${l}/admin/experiences`, label: 'Experiences',  icon: Sparkles },
    ],
  },
  {
    label: 'Community',
    items: [
      { href: (l: string) => `/${l}/admin/submissions`, label: 'Submissions',  icon: MessageSquare },
      { href: (l: string) => `/${l}/admin/inquiries`,   label: 'Inquiries',    icon: Inbox },
      { href: (l: string) => `/${l}/admin/subscribers`, label: 'Subscribers',  icon: Mail },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href) && !(exact === false && pathname === href);

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 rounded-xl bg-surface-elevated border border-gold/20 text-text-primary hover:border-gold/40 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-60 h-screen flex flex-col bg-surface border-r border-border/60 z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border/60">
          <Link
            href={`/${locale}/admin` as any}
            className="flex items-center gap-3"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-amber flex items-center justify-center shadow-lg shadow-gold/20">
                <span className="text-background font-bold text-base leading-none">C</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-surface" />
            </div>
            <div>
              <p className="font-bold text-text-primary text-sm leading-tight">Cairo Live</p>
              <p className="text-gold text-[11px] font-medium tracking-wide">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold text-text-secondary/50 uppercase tracking-widest px-3 mb-2">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ href, label, icon: Icon, exact }) => {
                  const url = href(locale);
                  const active = isActive(url, exact);
                  return (
                    <Link
                      key={url}
                      href={url as any}
                      onClick={() => setIsOpen(false)}
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                        active
                          ? 'bg-gold/10 text-gold'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gold rounded-r-full" />
                      )}
                      <Icon
                        size={17}
                        className={active ? 'text-gold' : 'text-text-secondary group-hover:text-text-primary'}
                      />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-border/60">
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-red-400 hover:bg-red-500/8 transition-all duration-150"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/70 backdrop-blur-sm md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
