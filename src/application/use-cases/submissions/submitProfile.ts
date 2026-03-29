import { z } from 'zod';
import { Submission, SubmissionEntity } from '../../../domain/entities/submission';
import { SubmissionRepository } from '../../../domain/repositories/submissionRepository';

const SubmitProfileSchema = z.object({
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  email: z.string().email(),
  phoneNumber: z.string().max(20).optional(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']),
  bio: z.string().optional(),
  profileImageUrl: z.string().url().optional(),
  currentPosition: z.string().max(255).optional(),
  currentCompany: z.string().max(255).optional(),
  location: z.string().max(255).optional(),
  keywords: z.array(z.string()).optional(),
  linkedinUrl: z.string().url().optional(),
  twitterUrl: z.string().url().optional(),
  instagramUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  submittedBy: z.string().min(1),
});

export type SubmitProfileInput = z.infer<typeof SubmitProfileSchema>;

export interface SubmitProfileResult {
  success: boolean;
  data?: Submission;
  error?: string;
}

export class SubmitProfileUseCase {
  constructor(private submissionRepository: SubmissionRepository) {}

  async execute(input: SubmitProfileInput): Promise<SubmitProfileResult> {
    try {
      const validated = SubmitProfileSchema.parse(input);

      const now = new Date();
      const submission: Submission = {
        id: this.generateId(),
        firstName: validated.firstName,
        lastName: validated.lastName,
        email: validated.email,
        phoneNumber: validated.phoneNumber,
        dateOfBirth: validated.dateOfBirth,
        gender: validated.gender,
        bio: validated.bio,
        profileImageUrl: validated.profileImageUrl,
        currentPosition: validated.currentPosition,
        currentCompany: validated.currentCompany,
        location: validated.location,
        keywords: validated.keywords,
        linkedinUrl: validated.linkedinUrl,
        twitterUrl: validated.twitterUrl,
        instagramUrl: validated.instagramUrl,
        websiteUrl: validated.websiteUrl,
        status: 'pending',
        submittedBy: validated.submittedBy,
        submittedAt: now,
        updatedAt: now,
      };

      const created = await this.submissionRepository.create(submission);
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
    return `submission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
