import { PersonProductRepository } from '../../../domain/repositories/personProductRepository';
import { PersonProduct } from '../../../domain/entities/personProduct';

export class ListPersonProductsUseCase {
  constructor(private repo: PersonProductRepository) {}

  async execute(personId: string): Promise<{ success: boolean; data?: PersonProduct[]; error?: string }> {
    try {
      const data = await this.repo.listByPerson(personId);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
