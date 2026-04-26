import { z } from 'zod';
import { Person } from '../../../domain/entities/person';
import { PersonRepository } from '../../../domain/repositories/personRepository';

const GetPersonSchema = z.object({
  id: z.string().optional(),
  email: z.string().email().optional(),
});

export type GetPersonInput = z.infer<typeof GetPersonSchema>;

export interface GetPersonResult {
  success: boolean;
  data?: Person;
  error?: string;
}

export class GetPersonUseCase {
  constructor(private personRepository: PersonRepository) {}

  async execute(input: GetPersonInput): Promise<GetPersonResult> {
    try {
      const validated = GetPersonSchema.parse(input);

      if (!validated.id && !validated.email) {
        return {
          success: false,
          error: 'Either id or email must be provided',
        };
      }

      let person: Person | null = null;

      if (validated.id) {
        person = await this.personRepository.findById(validated.id);
      } else if (validated.email) {
        person = await this.personRepository.findByEmail(validated.email);
      }

      if (!person) {
        return {
          success: false,
          error: 'Person not found',
        };
      }

      return {
        success: true,
        data: person,
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
