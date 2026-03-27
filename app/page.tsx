import Link from 'next/link';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-elevated to-surface px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <FadeIn className="text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-text-primary sm:text-6xl lg:text-7xl">
              Celebrate Extraordinary
              <span className="block text-gold">Egyptians</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-text-secondary">
              Discover inspiring profiles and stories of remarkable people from Cairo and beyond. Join a community celebrating excellence, innovation, and achievement.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button variant="primary" size="lg">
                <Link href="/people">Browse Profiles</Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href="/articles">Read Articles</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-4xl font-bold text-text-primary">
            What You'll Find Here
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: 'Inspiring Profiles',
                description:
                  'Explore detailed profiles of exceptional individuals, from entrepreneurs to creatives to thought leaders.',
                icon: '👤',
              },
              {
                title: 'Feature Articles',
                description:
                  'Read in-depth stories and insights that celebrate achievements, innovations, and personal journeys.',
                icon: '📝',
              },
              {
                title: 'Community Connection',
                description:
                  'Join our growing community of Cairo-focused professionals and enthusiasts from around the world.',
                icon: '🌍',
              },
            ].map((feature, index) => (
              <FadeIn
                key={index}
                delay={index * 0.2}
                className="rounded-lg border border-border bg-surface p-6 transition-all hover:border-gold hover:shadow-lg"
              >
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold text-text-primary">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">{feature.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-surface-elevated to-surface-elevated/50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-text-primary">
            Know Someone Extraordinary?
          </h2>
          <p className="mb-8 text-lg text-text-secondary">
            Help us celebrate more remarkable people. Submit a profile or nominate someone you know.
          </p>
          <Button variant="primary" size="lg">
            <Link href="/submit">Submit a Profile</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
