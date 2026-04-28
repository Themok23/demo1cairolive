import { z } from 'zod';
import { ExperienceRepository } from '../../../domain/repositories/experienceRepository';

const Schema = z.object({
  kind: z.enum(['like', 'visited', 'wishlist']),
  userIdentifier: z.string().min(1).max(200),
});

export class ReactToExperienceUseCase {
  constructor(private repo: ExperienceRepository) {}

  async execute(experienceId: string, input: unknown): Promise<{ success: boolean; active?: boolean; error?: string }> {
    try {
      const { kind, userIdentifier } = Schema.parse(input);
      const existing = await this.repo.getUserReactions(experienceId, userIdentifier);
      if (existing.includes(kind)) {
        await this.repo.removeReaction(experienceId, kind, userIdentifier);
        return { success: true, active: false };
      }
      await this.repo.addReaction(experienceId, kind, userIdentifier);
      return { success: true, active: true };
    } catch (error) {
      if (error instanceof z.ZodError) return { success: false, error: error.errors[0].message };
      return { success: false, error: 'An unexpected error occurred' };
    }
  }
}
