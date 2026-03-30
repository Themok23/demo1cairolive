import { auth } from '@/src/lib/auth';

import { db } from '@/src/infrastructure/db/client';
import { articles } from '@/src/infrastructure/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allArticles = await db.select().from(articles);
    return NextResponse.json(allArticles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const articleId = crypto.randomUUID();
    const article = {
      id: articleId,
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt,
      authorId: 'admin',
      authorName: 'Admin',
      featuredImageUrl: body.featuredImageUrl || null,
      status: body.status || 'draft',
      publishedAt: body.status === 'published' ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: null,
      category: body.category || null,
      readTimeMinutes: 0,
      viewCount: 0,
      malePersonId: body.malePersonId || null,
      femalePersonId: body.femalePersonId || null,
    };

    await db.insert(articles).values(article);
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
