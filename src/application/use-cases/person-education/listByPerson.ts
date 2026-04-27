import { PersonEducationRepository } from '../../../domain/repositories/personEducationRepository';
import { PersonEducation } from '../../../domain/entities/personEducation';

export class ListPersonEducationUseCase {
  constructor(private repo: PersonEducationRepository) {}

  async execute(personId: string): Promise<{ success: boolean; data?: PersonEducation[]; error?: string }> {
    try {
      const data = await this.repo.listByPerson(personId);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
