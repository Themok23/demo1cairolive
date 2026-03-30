import FadeIn from '@/components/animations/FadeIn';
import SubscribeForm from '@/components/forms/SubscribeForm';
import StaggerChildren from '@/components/animations/StaggerChildren';
import { Bell, Heart, Shield } from 'lucide-react';

<<<<<<< HEAD
interface SubscribePageProps {
  params: {
    locale: string;
  };
}

export default async function SubscribePage({ params }: SubscribePageProps) {
  const { locale } = await params;
  const isAr = locale === 'ar';

=======
export default function SubscribePage() {
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative border-b border-border/30 bg-gradient-to-b from-surface-elevated via-surface-elevated/50 to-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-40" />

        <div className="relative mx-auto max-w-3xl text-center">
          <FadeIn>
            <div className="mb-6 inline-block rounded-full border border-gold/30 bg-gold/5 px-4 py-2">
<<<<<<< HEAD
              <p className="text-sm font-semibold text-gold">
                {isAr ? 'لا تفوّت' : 'Never Miss Out'}
              </p>
            </div>
            <h1 className="mb-4 text-5xl font-bold text-text-primary lg:text-6xl">
              {isAr ? 'ابق' : 'Stay'} <span className="gradient-text">{isAr ? 'متصلاً' : 'Connected'}</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              {isAr
                ? 'اشترك في نشرتنا الإخبارية لتلقي أحدث القصص والرؤى والميزات مباشرة في بريدك الإلكتروني'
                : 'Subscribe to our newsletter and get the latest stories, insights, and features delivered straight to your inbox'}
=======
              <p className="text-sm font-semibold text-gold">Never Miss Out</p>
            </div>
            <h1 className="mb-4 text-5xl font-bold text-text-primary lg:text-6xl">
              Stay <span className="gradient-text">Connected</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-text-secondary leading-relaxed">
              Subscribe to our newsletter and be the first to discover remarkable profiles, inspiring articles, and exclusive opportunities from Cairo Live.
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
            </p>
          </FadeIn>
        </div>
      </section>

<<<<<<< HEAD
      {/* Benefits Section */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/3 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl">
          <StaggerChildren className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                en: { title: 'Inspiring Stories', description: 'Read about remarkable Egyptians and their journeys' },
                ar: { title: 'قصص ملهمة', description: 'اقرأ عن المصريين الاستثنائيين ورحلاتهم' },
                icon: Bell,
              },
              {
                en: { title: 'Exclusive Updates', description: 'Be the first to know about new profiles and articles' },
                ar: { title: 'تحديثات حصرية', description: 'كن أول من يعرف عن الملفات والمقالات الجديدة' },
                icon: Heart,
              },
              {
                en: { title: 'Community Access', description: 'Connect with a community that celebrates excellence' },
                ar: { title: 'وصول المجتمع', description: 'تواصل مع مجتمع يحتفي بالتميز' },
                icon: Shield,
              },
            ].map((benefit, index) => {
              const IconComponent = benefit.icon;
              const content = isAr ? benefit.ar : benefit.en;
              return (
                <div key={index} data-stagger>
                  <div className="rounded-xl border border-border/50 bg-gradient-to-br from-surface-elevated to-surface p-6 text-center">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 border border-gold/30">
                      <IconComponent size={24} className="text-gold" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-text-primary">{content.title}</h3>
                    <p className="text-sm text-text-secondary">{content.description}</p>
                  </div>
                </div>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Form Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <FadeIn>
            <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-surface-elevated via-surface to-surface-elevated p-8">
              <SubscribeForm locale={locale} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8 border-t border-border/30">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <p className="mb-4 text-text-secondary">
              {isAr
                ? 'انضم إلى آلاف القراء الذين يستمتعون بقصصنا الملهمة'
                : 'Join thousands of readers enjoying our inspiring stories'}
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-gold/50 to-gold/30 flex items-center justify-center text-xs font-bold text-text-primary"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <span className="text-sm text-text-secondary">
                {isAr ? '5000+ مشترك' : '5000+ subscribers'}
              </span>
=======
      {/* Form Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <FadeIn delay={0.2}>
            <div className="rounded-2xl border border-border/30 bg-gradient-to-br from-surface-elevated/50 to-surface p-8 shadow-lg sm:p-12">
              <h2 className="mb-2 text-2xl font-bold text-text-primary text-center">
                Join Our Community
              </h2>
              <p className="mb-8 text-center text-text-secondary">
                Get exclusive updates delivered to your inbox
              </p>
              <SubscribeForm />
            </div>
          </FadeIn>

          {/* Benefits */}
          <StaggerChildren className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Weekly Digest',
                description: 'Curated selection of remarkable profiles and inspiring stories delivered to your inbox.',
                icon: Bell,
              },
              {
                title: 'Early Access',
                description:
                  'Be the first to know about new features, articles, and exclusive opportunities.',
                icon: Heart,
              },
              {
                title: 'Privacy Guaranteed',
                description:
                  'We respect your privacy. Unsubscribe anytime with just one click, no questions asked.',
                icon: Shield,
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} data-stagger>
                  <FadeIn
                    delay={index * 0.1}
                    className="group relative overflow-hidden rounded-xl border border-border/30 bg-gradient-to-br from-surface-elevated/50 to-surface p-6 transition-all duration-300 hover:border-gold/50 hover:shadow-[0_0_30px_rgba(212,168,83,0.15)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 border border-gold/30">
                        <Icon size={24} className="text-gold" />
                      </div>
                      <h3 className="mb-2 font-semibold text-text-primary">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </FadeIn>
                </div>
              );
            })}
          </StaggerChildren>

          {/* FAQ Section */}
          <FadeIn delay={0.4} className="mt-16 rounded-xl border border-border/30 bg-surface-elevated/30 p-8">
            <h3 className="mb-8 text-2xl font-bold text-text-primary text-center">Frequently Asked Questions</h3>
            <div className="space-y-6">
              {[
                {
                  question: 'How often will I receive emails?',
                  answer: 'We send a curated weekly digest of new profiles and articles. No spam, just valuable content.',
                },
                {
                  question: 'Can I unsubscribe anytime?',
                  answer: 'Yes, absolutely. Each email has an unsubscribe link. You can stop receiving emails with one click.',
                },
                {
                  question: 'Will you share my data?',
                  answer: 'Never. Your data is private and secure. We follow strict privacy policies and GDPR compliance.',
                },
                {
                  question: 'What if I want more than the weekly digest?',
                  answer: 'You can follow our social media channels for daily updates and community announcements.',
                },
              ].map((item, index) => (
                <div key={index} className="border-b border-border/20 pb-6 last:border-0">
                  <h4 className="mb-2 font-semibold text-text-primary">{item.question}</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.answer}</p>
                </div>
              ))}
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
