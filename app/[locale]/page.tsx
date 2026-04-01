import Link from 'next/link';
import Button from '@/components/ui/Button';
import { db } from '@/src/infrastructure/db/client';
import { persons, articles } from '@/src/infrastructure/db/schema';
import { eq, desc } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { Users, Zap, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import AnimatedHero from '@/components/client/AnimatedHero';
import { localized, type Locale } from '@/src/lib/locale';
import { toKrtkPerson } from '@/src/lib/toKrtkPerson';
import ArticleCarousel from '@/components/client/ArticleCarousel';
import RotatingCards from '@/components/client/RotatingCards';
import ScrollReveal from '@/components/client/ScrollReveal';
import ParallaxSection from '@/components/client/ParallaxSection';
import QuoteArtworkSection from '@/components/client/QuoteArtworkSection';

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;

  const featuredPeople = await db
    .select()
    .from(persons)
    .limit(6);

  const malePerson = alias(persons, 'malePerson');
  const femalePerson = alias(persons, 'femalePerson');

  const latestArticles = await db
    .select({
      id: articles.id,
      slugEn: articles.slugEn,
      titleEn: articles.titleEn,
      titleAr: articles.titleAr,
      excerptEn: articles.excerptEn,
      excerptAr: articles.excerptAr,
      featuredImageUrl: articles.featuredImageUrl,
      publishedAt: articles.publishedAt,
      maleFirstNameEn: malePerson.firstNameEn,
      maleLastNameEn: malePerson.lastNameEn,
      maleImage: malePerson.profileImageUrl,
      maleId: malePerson.id,
      femaleFirstNameEn: femalePerson.firstNameEn,
      femaleLastNameEn: femalePerson.lastNameEn,
      femaleImage: femalePerson.profileImageUrl,
      femaleId: femalePerson.id,
    })
    .from(articles)
    .leftJoin(malePerson, eq(articles.malePersonId, malePerson.id))
    .leftJoin(femalePerson, eq(articles.femalePersonId, femalePerson.id))
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt))
    .limit(8);

  const isAr = locale === 'ar';
  const loc = locale as Locale;

  // Transform people for RotatingCards (uses shared Krtk component)
  const rotatingPeople = featuredPeople.map((p) => toKrtkPerson(p, loc));

  // Transform articles for carousel with tagged people
  const carouselArticles = latestArticles.map((a) => ({
    id: a.id,
    slug: a.slugEn,
    title: localized(loc, a.titleEn, a.titleAr),
    excerpt: localized(loc, a.excerptEn, a.excerptAr) || '',
    featuredImageUrl: a.featuredImageUrl,
    publishedAt: a.publishedAt,
    taggedPeople: [
      ...(a.maleId ? [{ id: a.maleId, name: `${a.maleFirstNameEn} ${a.maleLastNameEn}`, imageUrl: a.maleImage }] : []),
      ...(a.femaleId ? [{ id: a.femaleId, name: `${a.femaleFirstNameEn} ${a.femaleLastNameEn}`, imageUrl: a.femaleImage }] : []),
    ],
  }));

  return (
    <>
      {/* Hero Section with Canvas Background */}
      <AnimatedHero locale={locale} />

      {/* Featured Profiles - Rotating Cards */}
      <RotatingCards people={rotatingPeople} locale={locale} />

      {/* Article Carousel - Full Width GSAP ScrollTrigger */}
      <ArticleCarousel articles={carouselArticles} locale={locale} />

      {/* Parallax Quote Section with Cairo Artwork */}
      <QuoteArtworkSection locale={locale} />

      {/* How It Works Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/3 to-transparent" />
        <div className="relative mx-auto max-w-6xl">
          <ScrollReveal direction="up">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-text-primary lg:text-5xl">
                {isAr ? 'كيف تُصنع الأيقونة' : 'How It Works'}
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-text-secondary">
                {isAr
                  ? 'ثلاث خطوات. إرث دائم على أكثر منصة مصرية تنظيماً.'
                  : "Three steps. One permanent legacy on Egypt's most curated platform."}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                en: { title: 'Nominate Yourself', description: 'Tell us who you are, what you’ve built, and the impact you’ve made.' },
                ar: { title: 'رشّح نفسك', description: 'أخبرنا من أنت، وما الذي بنيته، وما الأثر الذي تركته.' },
                icon: Users,
              },
              {
                en: { title: 'Editorial Curation', description: 'Our editors craft your profile into a story worth reading — every detail, deliberate.' },
                ar: { title: 'انتقاء تحريري', description: 'يصيغ فريقنا التحريري ملفك في قصة تستحق القراءة — كل تفصيلة، مقصودة.' },
                icon: Zap,
              },
              {
                en: { title: 'Enter the Directory', description: "You join a permanent, searchable record of Egypt's most exceptional people." },
                ar: { title: 'انضم إلى الدليل', description: 'تنضم إلى سجل دائم وقابل للبحث لأكثر شخصيات مصر استثنائية.' },
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
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subscribe CTA Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5" />
        <div className="relative mx-auto max-w-4xl">
          <ScrollReveal direction="up">
            <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-surface-elevated via-surface to-surface-elevated p-12 text-center">
              <h3 className="mb-4 text-3xl font-bold text-text-primary lg:text-4xl">
                {isAr ? 'لا تفوّت قصة واحدة' : 'Never Miss a Story'}
              </h3>
              <p className="mb-8 text-lg text-text-secondary">
                {isAr
                  ? 'أيقونات جديدة. قصص جديدة. تُسلَّم بالعمق الذي تستحقه.'
                  : 'New icons. New stories. Delivered with the depth they deserve.'}
              </p>
              <Link href={`/${locale}/subscribe`}>
                <Button size="lg" className="gap-2">
                  {isAr ? 'اشترك في النشرة' : 'Join the Inner Circle'}
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
                  {isAr ? 'قصتك تنتمي هنا' : 'Your Story Belongs Here'}
                </h3>
                <p className="text-text-secondary">
                  {isAr
                    ? 'إن كان عملك يتحدث عن نفسه، دعنا نضخّم صوته. أرسل ملفك وخذ مكانك في دليل مصر النهائي.'
                    : `If your work speaks for itself, let us amplify it. Submit your profile and claim your place in Egypt's definitive directory.`}
                </p>
                <Link href={`/${locale}/submit`}>
                  <Button variant="outline" className="mt-6 gap-2">
                    {isAr ? 'أرسل ملفك الآن' : 'Claim Your Spot'}
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>

              <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/10 to-surface p-8">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gold/20">
                  <CheckCircle size={24} className="text-gold" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-text-primary">
                  {isAr ? 'بطاقة KRTK الرقمية' : 'Your KRTK Identity Card'}
                </h3>
                <p className="text-text-secondary">
                  {isAr
                    ? 'رابط واحد. كل ما أنت عليه. KRTK يحوّل ملفك إلى بطاقة هوية رقمية مصممة بدقة.'
                    : 'One link. Everything you are. KRTK turns your profile into a precision-crafted digital identity card.'}
                </p>
                <Link href={`/${locale}/krtk`}>
                  <Button variant="outline" className="mt-6 gap-2">
                    {isAr ? 'احصل على بطاقتك' : 'Get Your Card'}
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
