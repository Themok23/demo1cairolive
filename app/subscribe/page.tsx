import FadeIn from '@/components/animations/FadeIn';
import SubscribeForm from '@/components/forms/SubscribeForm';

export default function SubscribePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border bg-surface-elevated px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <h1 className="mb-3 text-4xl font-bold text-text-primary">
              Stay Connected
            </h1>
            <p className="text-lg text-text-secondary">
              Subscribe to our newsletter and be the first to discover new profiles, articles, and stories.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Form Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <FadeIn delay={0.2}>
            <div className="rounded-lg border border-border bg-surface p-8">
              <SubscribeForm />
            </div>
          </FadeIn>

          {/* Benefits */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Weekly Digest',
                description: 'Get a curated selection of profiles and articles delivered to your inbox.',
              },
              {
                title: 'Early Access',
                description:
                  'Be the first to know about new features, events, and exclusive content.',
              },
              {
                title: 'No Spam',
                description:
                  'We respect your inbox. Unsubscribe anytime with just one click.',
              },
            ].map((benefit, index) => (
              <FadeIn
                key={index}
                delay={0.3 + index * 0.1}
                className="rounded-lg border border-border bg-surface p-6"
              >
                <h3 className="mb-2 font-semibold text-text-primary">
                  {benefit.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {benefit.description}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
