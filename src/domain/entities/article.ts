import { ArticleStatus } from '../value-objects/articleStatus';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
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
  title: string;
  slug: string;
  content: string;
  excerpt: string;
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
<<<<<<< HEAD
  malePersonId?: string | null;
  femalePersonId?: string | null;
=======
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126

  constructor(data: Article) {
    this.id = data.id;
    this.title = data.title;
    this.slug = data.slug;
    this.content = data.content;
    this.excerpt = data.excerpt;
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

  isPublished(): boolean {
    return this.status === 'published' && !!this.publishedAt;
  }

  isDraft(): boolean {
    return this.status === 'draft';
  }

  isArchived(): boolean {
    return this.status === 'archived';
  }

  calculateReadTime(): number {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
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
    return new ArticleEntity({
      ...this,
      status: 'archived' as ArticleStatus,
      updatedAt: new Date(),
    });
  }

  incrementViewCount(): ArticleEntity {
    return new ArticleEntity({
      ...this,
      viewCount: (this.viewCount || 0) + 1,
<<<<<<< HEAD
      updatedAt: new Date(),
    });
  }

  addTags(newTags: string[]): ArticleEntity {
    const existingTags = this.tags || [];
    const uniqueTags = Array.from(new Set([...existingTags, ...newTags]));
    return new ArticleEntity({
      ...this,
      tags: uniqueTags,
      updatedAt: new Date(),
    });
  }

  removeTags(tagsToRemove: string[]): ArticleEntity {
    const updatedTags = (this.tags || []).filter(tag => !tagsToRemove.includes(tag));
    return new ArticleEntity({
      ...this,
      tags: updatedTags.length > 0 ? updatedTags : null,
=======
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
      updatedAt: new Date(),
    });
  }

  update(data: Partial<Article>): ArticleEntity {
    return new ArticleEntity({
      ...this,
      ...data,
      updatedAt: new Date(),
    });
  }

  getDisplayName(): string {
    return this.title;
  }

  toJSON(): Article {
    return {
      id: this.id,
      title: this.title,
      slug: this.slug,
      content: this.content,
      excerpt: this.excerpt,
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