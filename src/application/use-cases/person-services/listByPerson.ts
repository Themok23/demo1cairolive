import { PersonServiceRepository } from '../../../domain/repositories/personServiceRepository';
import { PersonService } from '../../../domain/entities/personService';

export class ListPersonServicesUseCase {
  constructor(private repo: PersonServiceRepository) {}

  async execute(personId: string): Promise<{ success: boolean; data?: PersonService[]; error?: string }> {
    try {
      const data = await this.repo.listByPerson(personId);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
