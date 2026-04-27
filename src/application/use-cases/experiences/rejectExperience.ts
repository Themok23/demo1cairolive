import { z } from 'zod';
import { ExperienceRepository } from '../../../domain/repositories/experienceRepository';
import { Experience } from '../../../domain/entities/experience';

const Schema = z.object({
  rejectionReason: z.string().min(5).max(500).optional(),
});

export class RejectExperienceUseCase {
  constructor(private repo: ExperienceRepository) {}

  async execute(id: string, input: unknown): Promise<{ success: boolean; data?: Experience; error?: string }> {
    try {
      const validated = Schema.parse(input ?? {});
      const data = await this.repo.updateStatus(id, 'rejected', { rejectionReason: validated.rejectionReason });
      if (!data) return { success: false, error: 'Experience not found' };
      return { success: true, data };
    } catch (error) {
      if (error instanceof z.ZodError) return { success: false, error: error.errors[0].message };
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
