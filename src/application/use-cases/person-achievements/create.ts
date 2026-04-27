import { z } from 'zod';
import { PersonAchievementRepository } from '../../../domain/repositories/personAchievementRepository';
import { PersonAchievement } from '../../../domain/entities/personAchievement';

const Schema = z.object({
  personId: z.string().min(1),
  titleEn: z.string().min(1, 'Title is required'),
  titleAr: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  iconKey: z.string().optional().nullable(),
  externalLink: z.string().url().optional().nullable(),
  relatedArticleId: z.string().optional().nullable(),
  displayOrder: z.number().int().min(0).default(0),
});

export class CreatePersonAchievementUseCase {
  constructor(private repo: PersonAchievementRepository) {}

  async execute(input: unknown): Promise<{ success: boolean; data?: PersonAchievement; error?: string }> {
    try {
      const validated = Schema.parse(input);
      const data = await this.repo.create(validated);
      return { success: true, data };
    } catch (error) {
      if (error instanceof z.ZodError) return { success: false, error: error.errors[0].message };
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
