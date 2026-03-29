import { z } from 'zod';
import { Person, PersonEntity } from '../../../domain/entities/person';
import { PersonRepository } from '../../../domain/repositories/personRepository';
import { Gender } from '../../../domain/value-objects/gender';
import { Tier } from '../../../domain/value-objects/tier';
import { randomUUID } from 'crypto';

const CreatePersonSchema = z.object({
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  email: z.string().email(),
  phoneNumber: z.string().max(20).optional(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']),
  bio: z.string().optional(),
  profileImageUrl: z.string().url().optional(),
  coverImageUrl: z.string().url().optional(),
  currentPosition: z.string().max(255).optional(),
  currentCompany: z.string().max(255).optional(),
  location: z.string().max(255).optional(),
  tier: z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),
  keywords: z.array(z.string()).optional(),
  linkedinUrl: z.string().url().optional(),
  twitterUrl: z.string().url().optional(),
  instagramUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
});

export type CreatePersonInput = z.infer<typeof CreatePersonSchema>;

export interface CreatePersonResult {
  success: boolean;
  data?: Person;
  error?: string;
}

export class CreatePersonUseCase {
  constructor(private personRepository: PersonRepository) {}

  async execute(input: CreatePersonInput): Promise<CreatePersonResult> {
    try {
      const validated = CreatePersonSchema.parse(input);

      const existingPerson = await this.personRepository.findByEmail(
        validated.email
      );
      if (existingPerson) {
        return {
          success: false,
          error: 'Person with this email already exists',
        };
      }

      const now = new Date();
      const person: Person = {
        id: this.generateId(),
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        phoneNumber: validated.phoneNumber,
        dateOfBirth: validated.dateOfBirth,
        gender: validated.gender,
        bio: validated.bio,
        profileImageUrl: validated.profileImageUrl,
        coverImageUrl: validated.coverImageUrl,
        currentPosition: validated.currentPosition,
        currentCompany: validated.currentCompany,
        location: validated.location,
        tier: (validated.tier || 'bronze') as Tier,
        isVerified: false,
        isClaimed: false,
        keywords: validated.keywords,
        linkedinUrl: validated.linkedinUrl,
        twitterUrl: validated.twitterUrl,
        instagramUrl: validated.instagramUrl,
        websiteUrl: validated.websiteUrl,
        createdAt: now,
        updatedAt: now,
      };

      const created = await this.personRepository.create(person);
      return {
        success: true,
        data: created,
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

  private generateId(): string {
    return `person-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
