export interface Pillar {
  id: string;
  slug: string;
  nameEn: string;
  nameAr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  iconKey?: string | null;
  coverImageUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class PillarEntity implements Pillar {
  id: string;
  slug: string;
  nameEn: string;
  nameAr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  iconKey?: string | null;
  coverImageUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Pillar) {
    this.id = data.id;
    this.slug = data.slug;
    this.nameEn = data.nameEn;
    this.nameAr = data.nameAr;
    this.descriptionEn = data.descriptionEn;
    this.descriptionAr = data.descriptionAr;
    this.iconKey = data.iconKey;
    this.coverImageUrl = data.coverImageUrl;
    this.displayOrder = data.displayOrder;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /** Localized name — falls back to EN if AR is missing */
  getName(locale: 'en' | 'ar' = 'en'): string {
    if (locale === 'ar' && this.nameAr) return this.nameAr;
    return this.nameEn;
  }

  /** Localized description — falls back to EN if AR is missing */
  getDescription(locale: 'en' | 'ar' = 'en'): string | null {
    if (locale === 'ar' && this.descriptionAr) return this.descriptionAr;
    return this.descriptionEn ?? null;
  }

  activate(): PillarEntity {
    return new PillarEntity({ ...this, isActive: true, updatedAt: new Date() });
  }

  deactivate(): PillarEntity {
    return new PillarEntity({ ...this, isActive: false, updatedAt: new Date() });
  }

  updatePillar(data: Partial<Pillar>): PillarEntity {
    return new PillarEntity({ ...this, ...data, updatedAt: new Date() });
  }

  setDisplayOrder(order: number): PillarEntity {
    return new PillarEntity({ ...this, displayOrder: order, updatedAt: new Date() });
  }

  toJSON(): Pillar {
    return {
      id: this.id,
      slug: this.slug,
      nameEn: this.nameEn,
      nameAr: this.nameAr,
      descriptionEn: this.descriptionEn,
      descriptionAr: this.descriptionAr,
      iconKey: this.iconKey,
      coverImageUrl: this.coverImageUrl,
      displayOrder: this.displayOrder,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
