import { Gender } from '../value-objects/gender';
import { Tier } from '../value-objects/tier';

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  dateOfBirth?: Date | null;
  gender: Gender;
  bio?: string | null;
  profileImageUrl?: string | null;
  coverImageUrl?: string | null;
  currentPosition?: string | null;
  currentCompany?: string | null;
  location?: string | null;
  tier: Tier;
  isVerified: boolean;
  isClaimed: boolean;
  claimedBy?: string | null;
  keywords?: string[] | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PersonEntity implements Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  dateOfBirth?: Date | null;
  gender: Gender;
  bio?: string | null;
  profileImageUrl?: string | null;
  coverImageUrl?: string | null;
  currentPosition?: string | null;
  currentCompany?: string | null;
  location?: string | null;
  tier: Tier;
  isVerified: boolean;
  isClaimed: boolean;
  claimedBy?: string | null;
  keywords?: string[] | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
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
    return `${this.firstName} ${this.lastName}`.trim();
  }

  getInitials(): string {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
  }

  verify(): PersonEntity {
    return new PersonEntity({
      ...this,
      isVerified: true,
      updatedAt: new Date(),
    });
  }

  claim(claimedById: string): PersonEntity {
    return new PersonEntity({
      ...this,
      isClaimed: true,
      claimedBy: claimedById,
      updatedAt: new Date(),
    });
  }

  unclaim(): PersonEntity {
    return new PersonEntity({
      ...this,
      isClaimed: false,
      claimedBy: null,
      updatedAt: new Date(),
    });
  }

  updateProfile(data: Partial<Person>): PersonEntity {
    return new PersonEntity({
      ...this,
      ...data,
      updatedAt: new Date(),
    });
  }

  addKeywords(newKeywords: string[]): PersonEntity {
    const existingKeywords = this.keywords || [];
    const uniqueKeywords = Array.from(new Set([...existingKeywords, ...newKeywords]));
    return new PersonEntity({
      ...this,
      keywords: uniqueKeywords,
      updatedAt: new Date(),
    });
  }

  removeKeywords(keywordsToRemove: string[]): PersonEntity {
    const updatedKeywords = (this.keywords || []).filter(
      keyword => !keywordsToRemove.includes(keyword)
    );
    return new PersonEntity({
      ...this,
      keywords: updatedKeywords.length > 0 ? updatedKeywords : null,
      updatedAt: new Date(),
    });
  }

  updateTier(newTier: Tier): PersonEntity {
    return new PersonEntity({
      ...this,
      tier: newTier,
      updatedAt: new Date(),
    });
  }

  setProfileImage(imageUrl: string): PersonEntity {
    return new PersonEntity({
      ...this,
      profileImageUrl: imageUrl,
      updatedAt: new Date(),
    });
  }

  setCoverImage(imageUrl: string): PersonEntity {
    return new PersonEntity({
      ...this,
      coverImageUrl: imageUrl,
      updatedAt: new Date(),
    });
  }

  hasProfileImage(): boolean {
    return !!this.profileImageUrl;
  }

  hasCoverImage(): boolean {
    return !!this.coverImageUrl;
  }

  hasSocialLinks(): boolean {
    return !!(
      this.linkedinUrl ||
      this.twitterUrl ||
      this.instagramUrl ||
      this.websiteUrl
    );
  }

  getAge(): number | null {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    let age = today.getFullYear() - this.dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())
    ) {
      age--;
    }
    return age;
  }

  toJSON(): Person {
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
      coverImageUrl: this.coverImageUrl,
      currentPosition: this.currentPosition,
      currentCompany: this.currentCompany,
      location: this.location,
      tier: this.tier,
      isVerified: this.isVerified,
      isClaimed: this.isClaimed,
      claimedBy: this.claimedBy,
      keywords: this.keywords,
      linkedinUrl: this.linkedinUrl,
      twitterUrl: this.twitterUrl,
      instagramUrl: this.instagramUrl,
      websiteUrl: this.websiteUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}