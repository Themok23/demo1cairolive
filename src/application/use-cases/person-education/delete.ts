import { PersonEducationRepository } from '../../../domain/repositories/personEducationRepository';

export class DeletePersonEducationUseCase {
  constructor(private repo: PersonEducationRepository) {}

  async execute(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const existing = await this.repo.findById(id);
      if (!existing) return { success: false, error: 'Education item not found' };
      await this.repo.delete(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
