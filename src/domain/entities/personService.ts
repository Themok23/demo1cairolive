export interface PersonService {
  id: string;
  personId: string;
  titleEn: string;
  titleAr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  imageUrl?: string | null;
  externalLink?: string | null;
  priceText?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
}

export class PersonServiceEntity implements PersonService {
  id: string;
  personId: string;
  titleEn: string;
  titleAr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  imageUrl?: string | null;
  externalLink?: string | null;
  priceText?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;

  constructor(data: PersonService) {
    this.id = data.id;
    this.personId = data.personId;
    this.titleEn = data.titleEn;
    this.titleAr = data.titleAr;
    this.descriptionEn = data.descriptionEn;
    this.descriptionAr = data.descriptionAr;
    this.imageUrl = data.imageUrl;
    this.externalLink = data.externalLink;
    this.priceText = data.priceText;
    this.displayOrder = data.displayOrder ?? 0;
    this.isActive = data.isActive ?? true;
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

  update(data: Partial<PersonService>): PersonServiceEntity {
    return new PersonServiceEntity({ ...this, ...data });
  }

  toJSON(): PersonService {
    return { ...this };
  }
}
