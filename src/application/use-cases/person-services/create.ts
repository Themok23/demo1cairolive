import { z } from 'zod';
import { PersonServiceRepository } from '../../../domain/repositories/personServiceRepository';
import { PersonService } from '../../../domain/entities/personService';

const Schema = z.object({
  personId: z.string().min(1),
  titleEn: z.string().min(1, 'Title is required'),
  titleAr: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  externalLink: z.string().url().optional().nullable(),
  priceText: z.string().optional().nullable(),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export class CreatePersonServiceUseCase {
  constructor(private repo: PersonServiceRepository) {}

  async execute(input: unknown): Promise<{ success: boolean; data?: PersonService; error?: string }> {
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
