import { z } from 'zod';
import { Submission } from '../../../domain/entities/submission';
import { SubmissionRepository } from '../../../domain/repositories/submissionRepository';
import { PersonRepository } from '../../../domain/repositories/personRepository';
import { Person } from '../../../domain/entities/person';

const ReviewSubmissionSchema = z.object({
  id: z.string().min(1),
  action: z.enum(['approve', 'reject']),
  reviewedBy: z.string().min(1),
  reviewNotes: z.string().optional(),
});

export type ReviewSubmissionInput = z.infer<typeof ReviewSubmissionSchema>;

export interface ReviewSubmissionResult {
  success: boolean;
  data?: {
    submission: Submission;
    person?: Person;
  };
  error?: string;
}

export class ReviewSubmissionUseCase {
  constructor(
    private submissionRepository: SubmissionRepository,
    private personRepository: PersonRepository
  ) {}

  async execute(
    input: ReviewSubmissionInput
  ): Promise<ReviewSubmissionResult> {
    try {
      const validated = ReviewSubmissionSchema.parse(input);

      const existing = await this.submissionRepository.findById(validated.id);
      if (!existing) {
        return {
          success: false,
          error: 'Submission not found',
        };
      }

      if (existing.status !== 'pending') {
        return {
          success: false,
          error: `Cannot review a submission that is already ${existing.status}`,
        };
      }

      let submission: Submission | null = null;
      let person: Person | undefined = undefined;

      if (validated.action === 'approve') {
        const personData: Person = {
          id: this.generateId(),
          firstNameEn: existing.firstName,
          lastNameEn: existing.lastName,
          email: existing.email,
          phoneNumber: existing.phoneNumber,
          dateOfBirth: existing.dateOfBirth,
          gender: existing.gender as any,
          bioEn: existing.bio,
          profileImageUrl: existing.profileImageUrl,
          currentPositionEn: existing.currentPosition,
          currentCompanyEn: existing.currentCompany,
          locationEn: existing.location,
          tier: 'bronze',
          isVerified: false,
          isClaimed: false,
          keywords: existing.keywords,
          linkedinUrl: existing.linkedinUrl,
          twitterUrl: existing.twitterUrl,
          instagramUrl: existing.instagramUrl,
          websiteUrl: existing.websiteUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        person = await this.personRepository.create(personData);

        submission = await this.submissionRepository.approve(
          validated.id,
          validated.reviewedBy
        );
      } else {
        submission = await this.submissionRepository.reject(
          validated.id,
          validated.reviewedBy,
          validated.reviewNotes || 'No reason provided'
        );
      }

      if (!submission) {
        return {
          success: false,
          error: `Failed to ${validated.action} submission`,
        };
      }

      return {
        success: true,
        data: {
          submission,
          person,
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

  private generateId(): string {
    return `person-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
