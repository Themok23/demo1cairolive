import { ExperienceRepository } from '../../../domain/repositories/experienceRepository';
import { Experience } from '../../../domain/entities/experience';

export class ApproveExperienceUseCase {
  constructor(private repo: ExperienceRepository) {}

  async execute(id: string): Promise<{ success: boolean; data?: Experience; error?: string }> {
    try {
      const data = await this.repo.updateStatus(id, 'published');
      if (!data) return { success: false, error: 'Experience not found' };
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
