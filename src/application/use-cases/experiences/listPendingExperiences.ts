import { ExperienceRepository } from '../../../domain/repositories/experienceRepository';
import { Experience } from '../../../domain/entities/experience';

export class ListPendingExperiencesUseCase {
  constructor(private repo: ExperienceRepository) {}

  async execute(): Promise<{ success: boolean; data?: Experience[]; error?: string }> {
    try {
      const data = await this.repo.listByStatus('pending');
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
