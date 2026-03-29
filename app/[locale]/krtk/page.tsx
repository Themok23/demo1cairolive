import Link from 'next/link';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren from '@/components/animations/StaggerChildren';
import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import { desc } from 'drizzle-orm';
import { Sparkles, ArrowRight } from 'lucide-react';

interface KrtkPageProps {
  params: {
    locale: string;
  };
}

export default async function KrtkPage({ params }: KrtkPageProps) {
  const allPeople = await db
    .select()
    .from(persons)
    .orderBy(desc(persons.createdAt));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative border-b border-border/30 bg-gradient-to-b from-surface-elevated via-surface-elevated/50 to-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-40" />

        <div className="relative mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2">
              <Sparkles size={16} className="text-gold" />
              <p className="text-sm font-semibold text-gold">KRTK - Know Remarkable Talented Kids</p>
            </div>
            <h1 className="mb-4 text-5xl font-bold text-text-primary lg:text-6xl">
              Micro <span className="gradient-text">Profiles</span>
            </h1>
            <p className="max-w-2xl text-xl text-text-secondary leading-relaxed">
              Celebrate rising talents and emerging voices. KRTK is our digital business card directory featuring the next generation of remarkable Egyptians.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Business Cards Grid */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <StaggerChildren className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {allPeople.map((person) => (
              <div key={person.id} data-stagger>
                <Link href={`/${params.locale}/krtk/${person.id}`}>
                  <div className="group relative h-72 overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-surface-elevated to-surface p-6 transition-all duration-300 hover:border-gold/60 hover:shadow-[0_0_30px_rgba(212,168,83,0.2)] hover:-translate-y-2 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="relative z-10 flex h-full flex-col justify-between">
                      <div className="flex items-start justify-between">
                        {person.profileImageUrl && (
                          <div className="relative h-20 w-20 flex-shrink-0">
                            <img
                              src={person.profileImageUrl}
                              alt={`${person.firstName} ${person.lastName}`}
                              className="h-full w-full rounded-full border-2 border-gold object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        {person.isVerified && (
                          <div className="ml-auto rounded-lg bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold border border-gold/30">
                            VERIFIED
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-text-primary leading-tight group-hover:text-gold transition-colors duration-200">
                            {person.firstName}
                          </h3>
                          <h4 className="text-lg font-bold text-text-primary/70 leading-tight">
                            {person.lastName}
                          </h4>
                        </div>
                        {person.currentPosition && (
                          <p className="text-sm font-semibold text-gold/90 leading-tight">
                            {person.currentPosition}
                          </p>
                        )}
                        {person.currentCompany && (
                          <p className="text-xs text-text-secondary leading-tight truncate">
                            {person.currentCompany}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </StaggerChildren>

          {allPeople.length === 0 && (
            <FadeIn className="text-center py-12">
              <p className="text-lg text-text-secondary mb-6">No profiles yet. Be the first to submit yours!</p>
              <Button variant="primary" size="lg">
                <Link href={`/${params.locale}/submit`} className="flex items-center gap-2">
                  Submit Your Profile
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </FadeIn>
          )}
        </div>
      </section>

      {/* What is KRTK */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="rounded-xl border border-border/30 bg-surface-elevated/30 p-8">
              <h3 className="mb-6 text-2xl font-bold text-text-primary">What is KRTK?</h3>
              <div className="space-y-4">
                <p className="text-text-secondary leading-relaxed">
                  KRTK stands for "Know Remarkable Talented Kids" - our premium digital profile system designed to showcase emerging talents and established professionals. Each profile is a sophisticated micro-card that highlights your achievements, current role, and professional presence.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Think of it as your digital business card on steroids. It is the foundation of Cairo Live, designed to celebrate and connect remarkable Egyptians with opportunities, collaborations, and recognition.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
