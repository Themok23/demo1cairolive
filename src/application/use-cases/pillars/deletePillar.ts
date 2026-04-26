import { PillarRepository } from '../../../domain/repositories/pillarRepository';

export interface DeletePillarResult {
  success: boolean;
  error?: string;
}

export class DeletePillarUseCase {
  constructor(private pillarRepository: PillarRepository) {}

  async execute(id: string): Promise<DeletePillarResult> {
    try {
      const deleted = await this.pillarRepository.delete(id);
      if (!deleted) {
        return { success: false, error: 'Pillar not found' };
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
