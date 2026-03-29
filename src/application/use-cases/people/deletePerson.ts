import { z } from 'zod';
import { PersonRepository } from '../../../domain/repositories/personRepository';

const DeletePersonSchema = z.object({
  id: z.string().min(1),
});

export type DeletePersonInput = z.infer<typeof DeletePersonSchema>;

export interface DeletePersonResult {
  success: boolean;
  error?: string;
}

export class DeletePersonUseCase {
  constructor(private personRepository: PersonRepository) {}

  async execute(input: DeletePersonInput): Promise<DeletePersonResult> {
    try {
      const validated = DeletePersonSchema.parse(input);

      const deleted = await this.personRepository.delete(validated.id);

      if (!deleted) {
        return {
          success: false,
          error: 'Person not found or could not be deleted',
        };
      }

      return {
        success: true,
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
