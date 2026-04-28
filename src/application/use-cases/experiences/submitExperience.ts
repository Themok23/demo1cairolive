import { z } from 'zod';
import { ExperienceRepository } from '../../../domain/repositories/experienceRepository';
import { Experience } from '../../../domain/entities/experience';

const Schema = z.object({
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens'),
  type: z.enum(['visit', 'book_review', 'trip', 'event']),
  pillarId: z.string().optional().nullable(),
  placeId: z.string().optional().nullable(),
  titleEn: z.string().min(5, 'Title must be at least 5 characters').max(280),
  titleAr: z.string().max(280).optional().nullable(),
  summaryEn: z.string().max(500).optional().nullable(),
  summaryAr: z.string().max(500).optional().nullable(),
  contentEn: z.string().min(20, 'Content must be at least 20 characters').max(10000),
  contentAr: z.string().max(10000).optional().nullable(),
  coverImageUrl: z.string().url().refine((u) => u.startsWith('https://'), 'Cover image must be an HTTPS URL').optional().nullable(),
  submittedByName: z.string().min(2).max(200),
  submittedByEmail: z.string().email().max(200),
});

export class SubmitExperienceUseCase {
  constructor(private repo: ExperienceRepository) {}

  async execute(input: unknown): Promise<{ success: boolean; data?: Experience; error?: string }> {
    try {
      const validated = Schema.parse(input);
      const existing = await this.repo.findBySlug(validated.slug);
      if (existing) return { success: false, error: 'A submission with this slug already exists' };
      const data = await this.repo.create({ ...validated, status: 'pending' });
      return { success: true, data };
    } catch (error) {
      if (error instanceof z.ZodError) return { success: false, error: error.errors[0].message };
      return { success: false, error: 'An unexpected error occurred' };
    }
  }
}
