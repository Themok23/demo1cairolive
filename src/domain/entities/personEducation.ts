export interface PersonEducation {
  id: string;
  personId: string;
  institutionEn: string;
  institutionAr?: string | null;
  degreeEn?: string | null;
  degreeAr?: string | null;
  fieldEn?: string | null;
  fieldAr?: string | null;
  fromYear?: number | null;
  toYear?: number | null;
  imageUrl?: string | null;
  displayOrder: number;
  createdAt: Date;
}

export class PersonEducationEntity implements PersonEducation {
  id: string;
  personId: string;
  institutionEn: string;
  institutionAr?: string | null;
  degreeEn?: string | null;
  degreeAr?: string | null;
  fieldEn?: string | null;
  fieldAr?: string | null;
  fromYear?: number | null;
  toYear?: number | null;
  imageUrl?: string | null;
  displayOrder: number;
  createdAt: Date;

  constructor(data: PersonEducation) {
    this.id = data.id;
    this.personId = data.personId;
    this.institutionEn = data.institutionEn;
    this.institutionAr = data.institutionAr;
    this.degreeEn = data.degreeEn;
    this.degreeAr = data.degreeAr;
    this.fieldEn = data.fieldEn;
    this.fieldAr = data.fieldAr;
    this.fromYear = data.fromYear;
    this.toYear = data.toYear;
    this.imageUrl = data.imageUrl;
    this.displayOrder = data.displayOrder ?? 0;
    this.createdAt = data.createdAt;
  }

  getInstitution(locale: 'en' | 'ar' = 'en'): string {
    if (locale === 'ar' && this.institutionAr) return this.institutionAr;
    return this.institutionEn;
  }

  getDegree(locale: 'en' | 'ar' = 'en'): string | null {
    if (locale === 'ar' && this.degreeAr) return this.degreeAr;
    return this.degreeEn ?? null;
  }

  getField(locale: 'en' | 'ar' = 'en'): string | null {
    if (locale === 'ar' && this.fieldAr) return this.fieldAr;
    return this.fieldEn ?? null;
  }

  update(data: Partial<PersonEducation>): PersonEducationEntity {
    return new PersonEducationEntity({ ...this, ...data });
  }

  toJSON(): PersonEducation {
    return { ...this };
  }
}
