import { z } from 'zod';
import { Person } from '../../../domain/entities/person';
import { PersonRepository } from '../../../domain/repositories/personRepository';
import { Tier } from '../../../domain/value-objects/tier';

const ClaimProfileSchema = z.object({
  id: z.string().min(1),
  claimedBy: z.string().min(1),
  upgradeTier: z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),
});

export type ClaimProfileInput = z.infer<typeof ClaimProfileSchema>;

export interface ClaimProfileResult {
  success: boolean;
  data?: Person;
  error?: string;
}

export class ClaimProfileUseCase {
  constructor(private personRepository: PersonRepository) {}

  async execute(input: ClaimProfileInput): Promise<ClaimProfileResult> {
    try {
      const validated = ClaimProfileSchema.parse(input);

      const existing = await this.personRepository.findById(validated.id);
      if (!existing) {
        return {
          success: false,
          error: 'Person not found',
        };
      }

      if (existing.isClaimed) {
        return {
          success: false,
          error: 'Profile is already claimed',
        };
      }

      const claimed = await this.personRepository.claimProfile(
        validated.id,
        validated.claimedBy
      );

      if (!claimed) {
        return {
          success: false,
          error: 'Failed to claim profile',
        };
      }

      if (validated.upgradeTier && validated.upgradeTier !== claimed.tier) {
        const upgraded = await this.personRepository.update(validated.id, {
          tier: validated.upgradeTier as Tier,
        });

        if (!upgraded) {
          return {
            success: false,
            error: 'Failed to upgrade tier',
          };
        }

        return {
          success: true,
          data: upgraded,
        };
      }

      return {
        success: true,
        data: claimed,
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
