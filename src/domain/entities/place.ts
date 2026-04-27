export type PlaceType = 'restaurant' | 'museum' | 'landmark' | 'cafe' | 'shop' | 'gallery' | 'hotel';
export type PlaceStatus = 'draft' | 'published' | 'archived';

export interface Place {
  id: string;
  slug: string;
  pillarId: string;
  type: PlaceType;
  nameEn: string;
  nameAr?: string | null;
  taglineEn?: string | null;
  taglineAr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  locationEn?: string | null;
  locationAr?: string | null;
  mapUrl?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  phone?: string | null;
  email?: string | null;
  websiteUrl?: string | null;
  instagramUrl?: string | null;
  openingHoursJson?: string | null;
  coverImageUrl?: string | null;
  galleryImagesJson?: string | null;
  isFeatured: boolean;
  status: PlaceStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlacePerson {
  placeId: string;
  personId: string;
  role: string;        // canonical role key: 'chef', 'owner', 'curator', etc.
  roleEn?: string | null;
  roleAr?: string | null;
  displayOrder: number;
  createdAt: Date;
}

export class PlaceEntity implements Place {
  id!: string;
  slug!: string;
  pillarId!: string;
  type!: PlaceType;
  nameEn!: string;
  nameAr?: string | null;
  taglineEn?: string | null;
  taglineAr?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  locationEn?: string | null;
  locationAr?: string | null;
  mapUrl?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  phone?: string | null;
  email?: string | null;
  websiteUrl?: string | null;
  instagramUrl?: string | null;
  openingHoursJson?: string | null;
  coverImageUrl?: string | null;
  galleryImagesJson?: string | null;
  isFeatured!: boolean;
  status!: PlaceStatus;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: Place) {
    Object.assign(this, data);
    this.isFeatured = data.isFeatured ?? false;
    this.status = data.status ?? 'draft';
  }

  /** Localized name — falls back to EN if AR is missing */
  getName(locale: 'en' | 'ar' = 'en'): string {
    if (locale === 'ar' && this.nameAr) return this.nameAr;
    return this.nameEn;
  }

  getTagline(locale: 'en' | 'ar' = 'en'): string | null {
    if (locale === 'ar' && this.taglineAr) return this.taglineAr;
    return this.taglineEn ?? null;
  }

  getLocation(locale: 'en' | 'ar' = 'en'): string | null {
    if (locale === 'ar' && this.locationAr) return this.locationAr;
    return this.locationEn ?? null;
  }

  getDescription(locale: 'en' | 'ar' = 'en'): string | null {
    if (locale === 'ar' && this.descriptionAr) return this.descriptionAr;
    return this.descriptionEn ?? null;
  }

  /** Parsed gallery image URLs (empty array if none stored) */
  getGalleryImages(): string[] {
    if (!this.galleryImagesJson) return [];
    try {
      const parsed = JSON.parse(this.galleryImagesJson);
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
    } catch {
      return [];
    }
  }

  /** Has GPS coordinates that can be plotted on a map */
  hasCoordinates(): boolean {
    return !!(this.latitude && this.longitude);
  }

  publish(): PlaceEntity {
    return new PlaceEntity({ ...this, status: 'published', updatedAt: new Date() });
  }

  archive(): PlaceEntity {
    return new PlaceEntity({ ...this, status: 'archived', updatedAt: new Date() });
  }

  feature(): PlaceEntity {
    return new PlaceEntity({ ...this, isFeatured: true, updatedAt: new Date() });
  }

  unfeature(): PlaceEntity {
    return new PlaceEntity({ ...this, isFeatured: false, updatedAt: new Date() });
  }

  updatePlace(data: Partial<Place>): PlaceEntity {
    return new PlaceEntity({ ...this, ...data, updatedAt: new Date() });
  }

  toJSON(): Place {
    return { ...this };
  }
}
