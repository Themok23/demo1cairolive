import { PersonAchievementRepository } from '../../../domain/repositories/personAchievementRepository';
import { PersonAchievement } from '../../../domain/entities/personAchievement';

export class ListPersonAchievementsUseCase {
  constructor(private repo: PersonAchievementRepository) {}

  async execute(personId: string): Promise<{ success: boolean; data?: PersonAchievement[]; error?: string }> {
    try {
      const data = await this.repo.listByPerson(personId);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
