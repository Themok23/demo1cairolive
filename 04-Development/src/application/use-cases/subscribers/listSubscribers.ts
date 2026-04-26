import { z } from 'zod';
import { Subscriber } from '../../../domain/entities/subscriber';
import { SubscriberRepository } from '../../../domain/repositories/subscriberRepository';

const ListSubscribersSchema = z.object({
  limit: z.number().int().positive().default(20),
  offset: z.number().int().nonnegative().default(0),
  onlyActive: z.boolean().default(true),
});

export type ListSubscribersInput = z.infer<typeof ListSubscribersSchema>;

export interface ListSubscribersResult {
  success: boolean;
  data?: {
    subscribers: Subscriber[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  error?: string;
}

export class ListSubscribersUseCase {
  constructor(private subscriberRepository: SubscriberRepository) {}

  async execute(input: ListSubscribersInput): Promise<ListSubscribersResult> {
    try {
      const validated = ListSubscribersSchema.parse(input);

      const result = await this.subscriberRepository.findAll({
        limit: validated.limit,
        offset: validated.offset,
        isActive: validated.onlyActive,
      });

      const hasMore = validated.offset + validated.limit < result.total;

      return {
        success: true,
        data: {
          subscribers: result.data,
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
