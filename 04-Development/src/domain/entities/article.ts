import { ArticleStatus } from '../value-objects/articleStatus';

export interface Article {
  id: string;
  // Bilingual content
  titleEn: string;
  titleAr?: string | null;
  slugEn: string;
  slugAr?: string | null;
  contentEn: string;
  contentAr?: string | null;
  excerptEn: string;
  excerptAr?: string | null;
  // Language-neutral
  authorId: string;
  authorName: string;
  featuredImageUrl?: string | null;
  status: ArticleStatus;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[] | null;
  category?: string | null;
  readTimeMinutes: number;
  viewCount: number | null;
  malePersonId?: string | null;
  femalePersonId?: string | null;
}

export class ArticleEntity implements Article {
  id: string;
  titleEn: string;
  titleAr?: string | null;
  slugEn: string;
  slugAr?: string | null;
  contentEn: string;
  contentAr?: string | null;
  excerptEn: string;
  excerptAr?: string | null;
  authorId: string;
  authorName: string;
  featuredImageUrl?: string | null;
  status: ArticleStatus;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[] | null;
  category?: string | null;
  readTimeMinutes: number;
  viewCount: number | null;
  malePersonId?: string | null;
  femalePersonId?: string | null;

  constructor(data: Article) {
    this.id = data.id;
    this.titleEn = data.titleEn;
    this.titleAr = data.titleAr;
    this.slugEn = data.slugEn;
    this.slugAr = data.slugAr;
    this.contentEn = data.contentEn;
    this.contentAr = data.contentAr;
    this.excerptEn = data.excerptEn;
    this.excerptAr = data.excerptAr;
    this.authorId = data.authorId;
    this.authorName = data.authorName;
    this.featuredImageUrl = data.featuredImageUrl;
    this.status = data.status;
    this.publishedAt = data.publishedAt;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.tags = data.tags;
    this.category = data.category;
    this.readTimeMinutes = data.readTimeMinutes;
    this.viewCount = data.viewCount;
    this.malePersonId = data.malePersonId;
    this.femalePersonId = data.femalePersonId;
  }

  /** Returns the title for the given locale, falling back to EN */
  getTitle(locale: 'en' | 'ar' = 'en'): string {
    if (locale === 'ar') return this.titleAr || this.titleEn;
    return this.titleEn;
  }

  /** Returns the excerpt for the given locale, falling back to EN */
  getExcerpt(locale: 'en' | 'ar' = 'en'): string {
    if (locale === 'ar') return this.excerptAr || this.excerptEn;
    return this.excerptEn;
  }

  /** Returns the content for the given locale, falling back to EN */
  getContent(locale: 'en' | 'ar' = 'en'): string {
    if (locale === 'ar') return this.contentAr || this.contentEn;
    return this.contentEn;
  }

  isPublished(): boolean { return this.status === 'published' && !!this.publishedAt; }
  isDraft():     boolean { return this.status === 'draft'; }
  isArchived():  boolean { return this.status === 'archived'; }

  calculateReadTime(): number {
    const wordsPerMinute = 200;
    const wordCount = this.contentEn.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  publish(publishDate?: Date): ArticleEntity {
    return new ArticleEntity({
      ...this,
      status: 'published' as ArticleStatus,
      publishedAt: publishDate || new Date(),
      updatedAt: new Date(),
    });
  }

  archive(): ArticleEntity {
    return new ArticleEntity({ ...this, status: 'archived' as ArticleStatus, updatedAt: new Date() });
  }

  incrementViewCount(): ArticleEntity {
    return new ArticleEntity({ ...this, viewCount: (this.viewCount || 0) + 1, updatedAt: new Date() });
  }

  addTags(newTags: string[]): ArticleEntity {
    const existing = this.tags || [];
    return new ArticleEntity({
      ...this,
      tags: Array.from(new Set([...existing, ...newTags])),
      updatedAt: new Date(),
    });
  }

  removeTags(tagsToRemove: string[]): ArticleEntity {
    const updated = (this.tags || []).filter(t => !tagsToRemove.includes(t));
    return new ArticleEntity({
      ...this,
      tags: updated.length > 0 ? updated : null,
      updatedAt: new Date(),
    });
  }

  update(data: Partial<Article>): ArticleEntity {
    return new ArticleEntity({ ...this, ...data, updatedAt: new Date() });
  }

  toJSON(): Article {
    return {
      id: this.id,
      titleEn: this.titleEn,
      titleAr: this.titleAr,
      slugEn: this.slugEn,
      slugAr: this.slugAr,
      contentEn: this.contentEn,
      contentAr: this.contentAr,
      excerptEn: this.excerptEn,
      excerptAr: this.excerptAr,
      authorId: this.authorId,
      authorName: this.authorName,
      featuredImageUrl: this.featuredImageUrl,
      status: this.status,
      publishedAt: this.publishedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      tags: this.tags,
      category: this.category,
      readTimeMinutes: this.readTimeMinutes,
      viewCount: this.viewCount,
      malePersonId: this.malePersonId,
      femalePersonId: this.femalePersonId,
    };
  }
}
