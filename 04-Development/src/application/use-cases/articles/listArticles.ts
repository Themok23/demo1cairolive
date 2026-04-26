import { z } from 'zod';
import { Article } from '../../../domain/entities/article';
import { ArticleRepository } from '../../../domain/repositories/articleRepository';

const ListArticlesSchema = z.object({
  limit: z.number().int().positive().default(20),
  offset: z.number().int().nonnegative().default(0),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  category: z.string().optional(),
  onlyPublished: z.boolean().default(true),
});

export type ListArticlesInput = z.infer<typeof ListArticlesSchema>;

export interface ListArticlesResult {
  success: boolean;
  data?: {
    articles: Article[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  error?: string;
}

export class ListArticlesUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(input: ListArticlesInput): Promise<ListArticlesResult> {
    try {
      const validated = ListArticlesSchema.parse(input);

      const status = validated.onlyPublished ? 'published' : validated.status;

      const result = await this.articleRepository.findAll({
        limit: validated.limit,
        offset: validated.offset,
        status,
        category: validated.category,
      });

      const hasMore = validated.offset + validated.limit < result.total;

      return {
        success: true,
        data: {
          articles: result.data,
          total: result.total,
          limit: validated.limit,
          offset: validated.offset,
          hasMore,
        },
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
