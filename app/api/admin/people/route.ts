import { auth } from '@/src/lib/auth';
import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allPersons = await db.select().from(persons);
    return NextResponse.json(allPersons);
  } catch (error) {
    console.error('Error fetching people:', error);
    return NextResponse.json({ error: 'Failed to fetch people' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const personId = crypto.randomUUID();
    const person = {
      id: personId,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber || null,
      dateOfBirth: body.dateOfBirth || null,
      gender: body.gender || 'prefer-not-to-say',
      bio: body.bio || null,
      profileImageUrl: body.profileImageUrl || null,
      coverImageUrl: body.coverImageUrl || null,
      currentPosition: body.currentPosition || null,
      currentCompany: body.currentCompany || null,
      location: body.location || null,
      tier: body.tier || 'bronze',
      isVerified: body.isVerified || false,
      isClaimed: body.isClaimed || false,
      claimedBy: null,
      keywords: null,
      linkedinUrl: body.linkedinUrl || null,
      twitterUrl: body.twitterUrl || null,
      instagramUrl: body.instagramUrl || null,
      websiteUrl: body.websiteUrl || null,
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
