import { PersonServiceRepository } from '../../../domain/repositories/personServiceRepository';

export class DeletePersonServiceUseCase {
  constructor(private repo: PersonServiceRepository) {}

  async execute(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const existing = await this.repo.findById(id);
      if (!existing) return { success: false, error: 'Service not found' };
      await this.repo.delete(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
