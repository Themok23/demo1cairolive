import { z } from 'zod';
import { Article } from '../../../domain/entities/article';
import { ArticleRepository } from '../../../domain/repositories/articleRepository';

const PublishArticleSchema = z.object({
  id: z.string().min(1),
});

export type PublishArticleInput = z.infer<typeof PublishArticleSchema>;

export interface PublishArticleResult {
  success: boolean;
  data?: Article;
  error?: string;
}

export class PublishArticleUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(input: PublishArticleInput): Promise<PublishArticleResult> {
    try {
      const validated = PublishArticleSchema.parse(input);

      const article = await this.articleRepository.findById(validated.id);

      if (!article) {
        return {
          success: false,
          error: 'Article not found',
        };
      }

      if (article.status === 'published') {
        return {
          success: false,
          error: 'Article is already published',
        };
      }

      const updated = await this.articleRepository.update(validated.id, {
        status: 'published',
        publishedAt: new Date(),
      });

      if (!updated) {
        return {
          success: false,
          error: 'Failed to publish article',
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
}
