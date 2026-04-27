import { z } from 'zod';
import { KrtkInquiryRepository } from '../../../domain/repositories/krtkInquiryRepository';
import { KrtkInquiry } from '../../../domain/entities/krtkInquiry';

const Schema = z.object({
  krtkSlug: z.string().min(1),
  senderName: z.string().min(1, 'Name is required').max(200),
  senderEmail: z.string().email('Valid email required').max(200),
  senderPhone: z.string().max(30).optional().nullable(),
  subject: z.string().max(280).optional().nullable(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  metaJson: z.string().optional().nullable(),
});

export class CreateInquiryUseCase {
  constructor(private repo: KrtkInquiryRepository) {}

  async execute(input: unknown): Promise<{ success: boolean; data?: KrtkInquiry; error?: string }> {
    try {
      const validated = Schema.parse(input);
      const data = await this.repo.create(validated);
      return { success: true, data };
    } catch (error) {
      if (error instanceof z.ZodError) return { success: false, error: error.errors[0].message };
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
