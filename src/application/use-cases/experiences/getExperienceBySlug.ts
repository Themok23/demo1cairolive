import { ExperienceRepository } from '../../../domain/repositories/experienceRepository';
import { Experience } from '../../../domain/entities/experience';

export class GetExperienceBySlugUseCase {
  constructor(private repo: ExperienceRepository) {}

  async execute(slug: string): Promise<{ success: boolean; data?: Experience; error?: string }> {
    try {
      const data = await this.repo.findBySlug(slug);
      if (!data) return { success: false, error: 'Experience not found' };
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
