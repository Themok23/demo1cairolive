import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';

export default function ArticlesPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border bg-surface-elevated px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <h1 className="mb-3 text-4xl font-bold text-text-primary">
              Latest Articles
            </h1>
            <p className="max-w-2xl text-lg text-text-secondary">
              Read inspiring stories, insights, and features about remarkable people and their journeys.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="text-center py-12">
            <CardContent>
              <div className="mb-4 text-6xl">📰</div>
              <h2 className="mb-2 text-2xl font-semibold text-text-primary">
                Coming Soon
              </h2>
              <p className="mb-6 text-text-secondary">
                Our article platform is launching soon. Subscribe to be notified when we publish the first feature stories.
              </p>
              <Button variant="primary">
                <Link href="/subscribe">Subscribe for Updates</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
