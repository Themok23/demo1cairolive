import SubmitForm from '@/components/experiences/SubmitForm';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function SubmitExperiencePage({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === 'ar';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            {isAr ? 'شارك تجربتك' : 'Share Your Experience'}
          </h1>
          <p className="text-text-secondary mt-2">
            {isAr
              ? 'كل تجربة في مصر تستحق أن تُحكى. اكتب عن زيارتك، رحلتك، الكتاب الذي قرأته، أو الفعالية التي حضرتها.'
              : 'Every experience in Egypt deserves to be told. Write about your visit, trip, book review, or event.'}
          </p>
          <p className="text-xs text-text-tertiary mt-3 p-3 rounded-lg border border-gold/10 bg-surface">
            {isAr
              ? 'سيتم مراجعة تجربتك من فريقنا قبل النشر. قد يستغرق ذلك 24-48 ساعة.'
              : 'Your experience will be reviewed by our team before publishing. This may take 24-48 hours.'}
          </p>
        </div>
        <SubmitForm locale={isAr ? 'ar' : 'en'} />
      </div>
    </div>
  );
}
