import Link from 'next/link';
import FadeIn from '@/components/animations/FadeIn';
import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import KrtkBusinessCard from '@/components/micro-krtk/KrtkBusinessCard';
import { ArrowLeft } from 'lucide-react';

import { DrizzlePersonEducationRepository } from '@/src/infrastructure/repositories/drizzlePersonEducationRepository';
import { DrizzlePersonWorkplaceRepository } from '@/src/infrastructure/repositories/drizzlePersonWorkplaceRepository';
import { DrizzlePersonAchievementRepository } from '@/src/infrastructure/repositories/drizzlePersonAchievementRepository';
import { DrizzlePersonServiceRepository } from '@/src/infrastructure/repositories/drizzlePersonServiceRepository';
import { DrizzlePersonProductRepository } from '@/src/infrastructure/repositories/drizzlePersonProductRepository';

import { ListPersonEducationUseCase } from '@/src/application/use-cases/person-education/listByPerson';
import { ListPersonWorkplacesUseCase } from '@/src/application/use-cases/person-workplaces/listByPerson';
import { ListPersonAchievementsUseCase } from '@/src/application/use-cases/person-achievements/listByPerson';
import { ListPersonServicesUseCase } from '@/src/application/use-cases/person-services/listByPerson';
import { ListPersonProductsUseCase } from '@/src/application/use-cases/person-products/listByPerson';

import EducationSection from '@/components/micro-krtk/sections/EducationSection';
import WorkplacesSection from '@/components/micro-krtk/sections/WorkplacesSection';
import AchievementsSection from '@/components/micro-krtk/sections/AchievementsSection';
import ServicesSection from '@/components/micro-krtk/sections/ServicesSection';
import ProductsSection from '@/components/micro-krtk/sections/ProductsSection';

interface KrtkPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function KrtkProfilePage({ params }: KrtkPageProps) {
  const { locale, slug } = await params;

  const personRows = await db.select().from(persons).where(eq(persons.id, slug)).limit(1);
  if (personRows.length === 0) notFound();

  const rawPerson = personRows[0];
  const currentPerson = {
    ...rawPerson,
    isVerified: rawPerson.isVerified ?? undefined,
    isClaimed: rawPerson.isClaimed ?? undefined,
  };
  const isAr = locale === 'ar';

  const educationRepo = new DrizzlePersonEducationRepository();
  const workplaceRepo = new DrizzlePersonWorkplaceRepository();
  const achievementRepo = new DrizzlePersonAchievementRepository();
  const serviceRepo = new DrizzlePersonServiceRepository();
  const productRepo = new DrizzlePersonProductRepository();

  const [educationResult, workplacesResult, achievementsResult, servicesResult, productsResult] =
    await Promise.all([
      new ListPersonEducationUseCase(educationRepo).execute(rawPerson.id),
      new ListPersonWorkplacesUseCase(workplaceRepo).execute(rawPerson.id),
      new ListPersonAchievementsUseCase(achievementRepo).execute(rawPerson.id),
      new ListPersonServicesUseCase(serviceRepo).execute(rawPerson.id),
      new ListPersonProductsUseCase(productRepo).execute(rawPerson.id),
    ]);

  const education = educationResult.data ?? [];
  const workplaces = workplacesResult.data ?? [];
  const achievements = achievementsResult.data ?? [];
  const services = servicesResult.data ?? [];
  const products = productsResult.data ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-surface-elevated via-background to-background dark:from-background dark:via-background dark:to-background">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Link
            href={`/${locale}/krtk`}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            {isAr ? 'العودة للدليل' : 'Back to Directory'}
          </Link>
        </div>
      </div>

      <div className="relative flex-1 px-4 pb-16 sm:px-6">
        <div className="absolute inset-0 pointer-events-none dark:hidden overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-gold/[0.05] blur-[120px]" />
        </div>

        <div className="relative w-full max-w-2xl mx-auto pt-8 sm:pt-12">
          <FadeIn>
            <KrtkBusinessCard person={currentPerson} locale={locale} />
          </FadeIn>
        </div>

        <EducationSection items={education} locale={isAr ? 'ar' : 'en'} />
        <WorkplacesSection items={workplaces} locale={isAr ? 'ar' : 'en'} />
        <AchievementsSection items={achievements} locale={isAr ? 'ar' : 'en'} />
        <ServicesSection items={services} locale={isAr ? 'ar' : 'en'} />
        <ProductsSection items={products} locale={isAr ? 'ar' : 'en'} />

        {/* Inquiry CTA — form mounts in Phase 4 */}
        <div className="w-full max-w-2xl mx-auto px-4 py-8">
          <div className="rounded-xl border border-gold/20 bg-surface-elevated p-6 text-center">
            <p className="text-text-primary font-medium mb-1">
              {isAr ? 'تواصل مع ' : 'Get in touch with '}
              {isAr && rawPerson.firstNameAr
                ? `${rawPerson.firstNameAr} ${rawPerson.lastNameAr ?? ''}`.trim()
                : `${rawPerson.firstNameEn} ${rawPerson.lastNameEn}`.trim()}
            </p>
            <p className="text-sm text-text-secondary">
              {isAr ? 'نموذج التواصل قادم قريباً' : 'Inquiry form coming soon'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
