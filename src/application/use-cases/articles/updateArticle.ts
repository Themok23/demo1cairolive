import { z } from 'zod';
import { Article } from '../../../domain/entities/article';
import { ArticleRepository } from '../../../domain/repositories/articleRepository';

const UpdateArticleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(500).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().min(1).optional(),
  featuredImageUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().max(100).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

export type UpdateArticleInput = z.infer<typeof UpdateArticleSchema>;

export interface UpdateArticleResult {
  success: boolean;
  data?: Article;
  error?: string;
}

export class UpdateArticleUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(input: UpdateArticleInput): Promise<UpdateArticleResult> {
    try {
      const validated = UpdateArticleSchema.parse(input);

      const existing = await this.articleRepository.findById(validated.id);
      if (!existing) {
        return {
          success: false,
          error: 'Article not found',
        };
      }

      const updateData: Partial<Article> = {
        title: validated.title,
        content: validated.content,
        excerpt: validated.excerpt,
        featuredImageUrl: validated.featuredImageUrl,
        tags: validated.tags,
        category: validated.category,
        status: validated.status as any,
      };

      if (validated.content) {
        const readTime = this.calculateReadTime(validated.content);
        updateData.readTimeMinutes = readTime;
      }

      if (validated.status === 'published' && existing.status !== 'published') {
        updateData.publishedAt = new Date();
      }

      const objectEntries = Object.entries(updateData);
      const cleanedData = Object.fromEntries(
        objectEntries.filter(([, value]) => value !== undefined)
      );

      const updated = await this.articleRepository.update(
        validated.id,
        cleanedData
      );

      if (!updated) {
        return {
          success: false,
          error: 'Failed to update article',
        };
      }

      return {
        success: true,
        data: updated,
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
}
