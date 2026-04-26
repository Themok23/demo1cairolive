import { z } from 'zod';
import { PillarRepository } from '../../../domain/repositories/pillarRepository';

const ReorderPillarsSchema = z.object({
  updates: z
    .array(
      z.object({
        id: z.string().min(1),
        displayOrder: z.number().int().min(0),
      })
    )
    .min(1),
});

export type ReorderPillarsInput = z.infer<typeof ReorderPillarsSchema>;

export interface ReorderPillarsResult {
  success: boolean;
  error?: string;
}

export class ReorderPillarsUseCase {
  constructor(private pillarRepository: PillarRepository) {}

  async execute(input: ReorderPillarsInput): Promise<ReorderPillarsResult> {
    try {
      const validated = ReorderPillarsSchema.parse(input);
      await this.pillarRepository.reorder(validated.updates);
      return { success: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: `Validation error: ${error.errors[0].message}` };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
