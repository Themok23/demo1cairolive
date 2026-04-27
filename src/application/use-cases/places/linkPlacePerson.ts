import { z } from 'zod';
import { PlaceRepository } from '../../../domain/repositories/placeRepository';

const LinkSchema = z.object({
  placeId: z.string().min(1),
  personId: z.string().min(1),
  role: z.string().min(1).max(50),
  roleEn: z.string().max(100).optional(),
  roleAr: z.string().max(100).optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export type LinkPlacePersonInput = z.infer<typeof LinkSchema>;

export interface LinkPlacePersonResult {
  success: boolean;
  error?: string;
}

export class LinkPlacePersonUseCase {
  constructor(private placeRepository: PlaceRepository) {}

  async execute(input: LinkPlacePersonInput): Promise<LinkPlacePersonResult> {
    try {
      const validated = LinkSchema.parse(input);
      await this.placeRepository.linkPerson(
        validated.placeId,
        validated.personId,
        validated.role,
        validated.roleEn,
        validated.roleAr,
        validated.displayOrder ?? 0
      );
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

export class UnlinkPlacePersonUseCase {
  constructor(private placeRepository: PlaceRepository) {}

  async execute(placeId: string, personId: string, role: string): Promise<LinkPlacePersonResult> {
    try {
      const ok = await this.placeRepository.unlinkPerson(placeId, personId, role);
      if (!ok) return { success: false, error: 'Link not found' };
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
