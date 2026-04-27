export interface PersonWorkplace {
  id: string;
  personId: string;
  companyEn: string;
  companyAr?: string | null;
  positionEn?: string | null;
  positionAr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  fromDate?: Date | null;
  toDate?: Date | null;
  isCurrent: boolean;
  imageUrl?: string | null;
  displayOrder: number;
  createdAt: Date;
}

export class PersonWorkplaceEntity implements PersonWorkplace {
  id: string;
  personId: string;
  companyEn: string;
  companyAr?: string | null;
  positionEn?: string | null;
  positionAr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  fromDate?: Date | null;
  toDate?: Date | null;
  isCurrent: boolean;
  imageUrl?: string | null;
  displayOrder: number;
  createdAt: Date;

  constructor(data: PersonWorkplace) {
    this.id = data.id;
    this.personId = data.personId;
    this.companyEn = data.companyEn;
    this.companyAr = data.companyAr;
    this.positionEn = data.positionEn;
    this.positionAr = data.positionAr;
    this.descriptionEn = data.descriptionEn;
    this.descriptionAr = data.descriptionAr;
    this.fromDate = data.fromDate;
    this.toDate = data.toDate;
    this.isCurrent = data.isCurrent ?? false;
    this.imageUrl = data.imageUrl;
    this.displayOrder = data.displayOrder ?? 0;
    this.createdAt = data.createdAt;
  }

  getCompany(locale: 'en' | 'ar' = 'en'): string {
    if (locale === 'ar' && this.companyAr) return this.companyAr;
    return this.companyEn;
  }

  getPosition(locale: 'en' | 'ar' = 'en'): string | null {
    if (locale === 'ar' && this.positionAr) return this.positionAr;
    return this.positionEn ?? null;
  }

  getDescription(locale: 'en' | 'ar' = 'en'): string | null {
    if (locale === 'ar' && this.descriptionAr) return this.descriptionAr;
    return this.descriptionEn ?? null;
  }

  update(data: Partial<PersonWorkplace>): PersonWorkplaceEntity {
    return new PersonWorkplaceEntity({ ...this, ...data });
  }

  toJSON(): PersonWorkplace {
    return { ...this };
  }
}
