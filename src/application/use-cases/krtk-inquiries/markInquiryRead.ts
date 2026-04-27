import { KrtkInquiryRepository } from '../../../domain/repositories/krtkInquiryRepository';
import { KrtkInquiry } from '../../../domain/entities/krtkInquiry';

export class MarkInquiryReadUseCase {
  constructor(private repo: KrtkInquiryRepository) {}

  async execute(id: string): Promise<{ success: boolean; data?: KrtkInquiry; error?: string }> {
    try {
      const data = await this.repo.markRead(id);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
