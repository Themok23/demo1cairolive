export interface PersonAchievement {
  id: string;
  personId: string;
  titleEn: string;
  titleAr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  imageUrl?: string | null;
  iconKey?: string | null;
  externalLink?: string | null;
  relatedArticleId?: string | null;
  displayOrder: number;
  createdAt: Date;
}

export class PersonAchievementEntity implements PersonAchievement {
  id: string;
  personId: string;
  titleEn: string;
  titleAr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  imageUrl?: string | null;
  iconKey?: string | null;
  externalLink?: string | null;
  relatedArticleId?: string | null;
  displayOrder: number;
  createdAt: Date;

  constructor(data: PersonAchievement) {
    this.id = data.id;
    this.personId = data.personId;
    this.titleEn = data.titleEn;
    this.titleAr = data.titleAr;
    this.descriptionEn = data.descriptionEn;
    this.descriptionAr = data.descriptionAr;
    this.imageUrl = data.imageUrl;
    this.iconKey = data.iconKey;
    this.externalLink = data.externalLink;
    this.relatedArticleId = data.relatedArticleId;
    this.displayOrder = data.displayOrder ?? 0;
    this.createdAt = data.createdAt;
  }

  getTitle(locale: 'en' | 'ar' = 'en'): string {
    if (locale === 'ar' && this.titleAr) return this.titleAr;
    return this.titleEn;
  }

  getDescription(locale: 'en' | 'ar' = 'en'): string | null {
    if (locale === 'ar' && this.descriptionAr) return this.descriptionAr;
    return this.descriptionEn ?? null;
  }

  update(data: Partial<PersonAchievement>): PersonAchievementEntity {
    return new PersonAchievementEntity({ ...this, ...data });
  }

  toJSON(): PersonAchievement {
    return { ...this };
  }
}
