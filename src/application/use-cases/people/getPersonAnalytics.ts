import { PersonRepository } from '../../../domain/repositories/personRepository';
import { KrtkInquiryRepository } from '../../../domain/repositories/krtkInquiryRepository';

export interface PersonAnalyticsData {
  firstNameEn: string;
  lastNameEn: string;
  firstNameAr: string | null;
  lastNameAr: string | null;
  viewCount: number;
  shareCount: number;
  inquiryCount: number;
}

export class GetPersonAnalyticsUseCase {
  constructor(
    private personRepo: PersonRepository,
    private inquiryRepo: KrtkInquiryRepository,
  ) {}

  async execute(personId: string): Promise<{ success: boolean; data?: PersonAnalyticsData; error?: string }> {
    const person = await this.personRepo.findById(personId);
    if (!person) return { success: false, error: 'Not found' };

    const inquiryCount = await this.inquiryRepo.countBySlug(personId);
    const raw = person as unknown as Record<string, unknown>;

    return {
      success: true,
      data: {
        firstNameEn: person.firstNameEn,
        lastNameEn: person.lastNameEn,
        firstNameAr: person.firstNameAr ?? null,
        lastNameAr: person.lastNameAr ?? null,
        viewCount: typeof raw.viewCount === 'number' ? raw.viewCount : 0,
        shareCount: typeof raw.shareCount === 'number' ? raw.shareCount : 0,
        inquiryCount,
      },
    };
  }
}
