import { z } from 'zod';
import { PersonWorkplaceRepository } from '../../../domain/repositories/personWorkplaceRepository';
import { PersonWorkplace } from '../../../domain/entities/personWorkplace';

const Schema = z.object({
  personId: z.string().min(1),
  companyEn: z.string().min(1, 'Company name is required'),
  companyAr: z.string().optional().nullable(),
  positionEn: z.string().optional().nullable(),
  positionAr: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  fromDate: z.coerce.date().optional().nullable(),
  toDate: z.coerce.date().optional().nullable(),
  isCurrent: z.boolean().default(false),
  imageUrl: z.string().url().optional().nullable(),
  displayOrder: z.number().int().min(0).default(0),
});

export class CreatePersonWorkplaceUseCase {
  constructor(private repo: PersonWorkplaceRepository) {}

  async execute(input: unknown): Promise<{ success: boolean; data?: PersonWorkplace; error?: string }> {
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
