import { z } from 'zod';
import { Article } from '../../../domain/entities/article';
import { ArticleRepository } from '../../../domain/repositories/articleRepository';

const GetArticleSchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
});

export type GetArticleInput = z.infer<typeof GetArticleSchema>;

export interface GetArticleResult {
  success: boolean;
  data?: Article;
  error?: string;
}

export class GetArticleUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(input: GetArticleInput): Promise<GetArticleResult> {
    try {
      const validated = GetArticleSchema.parse(input);

      if (!validated.id && !validated.slug) {
        return {
          success: false,
          error: 'Either id or slug must be provided',
        };
      }

      let article: Article | null = null;

      if (validated.id) {
        article = await this.articleRepository.findById(validated.id);
      } else if (validated.slug) {
        article = await this.articleRepository.findBySlug(validated.slug);
      }

      if (!article) {
        return {
          success: false,
          error: 'Article not found',
        };
      }

      return {
        success: true,
        data: article,
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
