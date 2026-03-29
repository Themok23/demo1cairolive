import FadeIn from '@/components/animations/FadeIn';
import SubscribeForm from '@/components/forms/SubscribeForm';
import StaggerChildren from '@/components/animations/StaggerChildren';
import { Bell, Heart, Shield } from 'lucide-react';

export default function SubscribePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative border-b border-border/30 bg-gradient-to-b from-surface-elevated via-surface-elevated/50 to-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-40" />

        <div className="relative mx-auto max-w-3xl text-center">
          <FadeIn>
            <div className="mb-6 inline-block rounded-full border border-gold/30 bg-gold/5 px-4 py-2">
              <p className="text-sm font-semibold text-gold">Never Miss Out</p>
            </div>
            <h1 className="mb-4 text-5xl font-bold text-text-primary lg:text-6xl">
              Stay <span className="gradient-text">Connected</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-text-secondary leading-relaxed">
              Subscribe to our newsletter and be the first to discover remarkable profiles, inspiring articles, and exclusive opportunities from Cairo Live.
            </p>
          </FadeIn>
        </div>
      </section>

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
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
