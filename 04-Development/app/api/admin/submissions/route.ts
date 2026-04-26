import { auth } from '@/src/lib/auth';

import { db } from '@/src/infrastructure/db/client';
import { submissions } from '@/src/infrastructure/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allSubmissions = await db.select().from(submissions);
    return NextResponse.json(allSubmissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
