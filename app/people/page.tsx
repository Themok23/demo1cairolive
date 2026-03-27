import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';

export default function PeoplePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border bg-surface-elevated px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <h1 className="mb-3 text-4xl font-bold text-text-primary">
              Browse Profiles
            </h1>
            <p className="max-w-2xl text-lg text-text-secondary">
              Discover remarkable individuals from Cairo and beyond. Filter by expertise, tier, and more.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="text-center py-12">
            <CardContent>
              <div className="mb-4 text-6xl">🏗️</div>
              <h2 className="mb-2 text-2xl font-semibold text-text-primary">
                Coming Soon
              </h2>
              <p className="mb-6 text-text-secondary">
                We're building the people directory. In the meantime, you can submit your profile or subscribe for updates.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button variant="primary">
                  <Link href="/submit">Submit Your Profile</Link>
                </Button>
                <Button variant="outline">
                  <Link href="/subscribe">Get Updates</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
