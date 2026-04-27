import { z } from 'zod';
import { randomUUID } from 'crypto';
import { Pillar } from '../../../domain/entities/pillar';
import { PillarRepository } from '../../../domain/repositories/pillarRepository';

const SlugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only');

const CreatePillarSchema = z.object({
  slug: SlugSchema,
  nameEn: z.string().min(1).max(100),
  nameAr: z.string().max(100).optional(),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  iconKey: z.string().max(50).optional(),
  coverImageUrl: z.string().optional(),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type CreatePillarInput = z.infer<typeof CreatePillarSchema>;

export interface CreatePillarResult {
  success: boolean;
  data?: Pillar;
  error?: string;
}

export class CreatePillarUseCase {
  constructor(private pillarRepository: PillarRepository) {}

  async execute(input: CreatePillarInput): Promise<CreatePillarResult> {
    try {
      const validated = CreatePillarSchema.parse(input);

      const existing = await this.pillarRepository.findBySlug(validated.slug);
      if (existing) {
        return { success: false, error: 'A pillar with this slug already exists' };
      }

      const now = new Date();
      const pillar: Pillar = {
        id: randomUUID(),
        slug: validated.slug,
        nameEn: validated.nameEn,
        nameAr: validated.nameAr ?? null,
        descriptionEn: validated.descriptionEn ?? null,
        descriptionAr: validated.descriptionAr ?? null,
        iconKey: validated.iconKey ?? null,
        coverImageUrl: validated.coverImageUrl ?? null,
        displayOrder: validated.displayOrder ?? 0,
        isActive: validated.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      };

      const created = await this.pillarRepository.create(pillar);
      return { success: true, data: created };
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
