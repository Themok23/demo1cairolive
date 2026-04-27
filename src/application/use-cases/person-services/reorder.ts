import { z } from 'zod';
import { PersonServiceRepository } from '../../../domain/repositories/personServiceRepository';

const Schema = z.object({
  personId: z.string().min(1),
  orderedIds: z.array(z.string().min(1)).min(1),
});

export class ReorderPersonServicesUseCase {
  constructor(private repo: PersonServiceRepository) {}

  async execute(input: unknown): Promise<{ success: boolean; error?: string }> {
    try {
      const { personId, orderedIds } = Schema.parse(input);
      await this.repo.reorder(personId, orderedIds);
      return { success: true };
    } catch (error) {
      if (error instanceof z.ZodError) return { success: false, error: error.errors[0].message };
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
