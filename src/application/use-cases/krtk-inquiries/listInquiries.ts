import { KrtkInquiryRepository } from '../../../domain/repositories/krtkInquiryRepository';
import { KrtkInquiry } from '../../../domain/entities/krtkInquiry';

export class ListInquiriesUseCase {
  constructor(private repo: KrtkInquiryRepository) {}

  async execute(
    limit = 50,
    offset = 0
  ): Promise<{ success: boolean; data?: KrtkInquiry[]; total?: number; error?: string }> {
    try {
      const [data, total] = await Promise.all([
        this.repo.listAll(limit, offset),
        this.repo.countAll(),
      ]);
      return { success: true, data, total };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
