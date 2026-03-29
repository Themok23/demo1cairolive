import { z } from 'zod';
import { Article, ArticleEntity } from '../../../domain/entities/article';
import { ArticleRepository } from '../../../domain/repositories/articleRepository';
import { PersonRepository } from '../../../domain/repositories/personRepository';

const CreateArticleSchema = z.object({
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(500),
  content: z.string().min(1),
  excerpt: z.string().min(1),
  authorId: z.string().min(1),
  featuredImageUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().max(100).optional(),
});

export type CreateArticleInput = z.infer<typeof CreateArticleSchema>;

export interface CreateArticleResult {
  success: boolean;
  data?: Article;
  error?: string;
}

export class CreateArticleUseCase {
  constructor(
    private articleRepository: ArticleRepository,
    private personRepository: PersonRepository
  ) {}

  async execute(input: CreateArticleInput): Promise<CreateArticleResult> {
    try {
      const validated = CreateArticleSchema.parse(input);

      const author = await this.personRepository.findById(validated.authorId);
      if (!author) {
        return {
          success: false,
          error: 'Author not found',
        };
      }

      const existingArticle = await this.articleRepository.findBySlug(
        validated.slug
      );
      if (existingArticle) {
        return {
          success: false,
          error: 'Article with this slug already exists',
        };
      }

      const readTime = this.calculateReadTime(validated.content);
      const now = new Date();

      const article: Article = {
        id: this.generateId(),
        title: validated.title,
        slug: validated.slug,
        content: validated.content,
        excerpt: validated.excerpt,
        authorId: validated.authorId,
        authorName: `${author.firstName} ${author.lastName}`,
        featuredImageUrl: validated.featuredImageUrl,
        status: 'draft',
        createdAt: now,
        updatedAt: now,
        tags: validated.tags,
        category: validated.category,
        readTimeMinutes: readTime,
        viewCount: 0,
      };

      const created = await this.articleRepository.create(article);
      return {
        success: true,
        data: created,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: `Validation error: ${error.errors[0].message}`,
        };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private generateId(): string {
    return `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
