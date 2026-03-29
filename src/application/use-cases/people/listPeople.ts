import { z } from 'zod';
import { Person } from '../../../domain/entities/person';
import { PersonRepository } from '../../../domain/repositories/personRepository';

const ListPeopleSchema = z.object({
  limit: z.number().int().positive().default(20),
  offset: z.number().int().nonnegative().default(0),
  tier: z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
  search: z.string().optional(),
});

export type ListPeopleInput = z.infer<typeof ListPeopleSchema>;

export interface ListPeopleResult {
  success: boolean;
  data?: {
    people: Person[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  error?: string;
}

export class ListPeopleUseCase {
  constructor(private personRepository: PersonRepository) {}

  async execute(input: ListPeopleInput): Promise<ListPeopleResult> {
    try {
      const validated = ListPeopleSchema.parse(input);

      const result = await this.personRepository.findAll({
        limit: validated.limit,
        offset: validated.offset,
        tier: validated.tier,
        search: validated.search,
      });

      const hasMore = validated.offset + validated.limit < result.total;

      return {
        success: true,
        data: {
          people: result.data,
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
