import FadeIn from '@/components/animations/FadeIn';
import SubmitProfileForm from '@/components/forms/SubmitProfileForm';
import { Upload, CheckCircle } from 'lucide-react';

export default function SubmitPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative border-b border-border/30 bg-gradient-to-b from-surface-elevated via-surface-elevated/50 to-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-40" />

        <div className="relative mx-auto max-w-3xl">
          <FadeIn>
            <div className="mb-6 inline-block rounded-full border border-gold/30 bg-gold/5 px-4 py-2">
              <p className="text-sm font-semibold text-gold">Join Our Community</p>
            </div>
            <h1 className="mb-4 text-5xl font-bold text-text-primary lg:text-6xl">
              Share Your <span className="gradient-text">Story</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              Submit your profile and showcase your achievements, expertise, and remarkable journey to our growing community of innovators and professionals.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Form Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-8">
            {[
              {
                number: '01',
                title: 'Fill Out Form',
                description: 'Share your professional details and achievements',
                icon: Upload,
              },
              {
                number: '02',
                title: 'Our Review',
                description: 'Our team reviews your submission',
                icon: CheckCircle,
              },
              {
                number: '03',
                title: 'Go Live',
                description: 'Your profile is featured on Cairo Live',
                icon: CheckCircle,
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <FadeIn key={index} delay={index * 0.1}>
                  <div className="relative overflow-hidden rounded-xl border border-border/30 bg-gradient-to-br from-surface-elevated/50 to-surface p-6 text-center group hover:border-gold/50 transition-colors duration-300">
                    <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <div className="mb-4 text-4xl font-black text-gold/20">{step.number}</div>
                      <Icon size={32} className="mx-auto mb-3 text-gold" />
                      <h3 className="mb-2 font-semibold text-text-primary">{step.title}</h3>
                      <p className="text-sm text-text-secondary">{step.description}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn delay={0.3}>
            <div className="rounded-xl border border-border/30 bg-gradient-to-br from-surface-elevated/50 to-surface p-8 shadow-lg">
              <SubmitProfileForm />
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
