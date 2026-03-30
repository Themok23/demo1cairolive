import FadeIn from '@/components/animations/FadeIn';
import SubmitProfileForm from '@/components/forms/SubmitProfileForm';
import { Upload, CheckCircle } from 'lucide-react';
import StaggerChildren from '@/components/animations/StaggerChildren';

interface SubmitPageProps {
  params: {
    locale: string;
  };
}

export default async function SubmitPage({ params }: SubmitPageProps) {
  const { locale } = await params;
  const isAr = locale === 'ar';

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative border-b border-border/30 bg-gradient-to-b from-surface-elevated via-surface-elevated/50 to-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-40" />

        <div className="relative mx-auto max-w-3xl">
          <FadeIn>
            <div className="mb-6 inline-block rounded-full border border-gold/30 bg-gold/5 px-4 py-2">
              <p className="text-sm font-semibold text-gold">
                {isAr ? 'انضم إلى مجتمعنا' : 'Join Our Community'}
              </p>
            </div>
            <h1 className="mb-4 text-5xl font-bold text-text-primary lg:text-6xl">
              {isAr ? 'شارك' : 'Share Your'} <span className="gradient-text">{isAr ? 'قصتك' : 'Story'}</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              {isAr
                ? 'أرسل ملفك الشخصي والتحق بالمجتمع المتنامي من الأفراد الاستثنائيين'
                : 'Submit your profile and join our growing community of remarkable individuals'}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/3 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl">
          <StaggerChildren className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                en: { title: 'Professional Showcase', description: 'Display your achievements and expertise' },
                ar: { title: 'عرض احترافي', description: 'اعرض إنجازاتك وخبرتك' },
                icon: Upload,
              },
              {
                en: { title: 'Verified Profile', description: 'Join verified community members' },
                ar: { title: 'ملف موثق', description: 'انضم إلى الأعضاء الموثقين' },
                icon: CheckCircle,
              },
              {
                en: { title: 'Get Featured', description: 'Featured in articles and campaigns' },
                ar: { title: 'اظهر ملفك', description: 'ظهور في المقالات والحملات' },
                icon: CheckCircle,
              },
            ].map((benefit, index) => {
              const IconComponent = benefit.icon;
              const content = isAr ? benefit.ar : benefit.en;
              return (
                <div key={index} data-stagger>
                  <div className="rounded-lg border border-border/50 bg-gradient-to-br from-surface-elevated to-surface p-6 text-center">
                    <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 border border-gold/30">
                      <IconComponent size={24} className="text-gold" />
                    </div>
                    <h3 className="mb-2 font-bold text-text-primary">{content.title}</h3>
                    <p className="text-sm text-text-secondary">{content.description}</p>
                  </div>
                </div>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* Form Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <SubmitProfileForm />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}