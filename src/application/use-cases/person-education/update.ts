import { z } from 'zod';
import { PersonEducationRepository } from '../../../domain/repositories/personEducationRepository';
import { PersonEducation } from '../../../domain/entities/personEducation';

const Schema = z.object({
  institutionEn: z.string().min(1).optional(),
  institutionAr: z.string().optional().nullable(),
  degreeEn: z.string().optional().nullable(),
  degreeAr: z.string().optional().nullable(),
  fieldEn: z.string().optional().nullable(),
  fieldAr: z.string().optional().nullable(),
  fromYear: z.number().int().optional().nullable(),
  toYear: z.number().int().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  displayOrder: z.number().int().min(0).optional(),
});

export class UpdatePersonEducationUseCase {
  constructor(private repo: PersonEducationRepository) {}

  async execute(id: string, input: unknown): Promise<{ success: boolean; data?: PersonEducation; error?: string }> {
    try {
      const validated = Schema.parse(input);
      const data = await this.repo.update(id, validated);
      if (!data) return { success: false, error: 'Education item not found' };
      return { success: true, data };
    } catch (error) {
      if (error instanceof z.ZodError) return { success: false, error: error.errors[0].message };
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
