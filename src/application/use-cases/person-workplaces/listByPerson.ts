import { PersonWorkplaceRepository } from '../../../domain/repositories/personWorkplaceRepository';
import { PersonWorkplace } from '../../../domain/entities/personWorkplace';

export class ListPersonWorkplacesUseCase {
  constructor(private repo: PersonWorkplaceRepository) {}

  async execute(personId: string): Promise<{ success: boolean; data?: PersonWorkplace[]; error?: string }> {
    try {
      const data = await this.repo.listByPerson(personId);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
