import { SubmissionStatus } from '../value-objects/submissionStatus';

export interface Submission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender: string;
  bio?: string;
  profileImageUrl?: string;
  currentPosition?: string;
  currentCompany?: string;
  location?: string;
  keywords?: string[];
  linkedinUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  websiteUrl?: string;
  status: SubmissionStatus;
  submittedBy: string;
  reviewedBy?: string;
  reviewNotes?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  updatedAt: Date;
}

export class SubmissionEntity implements Submission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender: string;
  bio?: string;
  profileImageUrl?: string;
  currentPosition?: string;
  currentCompany?: string;
  location?: string;
  keywords?: string[];
  linkedinUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  websiteUrl?: string;
  status: SubmissionStatus;
  submittedBy: string;
  reviewedBy?: string;
  reviewNotes?: string;
  submittedAt: Date;
  reviewedAt?: Date;
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

  isPending(): boolean {
    return this.status === 'pending';
  }

  isApproved(): boolean {
    return this.status === 'approved';
  }

  isRejected(): boolean {
    return this.status === 'rejected';
  }

  approve(reviewedBy: string): SubmissionEntity {
    return new SubmissionEntity({
      ...this,
      status: 'approved',
      reviewedBy,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  reject(reviewedBy: string, notes: string): SubmissionEntity {
    return new SubmissionEntity({
      ...this,
      status: 'rejected',
      reviewedBy,
      reviewNotes: notes,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
