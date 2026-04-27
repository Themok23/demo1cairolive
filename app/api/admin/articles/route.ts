import { auth } from '@/src/lib/auth';
import { db } from '@/src/infrastructure/db/client';
import { articles } from '@/src/infrastructure/db/schema';
import { desc, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const optionalImagePath = z.string().transform(v => v === '' ? null : v).pipe(z.string().nullable());
const optionalText      = z.string().transform(v => v === '' ? null : v).pipe(z.string().nullable());

const createArticleSchema = z.object({
  // Bilingual content
  titleEn:   z.string().min(1, 'English title is required').max(500),
  titleAr:   optionalText.optional(),
  slugEn:    z.string().min(1, 'Slug is required').max(500)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers and hyphens only'),
  contentEn: z.string().min(1, 'English content is required'),
  contentAr: optionalText.optional(),
  excerptEn: z.string().min(1, 'English excerpt is required').max(1000),
  excerptAr: optionalText.optional(),
  // Language-neutral
  category:        z.string().max(100).optional().nullable(),
  featuredImageUrl: optionalImagePath.optional(),
  status:          z.enum(['draft', 'published']).default('draft'),
  // Article type — Path 1 from D1CL plan
  articleType:     z.enum(['people', 'place', 'entity']).default('people'),
  placeId:         z.string().uuid().optional().nullable(),
  malePersonId:    z.string().uuid().optional().nullable(),
  femalePersonId:  z.string().uuid().optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = request.nextUrl.searchParams;
    const limit  = Math.min(parseInt(searchParams.get('limit')  || '100', 10), 500);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const allArticles = await db.select().from(articles).orderBy(desc(articles.createdAt)).limit(limit).offset(offset);
    return NextResponse.json(allArticles);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rawBody = await request.json();
    const validation = createArticleSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors.map((e) => e.message).join(', ') },
        { status: 422 }
      );
    }
    const body = validation.data;

    const existing = await db.select({ id: articles.id }).from(articles).where(eq(articles.slugEn, body.slugEn)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: `Slug "${body.slugEn}" is already in use` }, { status: 409 });
    }

    const articleId = crypto.randomUUID();
    const article = {
      id: articleId,
      titleEn:   body.titleEn,
      titleAr:   body.titleAr ?? null,
      slugEn:    body.slugEn,
      slugAr:    null,
      contentEn: body.contentEn,
      contentAr: body.contentAr ?? null,
      excerptEn: body.excerptEn,
      excerptAr: body.excerptAr ?? null,
      authorId:   session.user?.id || 'admin',
      authorName: session.user?.name || session.user?.email || 'Admin',
      featuredImageUrl: body.featuredImageUrl ?? null,
      status:      body.status || 'draft',
      publishedAt: body.status === 'published' ? new Date() : null,
      createdAt:   new Date(),
      updatedAt:   new Date(),
      tags:            null,
      category:        body.category || null,
      readTimeMinutes: 0,
      viewCount:       0,
      articleType:    body.articleType ?? 'people',
      placeId:        body.articleType === 'place' ? (body.placeId || null) : null,
      malePersonId:   body.articleType === 'people' ? (body.malePersonId || null)   : null,
      femalePersonId: body.articleType === 'people' ? (body.femalePersonId || null) : null,
    };

    await db.insert(articles).values(article);
    return NextResponse.json(article, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
