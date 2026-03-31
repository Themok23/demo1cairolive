import { auth } from '@/src/lib/auth';
import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import { desc, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const optionalUrl       = z.string().transform(v => v === '' ? null : v).pipe(z.string().url().nullable());
const optionalImagePath = z.string().transform(v => v === '' ? null : v).pipe(z.string().nullable());
const optionalText      = z.string().transform(v => v === '' ? null : v).pipe(z.string().nullable());

const adminPersonSchema = z.object({
  // Bilingual name + content
  firstNameEn: z.string().min(1, 'English first name is required').max(255),
  firstNameAr: optionalText.optional(),
  lastNameEn:  z.string().min(1, 'English last name is required').max(255),
  lastNameAr:  optionalText.optional(),
  bioEn:              optionalText.optional(),
  bioAr:              optionalText.optional(),
  currentPositionEn:  optionalText.optional(),
  currentPositionAr:  optionalText.optional(),
  currentCompanyEn:   optionalText.optional(),
  currentCompanyAr:   optionalText.optional(),
  locationEn:         optionalText.optional(),
  locationAr:         optionalText.optional(),
  // Language-neutral
  email:       z.string().email('Invalid email address'),
  phoneNumber: z.string().max(20).optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender:      z.enum(['male', 'female', 'prefer-not-to-say']).optional(),
  profileImageUrl: optionalImagePath.optional(),
  coverImageUrl:   optionalImagePath.optional(),
  tier:       z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),
  isVerified: z.boolean().optional(),
  isClaimed:  z.boolean().optional(),
  linkedinUrl:  optionalUrl.optional(),
  twitterUrl:   optionalUrl.optional(),
  instagramUrl: optionalUrl.optional(),
  websiteUrl:   optionalUrl.optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = request.nextUrl.searchParams;
    const limit  = Math.min(parseInt(searchParams.get('limit')  || '100', 10), 500);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const allPersons = await db.select().from(persons).orderBy(desc(persons.createdAt)).limit(limit).offset(offset);
    return NextResponse.json(allPersons);
  } catch (error) {
    console.error('Error fetching people:', error);
    return NextResponse.json({ error: 'Failed to fetch people' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rawBody = await request.json();
    const validation = adminPersonSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors.map((e) => e.message).join(', ') },
        { status: 422 }
      );
    }
    const body = validation.data;

    const existing = await db.select({ id: persons.id }).from(persons).where(eq(persons.email, body.email)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: `Email "${body.email}" is already registered` }, { status: 409 });
    }

    const personId = crypto.randomUUID();
    const person = {
      id: personId,
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
      phoneNumber:     body.phoneNumber || null,
      dateOfBirth:     body.dateOfBirth || null,
      gender:          body.gender || 'prefer-not-to-say',
      profileImageUrl: body.profileImageUrl ?? null,
      coverImageUrl:   body.coverImageUrl ?? null,
      tier:       body.tier || 'bronze',
      isVerified: body.isVerified || false,
      isClaimed:  body.isClaimed || false,
      claimedBy:  null,
      keywords:   null,
      linkedinUrl:  body.linkedinUrl ?? null,
      twitterUrl:   body.twitterUrl ?? null,
      instagramUrl: body.instagramUrl ?? null,
      websiteUrl:   body.websiteUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(persons).values(person);
    return NextResponse.json(person, { status: 201 });
  } catch (error) {
    console.error('Error creating person:', error);
    return NextResponse.json({ error: 'Failed to create person' }, { status: 500 });
  }
}
