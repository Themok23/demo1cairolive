import { z } from 'zod';
import { Submission } from '../../../domain/entities/submission';
import { SubmissionRepository } from '../../../domain/repositories/submissionRepository';

const ListSubmissionsSchema = z.object({
  limit: z.number().int().positive().default(20),
  offset: z.number().int().nonnegative().default(0),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

export type ListSubmissionsInput = z.infer<typeof ListSubmissionsSchema>;

export interface ListSubmissionsResult {
  success: boolean;
  data?: {
    submissions: Submission[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  error?: string;
}

export class ListSubmissionsUseCase {
  constructor(private submissionRepository: SubmissionRepository) {}

  async execute(input: ListSubmissionsInput): Promise<ListSubmissionsResult> {
    try {
      const validated = ListSubmissionsSchema.parse(input);

      const result = await this.submissionRepository.findAll({
        limit: validated.limit,
        offset: validated.offset,
        status: validated.status,
      });

      const hasMore = validated.offset + validated.limit < result.total;

      return {
        success: true,
        data: {
          submissions: result.data,
          total: result.total,
          limit: validated.limit,
          offset: validated.offset,
          hasMore,
        },
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: `Validation error: ${error.errors[0].message}`,
        };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
