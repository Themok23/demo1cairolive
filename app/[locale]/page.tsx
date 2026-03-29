import Link from 'next/link';
import Button from '@/components/ui/Button';
import { db } from '@/src/infrastructure/db/client';
import { persons, articles } from '@/src/infrastructure/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Star, BookOpen, Users, ArrowRight } from 'lucide-react';
import AnimatedHero from '@/components/client/AnimatedHero';
import ArticleCarousel from '@/components/client/ArticleCarousel';
import RotatingCards from '@/components/client/RotatingCards';
import ScrollReveal from '@/components/client/ScrollReveal';
import ParallaxSection from '@/components/client/ParallaxSection';

interface HomePageProps {
  params: {
    locale: string;
  };
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;

  const featuredPeople = await db
    .select()
    .from(persons)
    .limit(6);

  const latestArticles = await db
    .select()
    .from(articles)
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt))
    .limit(8);

  const isAr = locale === 'ar';

  // Transform people for RotatingCards
  const rotatingPeople = featuredPeople.map((p) => ({
    id: p.id,
    name: `${p.firstName} ${p.lastName}`,
    position: p.currentPosition || '',
    company: p.currentCompany || '',
    imageUrl: p.profileImageUrl,
    tier: (p.tier === 'gold' || p.tier === 'silver' ? p.tier : 'bronze') as 'gold' | 'silver' | 'bronze',
  }));

  // Transform articles for carousel
  const carouselArticles = latestArticles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt || '',
    featuredImageUrl: a.featuredImageUrl,
    publishedAt: a.publishedAt,
  }));

  return (
    <>
      {/* Hero Section with Canvas Background */}
      <AnimatedHero locale={locale} />

      {/* Featured Profiles - Rotating Cards */}
      <RotatingCards people={rotatingPeople} locale={locale} />

      {/* Article Carousel - Full Width GSAP ScrollTrigger */}
      <ArticleCarousel articles={carouselArticles} locale={locale} />

      {/* Parallax Quote Section */}
      <ParallaxSection speed={0.3} direction="up">
        <section className="relative px-4 py-32 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-gold/5" />
          <div className="relative mx-auto max-w-4xl text-center">
            <ScrollReveal direction="up">
              <div className="mb-8">
                <div className="inline-block h-px w-20 bg-gold/50 mb-8" />
              </div>
              <blockquote className="text-3xl font-light text-text-primary leading-relaxed sm:text-4xl lg:text-5xl">
                {isAr ? (
                  <>
                    <span className="gradient-text font-bold">&ldquo;</span>
                    كل شخص استثنائي يستحق أن يُحتفى به
                    <span className="gradient-text font-bold">&rdquo;</span>
                  </>
                ) : (
                  <>
                    <span className="gradient-text font-bold">&ldquo;</span>
                    Every remarkable person deserves to be celebrated
                    <span className="gradient-text font-bold">&rdquo;</span>
                  </>
                )}
              </blockquote>
              <p className="mt-6 text-lg text-text-secondary">
                {isAr ? 'Cairo Live' : 'Cairo Live'}
              </p>
              <div className="mt-8">
                <div className="inline-block h-px w-20 bg-gold/50" />
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ParallaxSection>

      {/* How It Works Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal direction="up">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-text-primary lg:text-5xl">
                {isAr ? (
                  <>كيف <span className="gradient-text">يعمل</span></>
                ) : (
                  <>How It <span className="gradient-text">Works</span></>
                )}
              </h2>
              <p className="text-lg text-text-secondary">
                {isAr
                  ? 'ثلاث خطوات بسيطة لعرض قصتك المميزة'
                  : 'Three simple steps to showcase your remarkable story'}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                number: '01',
                titleEn: 'Submit',
                titleAr: 'أرسل',
                descEn: 'Share your profile, achievements, and inspiring journey with our community.',
                descAr: 'شارك ملفك الشخصي وإنجازاتك ورحلتك الملهمة مع مجتمعنا.',
                icon: Users,
              },
              {
                number: '02',
                titleEn: 'Discover',
                titleAr: 'اكتشف',
                descEn: 'Get featured and discovered by thousands of remarkable people.',
                descAr: 'احصل على إبراز واكتشاف من قبل آلاف الأشخاص المتميزين.',
                icon: Star,
              },
              {
                number: '03',
                titleEn: 'Shine',
                titleAr: 'تألق',
                descEn: 'Build your professional presence and connect with like-minded individuals.',
                descAr: 'ابنِ حضورك المهني وتواصل مع أشخاص يشاركونك نفس الرؤية.',
                icon: BookOpen,
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <ScrollReveal key={index} direction="up" delay={index * 0.15}>
                  <div className="group relative overflow-hidden rounded-xl border border-border/30 bg-gradient-to-br from-surface-elevated/50 to-surface p-8 transition-all duration-300 hover:border-gold/50 hover:shadow-[0_0_30px_rgba(212,168,83,0.15)]">
                    <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10">
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-gold/20 to-amber/10 border border-gold/30">
                        <Icon size={32} className="text-gold" />
                      </div>
                      <div className="mb-4 text-5xl font-black text-gold/20">{step.number}</div>
                      <h3 className="mb-2 text-2xl font-bold text-text-primary">
                        {isAr ? step.titleAr : step.titleEn}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">
                        {isAr ? step.descAr : step.descEn}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subscribe CTA Section */}
      <ParallaxSection speed={0.2} direction="down">
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-r from-surface-elevated via-surface to-surface-elevated opacity-40" />
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gold/5 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <ScrollReveal direction="up">
              <h2 className="mb-4 text-4xl font-bold text-text-primary">
                {isAr ? 'ابقَ على اطلاع' : 'Stay Updated'}
              </h2>
              <p className="mb-8 text-lg text-text-secondary">
                {isAr
                  ? 'اشترك في نشرتنا البريدية ولا تفوت أي ملفات شخصية أو قصص ملهمة جديدة'
                  : 'Subscribe to our newsletter and never miss out on new profiles and inspiring stories'}
              </p>
              <form action="/api/subscribers" method="POST" className="flex flex-col gap-3 sm:flex-row sm:gap-0">
                <input
                  type="email"
                  name="email"
                  placeholder={isAr ? 'بريدك@الالكتروني.com' : 'your@email.com'}
                  required
                  className="flex-1 rounded-l-lg border border-border/50 bg-surface px-4 py-3 text-text-primary placeholder-text-secondary focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
                <Button variant="primary" size="lg" className="rounded-r-lg">
                  {isAr ? 'اشترك' : 'Subscribe'}
                </Button>
              </form>
              <p className="mt-4 text-sm text-text-secondary">
                {isAr
                  ? 'نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.'
                  : 'We respect your privacy. Unsubscribe anytime.'}
              </p>
            </ScrollReveal>
          </div>
        </section>
      </ParallaxSection>

      {/* Final CTA Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <ScrollReveal direction="up">
            <h2 className="mb-4 text-4xl font-bold text-text-primary lg:text-5xl">
              {isAr ? (
                <>شارك <span className="gradient-text">قصتك</span></>
              ) : (
                <>Share Your <span className="gradient-text">Story</span></>
              )}
            </h2>
            <p className="mb-8 text-lg text-text-secondary">
              {isAr
                ? 'كل شخص متميز يستحق أن يُحتفى به. أرسل ملفك الشخصي اليوم وانضم إلى مجتمعنا.'
                : 'Every remarkable person deserves to be celebrated. Submit your profile today and become part of our community.'}
            </p>
            <Button variant="primary" size="lg">
              <Link href={`/${locale}/submit`} className="flex items-center gap-2">
                {isAr ? 'أرسل ملفك الشخصي' : 'Submit Your Profile'}
                <ArrowRight size={18} />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
