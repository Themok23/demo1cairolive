import { Pillar } from '../../../domain/entities/pillar';
import { PillarRepository } from '../../../domain/repositories/pillarRepository';

export interface ListPillarsInput {
  limit?: number;
  offset?: number;
  isActive?: boolean;
  search?: string;
}

export interface ListPillarsResult {
  success: boolean;
  data?: { data: Pillar[]; total: number };
  error?: string;
}

export class ListPillarsUseCase {
  constructor(private pillarRepository: PillarRepository) {}

  async execute(input: ListPillarsInput = {}): Promise<ListPillarsResult> {
    try {
      const data = await this.pillarRepository.findAll(input);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
