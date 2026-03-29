import { z } from 'zod';
import { ArticleRepository } from '../../../domain/repositories/articleRepository';

const DeleteArticleSchema = z.object({
  id: z.string().min(1),
});

export type DeleteArticleInput = z.infer<typeof DeleteArticleSchema>;

export interface DeleteArticleResult {
  success: boolean;
  error?: string;
}

export class DeleteArticleUseCase {
  constructor(private articleRepository: ArticleRepository) {}

  async execute(input: DeleteArticleInput): Promise<DeleteArticleResult> {
    try {
      const validated = DeleteArticleSchema.parse(input);

      const deleted = await this.articleRepository.delete(validated.id);

      if (!deleted) {
        return {
          success: false,
          error: 'Article not found or could not be deleted',
        };
      }

      return {
        success: true,
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
