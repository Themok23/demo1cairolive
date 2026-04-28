'use client';

import {
  Users, FileText, MessageSquare, Mail, Sparkles, Inbox,
  ArrowRight, Clock, CheckCircle, XCircle, AlertCircle,
  TrendingUp, Plus,
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface DashboardProps {
  stats: {
    totalPeople: number;
    totalArticles: number;
    totalSubmissions: number;
    pendingSubmissions: number;
    totalSubscribers: number;
    totalExperiences: number;
    totalInquiries: number;
  };
  recentSubmissions: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
    submittedAt: Date;
  }>;
  locale: string;
}

const STATUS_CONFIG: Record<string, { label: string; icon: typeof CheckCircle; className: string }> = {
  pending:  { label: 'Pending',  icon: Clock,        className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  approved: { label: 'Approved', icon: CheckCircle,  className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  rejected: { label: 'Rejected', icon: XCircle,      className: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, icon: AlertCircle, className: 'bg-border/30 text-text-secondary border-border' };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.className}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(' ');
  const letters = parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : name.slice(0, 2);
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/30 to-amber/20 border border-gold/30 flex items-center justify-center flex-shrink-0">
      <span className="text-gold text-xs font-bold uppercase">{letters}</span>
    </div>
  );
}

export default function AdminDashboard({ stats, recentSubmissions, locale }: DashboardProps) {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const statCards = [
    {
      title: 'People',
      value: stats.totalPeople,
      icon: Users,
      accent: '#60a5fa',
      glow: 'shadow-blue-500/10',
      href: `/${locale}/admin/people`,
      sub: 'in directory',
    },
    {
      title: 'Articles',
      value: stats.totalArticles,
      icon: FileText,
      accent: '#a78bfa',
      glow: 'shadow-purple-500/10',
      href: `/${locale}/admin/articles`,
      sub: 'published',
    },
    {
      title: 'Experiences',
      value: stats.totalExperiences,
      icon: Sparkles,
      accent: '#D4A853',
      glow: 'shadow-gold/10',
      href: `/${locale}/admin/experiences`,
      sub: 'published',
    },
    {
      title: 'Submissions',
      value: stats.totalSubmissions,
      icon: MessageSquare,
      accent: '#fb923c',
      glow: 'shadow-orange-500/10',
      href: `/${locale}/admin/submissions`,
      sub: stats.pendingSubmissions > 0 ? `${stats.pendingSubmissions} pending review` : 'all reviewed',
      alert: stats.pendingSubmissions > 0,
    },
    {
      title: 'Inquiries',
      value: stats.totalInquiries,
      icon: Inbox,
      accent: '#f472b6',
      glow: 'shadow-pink-500/10',
      href: `/${locale}/admin/inquiries`,
      sub: 'total received',
    },
    {
      title: 'Subscribers',
      value: stats.totalSubscribers,
      icon: Mail,
      accent: '#34d399',
      glow: 'shadow-emerald-500/10',
      href: `/${locale}/admin/subscribers`,
      sub: 'active',
    },
  ];

  const quickActions = [
    { label: 'New Person',      href: `/${locale}/admin/people/new`,   icon: Users },
    { label: 'New Article',     href: `/${locale}/admin/articles/new`,  icon: FileText },
    { label: 'New Pillar',      href: `/${locale}/admin/pillars/new`,   icon: TrendingUp },
    { label: 'New Place',       href: `/${locale}/admin/places/new`,    icon: Plus },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-text-secondary text-sm mb-1">{dateStr}</p>
            <h1 className="text-2xl font-bold text-text-primary">{greeting}, Admin</h1>
            {stats.pendingSubmissions > 0 && (
              <Link
                href={`/${locale}/admin/submissions` as any}
                className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
              >
                <AlertCircle size={13} />
                {stats.pendingSubmissions} submission{stats.pendingSubmissions > 1 ? 's' : ''} awaiting review
                <ArrowRight size={12} />
              </Link>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {quickActions.slice(0, 2).map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href as any}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-surface-elevated border border-border/60 text-text-secondary hover:text-text-primary hover:border-gold/30 transition-all duration-150"
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map(({ title, value, icon: Icon, accent, glow, href, sub, alert }) => (
            <Link
              key={title}
              href={href as any}
              className={`group relative rounded-xl bg-surface border border-border/60 p-5 flex flex-col gap-3 hover:border-gold/30 transition-all duration-200 hover:shadow-lg ${glow} overflow-hidden`}
            >
              <div
                className="absolute inset-x-0 top-0 h-px opacity-60"
                style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
              />
              <div className="flex items-center justify-between">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${accent}18` }}
                >
                  <Icon size={18} style={{ color: accent }} />
                </div>
                {alert && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary tabular-nums">{value.toLocaleString()}</p>
                <p className="text-xs font-medium text-text-secondary mt-0.5">{title}</p>
              </div>
              <p className={`text-[11px] truncate ${alert ? 'text-amber-400' : 'text-text-secondary/60'}`}>
                {sub}
              </p>
            </Link>
          ))}
        </div>

        {/* Recent Submissions + Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Recent Submissions — takes 2/3 */}
          <div className="lg:col-span-2 rounded-xl bg-surface border border-border/60 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-gold" />
                <h2 className="text-sm font-semibold text-text-primary">Recent Submissions</h2>
                {stats.pendingSubmissions > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {stats.pendingSubmissions} pending
                  </span>
                )}
              </div>
              <Link
                href={`/${locale}/admin/submissions` as any}
                className="text-xs font-medium text-gold hover:text-gold-light flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight size={13} />
              </Link>
            </div>

            {recentSubmissions.length > 0 ? (
              <div className="divide-y divide-border/40">
                {recentSubmissions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-surface-elevated/60 transition-colors"
                  >
                    <Initials name={`${s.firstName} ${s.lastName}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {s.firstName} {s.lastName}
                      </p>
                      <p className="text-xs text-text-secondary truncate">{s.email}</p>
                    </div>
                    <StatusBadge status={s.status} />
                    <p className="text-xs text-text-secondary/60 whitespace-nowrap hidden sm:block">
                      {formatDistanceToNow(new Date(s.submittedAt), { addSuffix: true })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
                <MessageSquare size={32} className="mb-3 opacity-30" />
                <p className="text-sm">No submissions yet</p>
              </div>
            )}
          </div>

          {/* Quick Actions — takes 1/3 */}
          <div className="rounded-xl bg-surface border border-border/60 overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-border/60">
              <Plus size={16} className="text-gold" />
              <h2 className="text-sm font-semibold text-text-primary">Quick Actions</h2>
            </div>
            <div className="p-4 space-y-2">
              {quickActions.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href as any}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-elevated border border-border/40 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-gold/30 hover:bg-gold/5 transition-all duration-150"
                >
                  <Icon size={15} className="text-gold/70" />
                  {label}
                  <ArrowRight size={13} className="ml-auto opacity-40" />
                </Link>
              ))}
              <Link
                href={`/${locale}/admin/submissions` as any}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-elevated border border-border/40 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-gold/30 hover:bg-gold/5 transition-all duration-150"
              >
                <MessageSquare size={15} className="text-gold/70" />
                Manage Submissions
                <ArrowRight size={13} className="ml-auto opacity-40" />
              </Link>
              <Link
                href={`/${locale}` as any}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary/60 hover:text-text-secondary transition-colors mt-2"
              >
                <ArrowRight size={14} className="rotate-180 opacity-50" />
                View public site
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
