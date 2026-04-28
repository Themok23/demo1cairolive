import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import { eq } from 'drizzle-orm';
import { DrizzlePersonAchievementRepository } from '@/src/infrastructure/repositories/drizzlePersonAchievementRepository';
import { ListPersonAchievementsUseCase } from '@/src/application/use-cases/person-achievements/listByPerson';
import KrtkPdfDocument from '@/src/lib/pdf/KrtkPdfDocument';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ locale: string; slug: string }> },
) {
  const { locale, slug } = await params;
  const rows = await db.select().from(persons).where(eq(persons.id, slug)).limit(1);
  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const person = rows[0];
  const achievements = await new ListPersonAchievementsUseCase(
    new DrizzlePersonAchievementRepository(),
  ).execute(person.id);

  const base = process.env.NEXTAUTH_URL ?? 'https://cairolive.com';
  const profileUrl = `${base}/${locale}/krtk/${person.id}`;

  const isPremium = person.tier === 'premium';
  const pdfPerson = {
    firstNameEn: person.firstNameEn,
    lastNameEn: person.lastNameEn,
    firstNameAr: person.firstNameAr ?? null,
    lastNameAr: person.lastNameAr ?? null,
    currentTitleEn: person.currentPositionEn ?? null,
    currentEmployerEn: person.currentCompanyEn ?? null,
    bioEn: person.bioEn ?? null,
    profileImageUrl: person.profileImageUrl ?? null,
    isVerified: person.isVerified ?? false,
    tier: person.tier ?? 'free',
    contactEmail: isPremium ? (person.email ?? null) : null,
    contactPhone: isPremium ? (person.phoneNumber ?? null) : null,
    website: isPremium ? (person.websiteUrl ?? null) : null,
    linkedin: isPremium ? (person.linkedinUrl ?? null) : null,
  };

  const buffer = await renderToBuffer(
    <KrtkPdfDocument
      person={pdfPerson}
      achievements={achievements.data ?? []}
      profileUrl={profileUrl}
    />,
  );

  const name = `${person.firstNameEn}-${person.lastNameEn}-KRTK.pdf`.replace(/\s+/g, '-');
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${name}"`,
    },
  });
}
