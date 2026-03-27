import { Gender } from '../value-objects/gender';
import { Tier } from '../value-objects/tier';

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender: Gender;
  bio?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  currentPosition?: string;
  currentCompany?: string;
  location?: string;
  tier: Tier;
  isVerified: boolean;
  isClaimed: boolean;
  claimedBy?: string;
  keywords?: string[];
  linkedinUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  websiteUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PersonEntity implements Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender: Gender;
  bio?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  currentPosition?: string;
  currentCompany?: string;
  location?: string;
  tier: Tier;
  isVerified: boolean;
  isClaimed: boolean;
  claimedBy?: string;
  keywords?: string[];
  linkedinUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  websiteUrl?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Person) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phoneNumber = data.phoneNumber;
    this.dateOfBirth = data.dateOfBirth;
    this.gender = data.gender;
    this.bio = data.bio;
    this.profileImageUrl = data.profileImageUrl;
    this.coverImageUrl = data.coverImageUrl;
    this.currentPosition = data.currentPosition;
    this.currentCompany = data.currentCompany;
    this.location = data.location;
    this.tier = data.tier;
    this.isVerified = data.isVerified;
    this.isClaimed = data.isClaimed;
    this.claimedBy = data.claimedBy;
    this.keywords = data.keywords;
    this.linkedinUrl = data.linkedinUrl;
    this.twitterUrl = data.twitterUrl;
    this.instagramUrl = data.instagramUrl;
    this.websiteUrl = data.websiteUrl;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  hasCompleteProfile(): boolean {
    return !!(
      this.bio &&
      this.profileImageUrl &&
      this.currentPosition &&
      this.currentCompany &&
      this.location
    );
  }

  updateBasicInfo(data: Partial<Person>): PersonEntity {
    return new PersonEntity({
      ...this,
      ...data,
      updatedAt: new Date(),
    });
  }
}
