import { eq, like, and, or, desc, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { articles } from '../db/schema';
import { Article } from '../../domain/entities/article';
import { ArticleRepository } from '../../domain/repositories/articleRepository';

export class DrizzleArticleRepository implements ArticleRepository {
  private parseArticle(data: any): Article {
    return {
      ...data,
      status: data.status as any,
      tags: data.tags ? JSON.parse(data.tags) : undefined,
    };
  }

  async findById(id: string): Promise<Article | null> {
    const result = await db.query.articles.findFirst({
      where: eq(articles.id, id),
    });
    return result ? this.parseArticle(result) : null;
  }

  async findBySlug(slug: string): Promise<Article | null> {
    const result = await db.query.articles.findFirst({
      where: eq(articles.slug, slug),
    });
    return result ? this.parseArticle(result) : null;
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    status?: string;
    category?: string;
  }): Promise<{ data: Article[]; total: number }> {
    const limit = options?.limit || 20;
    const offset = options?.offset || 0;

    let conditions = [];

    if (options?.status) {
      conditions.push(eq(articles.status, options.status));
    }

    if (options?.category) {
      conditions.push(eq(articles.category, options.category));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select()
      .from(articles)
      .where(whereClause)
      .orderBy(desc(articles.publishedAt))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(articles)
      .where(whereClause);

    const total = countResult[0]?.count || 0;

    return { data: data.map(d => this.parseArticle(d)), total };
  }

  async findByAuthor(
    authorId: string,
    options?: {
      limit?: number;
      offset?: number;
    }
  ): Promise<{ data: Article[]; total: number }> {
    const limit = options?.limit || 20;
    const offset = options?.offset || 0;

    const data = await db
      .select()
      .from(articles)
      .where(eq(articles.authorId, authorId))
      .orderBy(desc(articles.createdAt))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(articles)
      .where(eq(articles.authorId, authorId));

    const total = countResult[0]?.count || 0;

    return { data: data.map(d => this.parseArticle(d)), total };
  }

  async create(article: Article): Promise<Article> {
    const [created] = await db
      .insert(articles)
      .values({
        id: article.id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt,
        authorId: article.authorId,
        authorName: article.authorName,
        featuredImageUrl: article.featuredImageUrl,
        status: article.status,
        publishedAt: article.publishedAt,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        tags: article.tags ? JSON.stringify(article.tags) : null,
        category: article.category,
        readTimeMinutes: article.readTimeMinutes,
        viewCount: article.viewCount,
      })
      .returning();

    return created ? this.parseArticle(created) : (null as any);
  }

  async update(id: string, article: Partial<Article>): Promise<Article | null> {
    const [updated] = await db
      .update(articles)
      .set({
        ...article,
        updatedAt: new Date(),
        tags: article.tags ? JSON.stringify(article.tags) : undefined,
      })
      .where(eq(articles.id, id))
      .returning();

    return updated ? this.parseArticle(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return result.rowCount > 0;
  }

  async incrementViewCount(id: string): Promise<boolean> {
    const result = await db
      .update(articles)
      .set({
        viewCount: sql`view_count + 1`,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id));

    return result.rowCount > 0;
  }

  async search(
    query: string,
    options?: {
      limit?: number;
      offset?: number;
    }
  ): Promise<{ data: Article[]; total: number }> {
    const limit = options?.limit || 20;
    const offset = options?.offset || 0;
    const searchTerm = `%${query}%`;

    const data = await db
      .select()
      .from(articles)
      .where(
        and(
          eq(articles.status, 'published'),
          or(
            like(articles.title, searchTerm),
            like(articles.excerpt, searchTerm),
            like(articles.content, searchTerm)
          )
        )
      )
      .orderBy(desc(articles.publishedAt))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(articles)
      .where(
        and(
          eq(articles.status, 'published'),
          or(
            like(articles.title, searchTerm),
            like(articles.excerpt, searchTerm),
            like(articles.content, searchTerm)
          )
        )
      );

    const total = countResult[0]?.count || 0;

    return { data: data.map(d => this.parseArticle(d)), total };
  }
}
