import { z } from 'zod';
import { Person } from '../../../domain/entities/person';
import { PersonRepository } from '../../../domain/repositories/personRepository';

const UpdatePersonSchema = z.object({
  id: z.string().min(1),
  firstNameEn: z.string().min(1).max(255).optional(),
  lastNameEn: z.string().min(1).max(255).optional(),
  phoneNumber: z.string().max(20).optional(),
  dateOfBirth: z.date().optional(),
  bioEn: z.string().optional(),
  profileImageUrl: z.string().url().optional(),
  coverImageUrl: z.string().url().optional(),
  currentPositionEn: z.string().max(255).optional(),
  currentCompanyEn: z.string().max(255).optional(),
  locationEn: z.string().max(255).optional(),
  keywords: z.array(z.string()).optional(),
  linkedinUrl: z.string().url().optional(),
  twitterUrl: z.string().url().optional(),
  instagramUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
});

export type UpdatePersonInput = z.infer<typeof UpdatePersonSchema>;

export interface UpdatePersonResult {
  success: boolean;
  data?: Person;
  error?: string;
}

export class UpdatePersonUseCase {
  constructor(private personRepository: PersonRepository) {}

  async execute(input: UpdatePersonInput): Promise<UpdatePersonResult> {
    try {
      const validated = UpdatePersonSchema.parse(input);

      const existing = await this.personRepository.findById(validated.id);
      if (!existing) {
        return {
          success: false,
          error: 'Person not found',
        };
      }

      const updateData: Partial<Person> = {
        firstNameEn: validated.firstNameEn,
        lastNameEn: validated.lastNameEn,
        phoneNumber: validated.phoneNumber,
        dateOfBirth: validated.dateOfBirth,
        bioEn: validated.bioEn,
        profileImageUrl: validated.profileImageUrl,
        coverImageUrl: validated.coverImageUrl,
        currentPositionEn: validated.currentPositionEn,
        currentCompanyEn: validated.currentCompanyEn,
        locationEn: validated.locationEn,
        keywords: validated.keywords,
        linkedinUrl: validated.linkedinUrl,
        twitterUrl: validated.twitterUrl,
        instagramUrl: validated.instagramUrl,
        websiteUrl: validated.websiteUrl,
      };

      const objectEntries = Object.entries(updateData);
      const cleanedData = Object.fromEntries(
        objectEntries.filter(([, value]) => value !== undefined)
      );

      const updated = await this.personRepository.update(
        validated.id,
        cleanedData
      );

      if (!updated) {
        return {
          success: false,
          error: 'Failed to update person',
        };
      }

      return {
        success: true,
        data: updated,
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
