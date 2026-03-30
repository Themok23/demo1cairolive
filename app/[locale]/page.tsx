import Link from 'next/link';
import Button from '@/components/ui/Button';
import { db } from '@/src/infrastructure/db/client';
import { persons, articles } from '@/src/infrastructure/db/schema';
import { eq, desc } from 'drizzle-orm';
<<<<<<< HEAD
import { Users, Zap, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
=======
import { Star, BookOpen, Users, ArrowRight } from 'lucide-react';
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
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
<<<<<<< HEAD
    tier: (p.tier === 'gold' || p.tier === 'silver' || p.tier === 'platinum' ? p.tier : 'bronze') as 'platinum' | 'gold' | 'silver' | 'bronze',
=======
    tier: (p.tier === 'gold' || p.tier === 'silver' ? p.tier : 'bronze') as 'gold' | 'silver' | 'bronze',
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
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
<<<<<<< HEAD
                    <span className="gradient-text font-bold">"</span>
                    كل شخص استثنائي يستحق أن يُحتفى به
                    <span className="gradient-text font-bold">"</span>
                  </>
                ) : (
                  <>
                    <span className="gradient-text font-bold">"</span>
                    Every remarkable person deserves to be celebrated
                    <span className="gradient-text font-bold">"</span>
=======
                    <span className="gradient-text font-bold">&ldquo;</span>
                    كل شخص استثنائي يستحق أن يُحتفى به
                    <span className="gradient-text font-bold">&rdquo;</span>
                  </>
                ) : (
                  <>
                    <span className="gradient-text font-bold">&ldquo;</span>
                    Every remarkable person deserves to be celebrated
                    <span className="gradient-text font-bold">&rdquo;</span>
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
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
<<<<<<< HEAD
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/3 to-transparent" />
        <div className="relative mx-auto max-w-6xl">
          <ScrollReveal direction="up">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-text-primary lg:text-5xl">
                {isAr ? 'كيف يعمل' : 'How It Works'}
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-text-secondary">
                {isAr
                  ? 'عملية بسيطة وسهلة للانضمام إلى مجتمعنا المتنامي'
                  : 'A simple process to join our growing community'}
=======
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
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
              </p>
            </div>
          </ScrollReveal>

<<<<<<< HEAD
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                en: { title: 'Submit Profile', description: 'Share your achievements, expertise, and story with us' },
                ar: { title: 'أرسل ملفك الشخصي', description: 'شارك إنجازاتك وخبرتك وقصتك معنا' },
                icon: Users,
              },
              {
                en: { title: 'Review Process', description: 'Our team verifies and curates your profile carefully' },
                ar: { title: 'عملية المراجعة', description: 'يقوم فريقنا بالتحقق من ملفك بعناية' },
                icon: Zap,
              },
              {
                en: { title: 'Get Featured', description: 'Your profile goes live and gets featured on our platform' },
                ar: { title: 'اظهر ملفك', description: 'يظهر ملفك مباشرة على منصتنا' },
                icon: TrendingUp,
              },
            ].map((step, index) => {
              const IconComponent = step.icon;
              const content = isAr ? step.ar : step.en;
              return (
                <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                  <div className="group relative rounded-xl border border-border/50 bg-gradient-to-br from-surface-elevated to-surface p-8 transition-all duration-300 hover:border-gold/60 hover:shadow-[0_0_30px_rgba(212,168,83,0.2)] hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                    <div className="relative z-10">
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 border border-gold/30">
                        <IconComponent size={24} className="text-gold" />
                      </div>
                      <div className="mb-3 flex items-center gap-3">
                        <h3 className="text-xl font-bold text-text-primary">{content.title}</h3>
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-sm font-bold text-gold">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-text-secondary">{content.description}</p>
=======
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
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subscribe CTA Section */}
<<<<<<< HEAD
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5" />
        <div className="relative mx-auto max-w-4xl">
          <ScrollReveal direction="up">
            <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-surface-elevated via-surface to-surface-elevated p-12 text-center">
              <h3 className="mb-4 text-3xl font-bold text-text-primary lg:text-4xl">
                {isAr ? 'ابقى على اتصال' : 'Stay Updated'}
              </h3>
              <p className="mb-8 text-lg text-text-secondary">
                {isAr
                  ? 'اشترك في نشرتنا الإخبارية لتتلقى أحدث القصص والإلهام مباشرة في بريدك الإلكتروني'
                  : 'Subscribe to our newsletter and get the latest stories and inspiration delivered to your inbox'}
              </p>
              <Link href={`/${locale}/subscribe`}>
                <Button size="lg" className="gap-2">
                  {isAr ? 'اشترك الآن' : 'Subscribe Now'}
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Share Your Story CTA Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8 border-t border-border/30">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/3 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl">
          <ScrollReveal direction="up">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/10 to-surface p-8">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gold/20">
                  <CheckCircle size={24} className="text-gold" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-text-primary">
                  {isAr ? 'أنت ملحوظ' : 'You Are Remarkable'}
                </h3>
                <p className="text-text-secondary">
                  {isAr
                    ? 'شارك إنجازاتك وخبرتك مع مجتمع يقدّر التميز والابتكار'
                    : 'Share your achievements and expertise with a community that values excellence'}
                </p>
                <Link href={`/${locale}/submit`}>
                  <Button variant="outline" className="mt-6 gap-2">
                    {isAr ? 'أرسل قصتك' : 'Submit Your Story'}
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>

              <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/10 to-surface p-8">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gold/20">
                  <CheckCircle size={24} className="text-gold" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-text-primary">
                  {isAr ? 'ملفات KRTK الرقمية' : 'KRTK Digital Cards'}
                </h3>
                <p className="text-text-secondary">
                  {isAr
                    ? 'احصل على بطاقة عمل رقمية احترافية تعرّف عنك وتشارك كل شيء في مكان واحد'
                    : 'Get a professional digital business card that showcases who you are'}
                </p>
                <Link href={`/${locale}/krtk`}>
                  <Button variant="outline" className="mt-6 gap-2">
                    {isAr ? 'استكشف KRTK' : 'Explore KRTK'}
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
=======
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
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
          </ScrollReveal>
        </div>
      </section>
    </>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
