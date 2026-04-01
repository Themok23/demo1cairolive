import { Gender } from '../value-objects/gender';
import { Tier } from '../value-objects/tier';

export interface Person {
  id: string;
  // Bilingual name + content
  firstNameEn: string;
  firstNameAr?: string | null;
  lastNameEn: string;
  lastNameAr?: string | null;
  bioEn?: string | null;
  bioAr?: string | null;
  currentPositionEn?: string | null;
  currentPositionAr?: string | null;
  currentCompanyEn?: string | null;
  currentCompanyAr?: string | null;
  locationEn?: string | null;
  locationAr?: string | null;
  // Language-neutral
  email: string;
  phoneNumber?: string | null;
  dateOfBirth?: Date | null;
  gender: Gender;
  profileImageUrl?: string | null;
  coverImageUrl?: string | null;
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
  firstNameEn: string;
  firstNameAr?: string | null;
  lastNameEn: string;
  lastNameAr?: string | null;
  bioEn?: string | null;
  bioAr?: string | null;
  currentPositionEn?: string | null;
  currentPositionAr?: string | null;
  currentCompanyEn?: string | null;
  currentCompanyAr?: string | null;
  locationEn?: string | null;
  locationAr?: string | null;
  email: string;
  phoneNumber?: string | null;
  dateOfBirth?: Date | null;
  gender: Gender;
  profileImageUrl?: string | null;
  coverImageUrl?: string | null;
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
    this.firstNameEn = data.firstNameEn;
    this.firstNameAr = data.firstNameAr;
    this.lastNameEn = data.lastNameEn;
    this.lastNameAr = data.lastNameAr;
    this.bioEn = data.bioEn;
    this.bioAr = data.bioAr;
    this.currentPositionEn = data.currentPositionEn;
    this.currentPositionAr = data.currentPositionAr;
    this.currentCompanyEn = data.currentCompanyEn;
    this.currentCompanyAr = data.currentCompanyAr;
    this.locationEn = data.locationEn;
    this.locationAr = data.locationAr;
    this.email = data.email;
    this.phoneNumber = data.phoneNumber;
    this.dateOfBirth = data.dateOfBirth;
    this.gender = data.gender;
    this.profileImageUrl = data.profileImageUrl;
    this.coverImageUrl = data.coverImageUrl;
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

  /** Display name for the given locale — falls back to EN if AR is missing */
  getFullName(locale: 'en' | 'ar' = 'en'): string {
    if (locale === 'ar') {
      const first = this.firstNameAr || this.firstNameEn;
      const last  = this.lastNameAr  || this.lastNameEn;
      return `${first} ${last}`.trim();
    }
    return `${this.firstNameEn} ${this.lastNameEn}`.trim();
  }

  getInitials(): string {
    return `${this.firstNameEn.charAt(0)}${this.lastNameEn.charAt(0)}`.toUpperCase();
  }

  verify(): PersonEntity {
    return new PersonEntity({ ...this, isVerified: true, updatedAt: new Date() });
  }

  claim(claimedById: string): PersonEntity {
    return new PersonEntity({ ...this, isClaimed: true, claimedBy: claimedById, updatedAt: new Date() });
  }

  unclaim(): PersonEntity {
    return new PersonEntity({ ...this, isClaimed: false, claimedBy: null, updatedAt: new Date() });
  }

  updateProfile(data: Partial<Person>): PersonEntity {
    return new PersonEntity({ ...this, ...data, updatedAt: new Date() });
  }

  addKeywords(newKeywords: string[]): PersonEntity {
    const existing = this.keywords || [];
    return new PersonEntity({
      ...this,
      keywords: Array.from(new Set([...existing, ...newKeywords])),
      updatedAt: new Date(),
    });
  }

  removeKeywords(keywordsToRemove: string[]): PersonEntity {
    const updated = (this.keywords || []).filter(k => !keywordsToRemove.includes(k));
    return new PersonEntity({
      ...this,
      keywords: updated.length > 0 ? updated : null,
      updatedAt: new Date(),
    });
  }

  updateTier(newTier: Tier): PersonEntity {
    return new PersonEntity({ ...this, tier: newTier, updatedAt: new Date() });
  }

  setProfileImage(imageUrl: string): PersonEntity {
    return new PersonEntity({ ...this, profileImageUrl: imageUrl, updatedAt: new Date() });
  }

  setCoverImage(imageUrl: string): PersonEntity {
    return new PersonEntity({ ...this, coverImageUrl: imageUrl, updatedAt: new Date() });
  }

  hasProfileImage(): boolean { return !!this.profileImageUrl; }
  hasCoverImage():   boolean { return !!this.coverImageUrl; }

  hasSocialLinks(): boolean {
    return !!(this.linkedinUrl || this.twitterUrl || this.instagramUrl || this.websiteUrl);
  }

  getAge(): number | null {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    let age = today.getFullYear() - this.dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())) age--;
    return age;
  }

  toJSON(): Person {
    return {
      id: this.id,
      firstNameEn: this.firstNameEn,
      firstNameAr: this.firstNameAr,
      lastNameEn: this.lastNameEn,
      lastNameAr: this.lastNameAr,
      bioEn: this.bioEn,
      bioAr: this.bioAr,
      currentPositionEn: this.currentPositionEn,
      currentPositionAr: this.currentPositionAr,
      currentCompanyEn: this.currentCompanyEn,
      currentCompanyAr: this.currentCompanyAr,
      locationEn: this.locationEn,
      locationAr: this.locationAr,
      email: this.email,
      phoneNumber: this.phoneNumber,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      profileImageUrl: this.profileImageUrl,
      coverImageUrl: this.coverImageUrl,
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
