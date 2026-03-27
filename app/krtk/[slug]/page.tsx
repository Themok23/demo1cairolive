import Link from 'next/link';
import Button from '@/components/ui/Button';

interface KrtkPageProps {
  params: {
    slug: string;
  };
}

export default function KrtkProfilePage({ params }: KrtkPageProps) {
  return (
    <div className="min-h-screen">
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <Link href="/krtk">
              <Button variant="ghost" size="sm">
                ← Back to KRTK
              </Button>
            </Link>
          </div>

          <div className="rounded-lg border border-border bg-surface p-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-text-primary">
              Profile Not Found
            </h1>
            <p className="mb-6 text-text-secondary">
              The profile "{params.slug}" could not be found. This feature is coming soon.
            </p>
            <Link href="/krtk">
              <Button variant="primary">Browse All Profiles</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
