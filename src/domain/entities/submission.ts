import { SubmissionStatus } from '../value-objects/submissionStatus';

export interface Submission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  dateOfBirth?: Date | null;
  gender: string;
  bio?: string | null;
  profileImageUrl?: string | null;
  currentPosition?: string | null;
  currentCompany?: string | null;
  location?: string | null;
  keywords?: string[] | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  status: SubmissionStatus;
  submittedBy: string;
  reviewedBy?: string | null;
  reviewNotes?: string | null;
  submittedAt: Date;
  reviewedAt?: Date | null;
  updatedAt: Date;
}

export class SubmissionEntity implements Submission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  dateOfBirth?: Date | null;
  gender: string;
  bio?: string | null;
  profileImageUrl?: string | null;
  currentPosition?: string | null;
  currentCompany?: string | null;
  location?: string | null;
  keywords?: string[] | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  status: SubmissionStatus;
  submittedBy: string;
  reviewedBy?: string | null;
  reviewNotes?: string | null;
  submittedAt: Date;
  reviewedAt?: Date | null;
  updatedAt: Date;

  constructor(data: Submission) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phoneNumber = data.phoneNumber;
    this.dateOfBirth = data.dateOfBirth;
    this.gender = data.gender;
    this.bio = data.bio;
    this.profileImageUrl = data.profileImageUrl;
    this.currentPosition = data.currentPosition;
    this.currentCompany = data.currentCompany;
    this.location = data.location;
    this.keywords = data.keywords;
    this.linkedinUrl = data.linkedinUrl;
    this.twitterUrl = data.twitterUrl;
    this.instagramUrl = data.instagramUrl;
    this.websiteUrl = data.websiteUrl;
    this.status = data.status;
    this.submittedBy = data.submittedBy;
    this.reviewedBy = data.reviewedBy;
    this.reviewNotes = data.reviewNotes;
    this.submittedAt = data.submittedAt;
    this.reviewedAt = data.reviewedAt;
    this.updatedAt = data.updatedAt;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  getInitials(): string {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
  }

  isPending(): boolean {
    return this.status === 'pending';
  }

  isApproved(): boolean {
    return this.status === 'approved';
  }

  isRejected(): boolean {
    return this.status === 'rejected';
  }

  isUnderReview(): boolean {
    return this.status === 'under_review';
  }

  approve(reviewerId: string): SubmissionEntity {
    return new SubmissionEntity({
      ...this,
      status: 'approved' as SubmissionStatus,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  reject(reviewerId: string, notes: string): SubmissionEntity {
    return new SubmissionEntity({
      ...this,
      status: 'rejected' as SubmissionStatus,
      reviewedBy: reviewerId,
      reviewNotes: notes,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  markUnderReview(reviewerId: string): SubmissionEntity {
    return new SubmissionEntity({
      ...this,
      status: 'under_review' as SubmissionStatus,
      reviewedBy: reviewerId,
      updatedAt: new Date(),
    });
  }

  updateReviewNotes(notes: string, reviewerId: string): SubmissionEntity {
    return new SubmissionEntity({
      ...this,
      reviewNotes: notes,
      reviewedBy: reviewerId,
      updatedAt: new Date(),
    });
  }

  update(data: Partial<Submission>): SubmissionEntity {
    return new SubmissionEntity({
      ...this,
      ...data,
      updatedAt: new Date(),
    });
  }

  addKeywords(newKeywords: string[]): SubmissionEntity {
    const existingKeywords = this.keywords || [];
    const uniqueKeywords = Array.from(new Set([...existingKeywords, ...newKeywords]));
    return new SubmissionEntity({
      ...this,
      keywords: uniqueKeywords,
      updatedAt: new Date(),
    });
  }

  removeKeywords(keywordsToRemove: string[]): SubmissionEntity {
    const updatedKeywords = (this.keywords || []).filter(
      keyword => !keywordsToRemove.includes(keyword)
    );
    return new SubmissionEntity({
      ...this,
      keywords: updatedKeywords.length > 0 ? updatedKeywords : null,
      updatedAt: new Date(),
    });
  }

  hasSocialLinks(): boolean {
    return !!(
      this.linkedinUrl ||
      this.twitterUrl ||
      this.instagramUrl ||
      this.websiteUrl
    );
  }

  getTimeSinceSubmission(): number {
    return Date.now() - this.submittedAt.getTime();
  }

  getTimeSinceReview(): number | null {
    return this.reviewedAt ? Date.now() - this.reviewedAt.getTime() : null;
  }

  isReviewed(): boolean {
    return !!this.reviewedAt;
  }

  toJSON(): Submission {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      bio: this.bio,
      profileImageUrl: this.profileImageUrl,
      currentPosition: this.currentPosition,
      currentCompany: this.currentCompany,
      location: this.location,
      keywords: this.keywords,
      linkedinUrl: this.linkedinUrl,
      twitterUrl: this.twitterUrl,
      instagramUrl: this.instagramUrl,
      websiteUrl: this.websiteUrl,
      status: this.status,
      submittedBy: this.submittedBy,
      reviewedBy: this.reviewedBy,
      reviewNotes: this.reviewNotes,
      submittedAt: this.submittedAt,
      reviewedAt: this.reviewedAt,
      updatedAt: this.updatedAt,
    };
  }
}