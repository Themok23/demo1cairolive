import { notFound, redirect } from 'next/navigation';
import { auth } from '@/src/lib/auth';
import { GetPersonAnalyticsUseCase } from '@/src/application/use-cases/people/getPersonAnalytics';
import { DrizzlePersonRepository } from '@/src/infrastructure/repositories/drizzlePersonRepository';
import { DrizzleKrtkInquiryRepository } from '@/src/infrastructure/repositories/drizzleKrtkInquiryRepository';
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

  const result = await new GetPersonAnalyticsUseCase(
    new DrizzlePersonRepository(),
    new DrizzleKrtkInquiryRepository(),
  ).execute(id);

  if (!result.success || !result.data) notFound();
  const { data } = result;

  const stats = [
    { label: isAr ? 'مشاهدات' : 'Profile Views', value: data.viewCount, icon: Eye, color: 'text-blue-400' },
    { label: isAr ? 'مشاركات' : 'Shares', value: data.shareCount, icon: Share2, color: 'text-green-400' },
    { label: isAr ? 'استفسارات' : 'Inquiries', value: data.inquiryCount, icon: MessageSquare, color: 'text-gold' },
  ];

  const name = isAr && data.firstNameAr
    ? `${data.firstNameAr} ${data.lastNameAr ?? ''}`.trim()
    : `${data.firstNameEn} ${data.lastNameEn}`.trim();

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

        <AnalyticsChart
          views={data.viewCount}
          shares={data.shareCount}
          inquiries={data.inquiryCount}
          locale={isAr ? 'ar' : 'en'}
        />
      </div>
    </div>
  );
}
