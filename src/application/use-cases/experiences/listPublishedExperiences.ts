import { ExperienceRepository, ListPublishedParams } from '../../../domain/repositories/experienceRepository';
import { Experience } from '../../../domain/entities/experience';

export class ListPublishedExperiencesUseCase {
  constructor(private repo: ExperienceRepository) {}

  async execute(params?: ListPublishedParams): Promise<{ success: boolean; data?: Experience[]; error?: string }> {
    try {
      const data = await this.repo.listPublished(params);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
