import { auth } from '@/src/lib/auth';

import { db } from '@/src/infrastructure/db/client';
import { persons } from '@/src/infrastructure/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const person = await db
      .select()
      .from(persons)
      .where(eq(persons.id, params.id));

    if (!person.length) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    return NextResponse.json(person[0]);
  } catch (error) {
    console.error('Error fetching person:', error);
    return NextResponse.json({ error: 'Failed to fetch person' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const updatedPerson = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber || null,
      dateOfBirth: body.dateOfBirth ? body.dateOfBirth : null,
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
      linkedinUrl: body.linkedinUrl || null,
      twitterUrl: body.twitterUrl || null,
      instagramUrl: body.instagramUrl || null,
      websiteUrl: body.websiteUrl || null,
      updatedAt: new Date(),
    };

    await db.update(persons).set(updatedPerson).where(eq(persons.id, params.id));

    return NextResponse.json(updatedPerson);
  } catch (error) {
    console.error('Error updating person:', error);
    return NextResponse.json({ error: 'Failed to update person' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.delete(persons).where(eq(persons.id, params.id));

    return NextResponse.json({ message: 'Person deleted successfully' });
  } catch (error) {
    console.error('Error deleting person:', error);
    return NextResponse.json({ error: 'Failed to delete person' }, { status: 500 });
  }
}
