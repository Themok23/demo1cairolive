import { z } from 'zod';
import { PersonServiceRepository } from '../../../domain/repositories/personServiceRepository';
import { PersonService } from '../../../domain/entities/personService';

const Schema = z.object({
  titleEn: z.string().min(1).optional(),
  titleAr: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  externalLink: z.string().url().optional().nullable(),
  priceText: z.string().optional().nullable(),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export class UpdatePersonServiceUseCase {
  constructor(private repo: PersonServiceRepository) {}

  async execute(id: string, input: unknown): Promise<{ success: boolean; data?: PersonService; error?: string }> {
    try {
      const validated = Schema.parse(input);
      const data = await this.repo.update(id, validated);
      if (!data) return { success: false, error: 'Service not found' };
      return { success: true, data };
    } catch (error) {
      if (error instanceof z.ZodError) return { success: false, error: error.errors[0].message };
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
