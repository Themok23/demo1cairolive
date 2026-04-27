import { auth } from '@/src/lib/auth';

import { db } from '@/src/infrastructure/db/client';
import { persons, articles, submissions, subscribers } from '@/src/infrastructure/db/schema';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [personCount, articleCount, submissionCount, subscriberCount] = await Promise.all([
      db.select({ count: sql<number>`cast(count(*) as integer)` }).from(persons),
      db.select({ count: sql<number>`cast(count(*) as integer)` }).from(articles),
      db.select({ count: sql<number>`cast(count(*) as integer)` }).from(submissions),
      db.select({ count: sql<number>`cast(count(*) as integer)` }).from(subscribers),
    ]);

    const stats = {
      totalPeople: personCount[0]?.count || 0,
      totalArticles: articleCount[0]?.count || 0,
      totalSubmissions: submissionCount[0]?.count || 0,
      totalSubscribers: subscriberCount[0]?.count || 0,
    };

    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
