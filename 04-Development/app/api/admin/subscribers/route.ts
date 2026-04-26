import { auth } from '@/src/lib/auth';

import { db } from '@/src/infrastructure/db/client';
import { subscribers } from '@/src/infrastructure/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allSubscribers = await db.select().from(subscribers);
    return NextResponse.json(allSubscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}
