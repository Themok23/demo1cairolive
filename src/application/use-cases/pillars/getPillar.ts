import { Pillar } from '../../../domain/entities/pillar';
import { PillarRepository } from '../../../domain/repositories/pillarRepository';

export interface GetPillarResult {
  success: boolean;
  data?: Pillar;
  error?: string;
}

export class GetPillarUseCase {
  constructor(private pillarRepository: PillarRepository) {}

  async executeById(id: string): Promise<GetPillarResult> {
    try {
      const pillar = await this.pillarRepository.findById(id);
      if (!pillar) return { success: false, error: 'Pillar not found' };
      return { success: true, data: pillar };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async executeBySlug(slug: string): Promise<GetPillarResult> {
    try {
      const pillar = await this.pillarRepository.findBySlug(slug);
      if (!pillar) return { success: false, error: 'Pillar not found' };
      return { success: true, data: pillar };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
