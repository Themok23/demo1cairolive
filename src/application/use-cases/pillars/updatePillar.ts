import { z } from 'zod';
import { Pillar } from '../../../domain/entities/pillar';
import { PillarRepository } from '../../../domain/repositories/pillarRepository';

const UpdatePillarSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only')
    .optional(),
  nameEn: z.string().min(1).max(100).optional(),
  nameAr: z.string().max(100).nullable().optional(),
  descriptionEn: z.string().nullable().optional(),
  descriptionAr: z.string().nullable().optional(),
  iconKey: z.string().max(50).nullable().optional(),
  coverImageUrl: z.string().nullable().optional(),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type UpdatePillarInput = z.infer<typeof UpdatePillarSchema>;

export interface UpdatePillarResult {
  success: boolean;
  data?: Pillar;
  error?: string;
}

export class UpdatePillarUseCase {
  constructor(private pillarRepository: PillarRepository) {}

  async execute(id: string, input: UpdatePillarInput): Promise<UpdatePillarResult> {
    try {
      const validated = UpdatePillarSchema.parse(input);

      // If slug is changing, ensure it's not taken by another pillar.
      if (validated.slug) {
        const existing = await this.pillarRepository.findBySlug(validated.slug);
        if (existing && existing.id !== id) {
          return { success: false, error: 'A pillar with this slug already exists' };
        }
      }

      const updated = await this.pillarRepository.update(id, validated);
      if (!updated) {
        return { success: false, error: 'Pillar not found' };
      }
      return { success: true, data: updated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: `Validation error: ${error.errors[0].message}` };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
