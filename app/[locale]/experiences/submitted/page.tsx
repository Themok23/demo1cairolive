import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function SubmittedPage({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === 'ar';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle size={56} className="text-gold mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          {isAr ? 'شكراً لمشاركتك!' : 'Thank you for sharing!'}
        </h1>
        <p className="text-text-secondary mb-6">
          {isAr
            ? 'تم استلام تجربتك وستتم مراجعتها خلال 24-48 ساعة قبل النشر.'
            : 'Your experience has been received and will be reviewed within 24-48 hours before publishing.'}
        </p>
        <Link
          href={`/${locale}/experiences` as any}
          className="inline-flex px-6 py-2.5 rounded-xl bg-gold text-background font-semibold hover:bg-gold/90 transition-colors"
        >
          {isAr ? 'تصفح التجارب' : 'Browse Experiences'}
        </Link>
      </div>
    </div>
  );
}
