import { auth } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import { DrizzleExperienceRepository } from '@/src/infrastructure/repositories/drizzleExperienceRepository';
import ExperiencesAdminList from '@/components/admin/experiences-list';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function AdminExperiencesPage({ params, searchParams }: Props) {
  const session = await auth();
  if (!session) redirect('/en/admin/login');

  const { locale } = await params;
  const { tab = 'pending' } = await searchParams;
  const repo = new DrizzleExperienceRepository();
  const status = (tab === 'published' || tab === 'rejected') ? tab : 'pending';
  const items = await repo.listByStatus(status as 'pending' | 'published' | 'rejected');

  const [pendingCount, publishedCount, rejectedCount] = await Promise.all([
    repo.countByStatus('pending'),
    repo.countByStatus('published'),
    repo.countByStatus('rejected'),
  ]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Experiences</h1>
        <p className="text-text-secondary text-sm mt-1">Review and moderate submitted experiences</p>
      </div>

      <div className="flex gap-2">
        {[
          { key: 'pending',   label: `Pending (${pendingCount})` },
          { key: 'published', label: `Published (${publishedCount})` },
          { key: 'rejected',  label: `Rejected (${rejectedCount})` },
        ].map(({ key, label }) => (
          <a
            key={key}
            href={`/${locale}/admin/experiences?tab=${key}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              tab === key
                ? 'bg-gold text-background'
                : 'border border-gold/20 text-text-secondary hover:text-text-primary'
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      <ExperiencesAdminList items={items} locale={locale} status={status} />
    </div>
  );
}
