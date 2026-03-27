import FadeIn from '@/components/animations/FadeIn';
import SubmitProfileForm from '@/components/forms/SubmitProfileForm';

export default function SubmitPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border bg-surface-elevated px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <h1 className="mb-3 text-4xl font-bold text-text-primary">
              Submit Your Profile
            </h1>
            <p className="text-lg text-text-secondary">
              Share your story with our community. Our team will review your submission and get back to you shortly.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Form Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <FadeIn delay={0.2}>
            <div className="rounded-lg border border-border bg-surface p-8">
              <SubmitProfileForm />
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
