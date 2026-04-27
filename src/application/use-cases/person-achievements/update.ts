import { z } from 'zod';
import { PersonAchievementRepository } from '../../../domain/repositories/personAchievementRepository';
import { PersonAchievement } from '../../../domain/entities/personAchievement';

const Schema = z.object({
  titleEn: z.string().min(1).optional(),
  titleAr: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  iconKey: z.string().optional().nullable(),
  externalLink: z.string().url().optional().nullable(),
  relatedArticleId: z.string().optional().nullable(),
  displayOrder: z.number().int().min(0).optional(),
});

export class UpdatePersonAchievementUseCase {
  constructor(private repo: PersonAchievementRepository) {}

  async execute(id: string, input: unknown): Promise<{ success: boolean; data?: PersonAchievement; error?: string }> {
    try {
      const validated = Schema.parse(input);
      const data = await this.repo.update(id, validated);
      if (!data) return { success: false, error: 'Achievement not found' };
      return { success: true, data };
    } catch (error) {
      if (error instanceof z.ZodError) return { success: false, error: error.errors[0].message };
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
