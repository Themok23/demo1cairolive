export type ExperienceType = 'visit' | 'book_review' | 'trip' | 'event';
export type ExperienceStatus = 'pending' | 'published' | 'rejected';

export interface Experience {
  id: string;
  slug: string;
  type: ExperienceType;
  pillarId?: string | null;
  placeId?: string | null;
  titleEn: string;
  titleAr?: string | null;
  summaryEn?: string | null;
  summaryAr?: string | null;
  contentEn?: string | null;
  contentAr?: string | null;
  coverImageUrl?: string | null;
  submittedByPersonId?: string | null;
  submittedByName?: string | null;
  submittedByEmail?: string | null;
  status: ExperienceStatus;
  rejectionReason?: string | null;
  likeCount: number;
  viewCount: number;
  createdAt: Date;
  publishedAt?: Date | null;
  updatedAt: Date;
}

export class ExperienceEntity implements Experience {
  id: string;
  slug: string;
  type: ExperienceType;
  pillarId?: string | null;
  placeId?: string | null;
  titleEn: string;
  titleAr?: string | null;
  summaryEn?: string | null;
  summaryAr?: string | null;
  contentEn?: string | null;
  contentAr?: string | null;
  coverImageUrl?: string | null;
  submittedByPersonId?: string | null;
  submittedByName?: string | null;
  submittedByEmail?: string | null;
  status: ExperienceStatus;
  rejectionReason?: string | null;
  likeCount: number;
  viewCount: number;
  createdAt: Date;
  publishedAt?: Date | null;
  updatedAt: Date;

  constructor(data: Experience) {
    this.id = data.id;
    this.slug = data.slug;
    this.type = data.type;
    this.pillarId = data.pillarId;
    this.placeId = data.placeId;
    this.titleEn = data.titleEn;
    this.titleAr = data.titleAr;
    this.summaryEn = data.summaryEn;
    this.summaryAr = data.summaryAr;
    this.contentEn = data.contentEn;
    this.contentAr = data.contentAr;
    this.coverImageUrl = data.coverImageUrl;
    this.submittedByPersonId = data.submittedByPersonId;
    this.submittedByName = data.submittedByName;
    this.submittedByEmail = data.submittedByEmail;
    this.status = data.status;
    this.rejectionReason = data.rejectionReason;
    this.likeCount = data.likeCount ?? 0;
    this.viewCount = data.viewCount ?? 0;
    this.createdAt = data.createdAt;
    this.publishedAt = data.publishedAt;
    this.updatedAt = data.updatedAt;
  }

  getTitle(locale: 'en' | 'ar' = 'en'): string {
    if (locale === 'ar' && this.titleAr) return this.titleAr;
    return this.titleEn;
  }

  getSummary(locale: 'en' | 'ar' = 'en'): string | null {
    if (locale === 'ar' && this.summaryAr) return this.summaryAr;
    return this.summaryEn ?? null;
  }

  getContent(locale: 'en' | 'ar' = 'en'): string | null {
    if (locale === 'ar' && this.contentAr) return this.contentAr;
    return this.contentEn ?? null;
  }

  toJSON(): Experience {
    return { ...this };
  }
}
