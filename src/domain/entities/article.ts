import { ArticleStatus } from '../value-objects/articleStatus';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  featuredImageUrl?: string;
  status: ArticleStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  category?: string;
  readTimeMinutes: number;
  viewCount: number;
}

export class ArticleEntity implements Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  featuredImageUrl?: string;
  status: ArticleStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  category?: string;
  readTimeMinutes: number;
  viewCount: number;

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
  }

  isPublished(): boolean {
    return this.status === 'published' && !!this.publishedAt;
  }

  isDraft(): boolean {
    return this.status === 'draft';
  }

  calculateReadTime(): number {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  publish(): ArticleEntity {
    return new ArticleEntity({
      ...this,
      status: 'published',
      publishedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  incrementViewCount(): ArticleEntity {
    return new ArticleEntity({
      ...this,
      viewCount: this.viewCount + 1,
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
}
