import { db } from '@/src/infrastructure/db/client';
import { persons, krtkInquiries } from '@/src/infrastructure/db/schema';
import { eq, count } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/src/lib/auth';
import Link from 'next/link';
import { ArrowLeft, Eye, Share2, MessageSquare } from 'lucide-react';
import AnalyticsChart from '@/components/admin/analytics-chart';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function PersonAnalyticsPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect('/api/auth/signin');

  const { locale, id } = await params;
  const isAr = locale === 'ar';

  const person = await db.select().from(persons).where(eq(persons.id, id)).then((r) => r[0]);
  if (!person) notFound();

  const [inquiryCount] = await db
    .select({ count: count() })
    .from(krtkInquiries)
    .where(eq(krtkInquiries.krtkSlug, id));

  const stats = [
    {
      label: isAr ? 'مشاهدات' : 'Profile Views',
      value: person.viewCount ?? 0,
      icon: Eye,
      color: 'text-blue-400',
    },
    {
      label: isAr ? 'مشاركات' : 'Shares',
      value: person.shareCount ?? 0,
      icon: Share2,
      color: 'text-green-400',
    },
    {
      label: isAr ? 'استفسارات' : 'Inquiries',
      value: inquiryCount?.count ?? 0,
      icon: MessageSquare,
      color: 'text-gold',
    },
  ];

  const name = isAr && person.firstNameAr
    ? `${person.firstNameAr} ${person.lastNameAr ?? ''}`.trim()
    : `${person.firstNameEn} ${person.lastNameEn}`.trim();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/${locale}/admin/people/${id}/edit` as any}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          {isAr ? 'العودة للتعديل' : 'Back to Edit'}
        </Link>

        <h1 className="text-2xl font-bold text-text-primary mb-1">{name}</h1>
        <p className="text-text-secondary text-sm mb-8">
          {isAr ? 'تحليلات الملف الشخصي' : 'Profile Analytics'}
        </p>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-xl border border-gold/10 bg-surface-elevated p-5 text-center">
                <Icon size={22} className={`mx-auto mb-2 ${s.color}`} />
                <p className="text-3xl font-bold text-text-primary">{s.value.toLocaleString()}</p>
                <p className="text-xs text-text-secondary mt-1">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Chart — client component */}
        <AnalyticsChart
          views={person.viewCount ?? 0}
          shares={person.shareCount ?? 0}
          inquiries={inquiryCount?.count ?? 0}
          locale={isAr ? 'ar' : 'en'}
        />
      </div>
    </div>
  );
}
