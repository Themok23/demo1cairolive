import { auth } from '@/src/lib/auth';
import { db } from '@/src/infrastructure/db/client';
import { articles } from '@/src/infrastructure/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const optionalImagePath = z.string().transform(v => v === '' ? null : v).pipe(z.string().nullable());
const optionalText      = z.string().transform(v => v === '' ? null : v).pipe(z.string().nullable());
const optionalPersonId  = z.string().transform(v => v === '' ? null : v).pipe(z.string().uuid().nullable());

const updateArticleSchema = z.object({
  titleEn:   z.string().min(1).max(500),
  titleAr:   optionalText.optional(),
  slugEn:    z.string().min(1).max(500).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  contentEn: z.string().min(1),
  contentAr: optionalText.optional(),
  excerptEn: z.string().min(1).max(1000),
  excerptAr: optionalText.optional(),
  category:        z.string().max(100).optional().nullable(),
  featuredImageUrl: optionalImagePath.optional(),
  status:          z.enum(['draft', 'published']).default('draft'),
  malePersonId:    optionalPersonId.optional(),
  femalePersonId:  optionalPersonId.optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const article = await db.select().from(articles).where(eq(articles.id, id));
    if (!article.length) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

    return NextResponse.json(article[0]);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rawBody = await request.json();
    const validation = updateArticleSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation failed', details: validation.error.flatten() }, { status: 422 });
    }

    const body = validation.data;
    const updatedArticle = {
      titleEn:   body.titleEn,
      titleAr:   body.titleAr ?? null,
      slugEn:    body.slugEn,
      contentEn: body.contentEn,
      contentAr: body.contentAr ?? null,
      excerptEn: body.excerptEn,
      excerptAr: body.excerptAr ?? null,
      status:      body.status || 'draft',
      publishedAt: body.status === 'published' ? new Date() : null,
      category:        body.category ?? null,
      featuredImageUrl: body.featuredImageUrl ?? null,
      malePersonId:   body.malePersonId ?? null,
      femalePersonId: body.femalePersonId ?? null,
      updatedAt: new Date(),
    };

    await db.update(articles).set(updatedArticle).where(eq(articles.id, id));
    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await db.delete(articles).where(eq(articles.id, id));
    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
