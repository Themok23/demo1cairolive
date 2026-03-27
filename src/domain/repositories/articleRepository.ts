import { Article } from '../entities/article';

export interface ArticleRepository {
  findById(id: string): Promise<Article | null>;
  findBySlug(slug: string): Promise<Article | null>;
  findAll(options?: {
    limit?: number;
    offset?: number;
    status?: string;
    category?: string;
  }): Promise<{ data: Article[]; total: number }>;
  findByAuthor(authorId: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<{ data: Article[]; total: number }>;
  create(article: Article): Promise<Article>;
  update(id: string, article: Partial<Article>): Promise<Article | null>;
  delete(id: string): Promise<boolean>;
  incrementViewCount(id: string): Promise<boolean>;
  search(query: string, options?: {
    limit?: number;
    offset?: number;
  }): Promise<{ data: Article[]; total: number }>;
}
