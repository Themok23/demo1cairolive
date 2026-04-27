import { z } from 'zod';
import { PersonEducationRepository } from '../../../domain/repositories/personEducationRepository';
import { PersonEducation } from '../../../domain/entities/personEducation';

const Schema = z.object({
  personId: z.string().min(1),
  institutionEn: z.string().min(1, 'Institution name is required'),
  institutionAr: z.string().optional().nullable(),
  degreeEn: z.string().optional().nullable(),
  degreeAr: z.string().optional().nullable(),
  fieldEn: z.string().optional().nullable(),
  fieldAr: z.string().optional().nullable(),
  fromYear: z.number().int().optional().nullable(),
  toYear: z.number().int().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  displayOrder: z.number().int().min(0).default(0),
});

export class CreatePersonEducationUseCase {
  constructor(private repo: PersonEducationRepository) {}

  async execute(input: unknown): Promise<{ success: boolean; data?: PersonEducation; error?: string }> {
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
