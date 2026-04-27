import { auth } from '@/src/lib/auth';
import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const optionalUrl       = z.string().transform(v => v === '' ? null : v).pipe(z.string().url().nullable());
const optionalImagePath = z.string().transform(v => v === '' ? null : v).pipe(z.string().nullable());
const optionalText      = z.string().transform(v => v === '' ? null : v).pipe(z.string().nullable());

const updatePersonSchema = z.object({
  firstNameEn: z.string().min(1).max(255),
  firstNameAr: optionalText.optional(),
  lastNameEn:  z.string().min(1).max(255),
  lastNameAr:  optionalText.optional(),
  bioEn:              optionalText.optional(),
  bioAr:              optionalText.optional(),
  currentPositionEn:  optionalText.optional(),
  currentPositionAr:  optionalText.optional(),
  currentCompanyEn:   optionalText.optional(),
  currentCompanyAr:   optionalText.optional(),
  locationEn:         optionalText.optional(),
  locationAr:         optionalText.optional(),
  email:       z.string().email().max(255),
  phoneNumber: z.string().max(50).optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender:      z.enum(['male', 'female', 'prefer-not-to-say']).default('prefer-not-to-say'),
  profileImageUrl: optionalImagePath.optional(),
  coverImageUrl:   optionalImagePath.optional(),
  tier:       z.enum(['bronze', 'silver', 'gold', 'platinum']).default('bronze'),
  isVerified: z.boolean().default(false),
  isClaimed:  z.boolean().default(false),
  linkedinUrl:  optionalUrl.optional(),
  twitterUrl:   optionalUrl.optional(),
  instagramUrl: optionalUrl.optional(),
  websiteUrl:   optionalUrl.optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const person = await db.select().from(persons).where(eq(persons.id, id));
    if (!person.length) return NextResponse.json({ error: 'Person not found' }, { status: 404 });

    const found = person[0];
    if (!found) return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    return NextResponse.json(found);
  } catch {

    return NextResponse.json({ error: 'Failed to fetch person' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rawBody = await request.json();
    const validation = updatePersonSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation failed', details: validation.error.flatten() }, { status: 422 });
    }

    const body = validation.data;
    const updatedPerson = {
      firstNameEn: body.firstNameEn,
      firstNameAr: body.firstNameAr ?? null,
      lastNameEn:  body.lastNameEn,
      lastNameAr:  body.lastNameAr ?? null,
      bioEn:             body.bioEn ?? null,
      bioAr:             body.bioAr ?? null,
      currentPositionEn: body.currentPositionEn ?? null,
      currentPositionAr: body.currentPositionAr ?? null,
      currentCompanyEn:  body.currentCompanyEn ?? null,
      currentCompanyAr:  body.currentCompanyAr ?? null,
      locationEn:        body.locationEn ?? null,
      locationAr:        body.locationAr ?? null,
      email:           body.email,
      phoneNumber:     body.phoneNumber ?? null,
      dateOfBirth:     body.dateOfBirth || null,
      gender:          body.gender || 'prefer-not-to-say',
      profileImageUrl: body.profileImageUrl ?? null,
      coverImageUrl:   body.coverImageUrl ?? null,
      tier:       body.tier || 'bronze',
      isVerified: body.isVerified || false,
      isClaimed:  body.isClaimed || false,
      linkedinUrl:  body.linkedinUrl ?? null,
      twitterUrl:   body.twitterUrl ?? null,
      instagramUrl: body.instagramUrl ?? null,
      websiteUrl:   body.websiteUrl ?? null,
      updatedAt: new Date(),
    };

    await db.update(persons).set(updatedPerson).where(eq(persons.id, id));
    return NextResponse.json(updatedPerson);
  } catch {

    return NextResponse.json({ error: 'Failed to update person' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await db.delete(persons).where(eq(persons.id, id));
    return NextResponse.json({ message: 'Person deleted successfully' });
  } catch {

    return NextResponse.json({ error: 'Failed to delete person' }, { status: 500 });
  }
}
