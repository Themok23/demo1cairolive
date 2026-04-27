import { z } from 'zod';
import { PersonWorkplaceRepository } from '../../../domain/repositories/personWorkplaceRepository';
import { PersonWorkplace } from '../../../domain/entities/personWorkplace';

const Schema = z.object({
  companyEn: z.string().min(1).optional(),
  companyAr: z.string().optional().nullable(),
  positionEn: z.string().optional().nullable(),
  positionAr: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  fromDate: z.coerce.date().optional().nullable(),
  toDate: z.coerce.date().optional().nullable(),
  isCurrent: z.boolean().optional(),
  imageUrl: z.string().url().optional().nullable(),
  displayOrder: z.number().int().min(0).optional(),
});

export class UpdatePersonWorkplaceUseCase {
  constructor(private repo: PersonWorkplaceRepository) {}

  async execute(id: string, input: unknown): Promise<{ success: boolean; data?: PersonWorkplace; error?: string }> {
    try {
      const validated = Schema.parse(input);
      const data = await this.repo.update(id, validated);
      if (!data) return { success: false, error: 'Workplace not found' };
      return { success: true, data };
    } catch (error) {
      if (error instanceof z.ZodError) return { success: false, error: error.errors[0].message };
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
