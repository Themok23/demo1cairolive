import { KrtkInquiry } from '../entities/krtkInquiry';

export interface CreateInquiryData {
  krtkSlug: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string | null;
  subject?: string | null;
  message: string;
  metaJson?: string | null;
}

export interface KrtkInquiryRepository {
  create(data: CreateInquiryData): Promise<KrtkInquiry>;
  listBySlug(krtkSlug: string, limit?: number, offset?: number): Promise<KrtkInquiry[]>;
  listAll(limit?: number, offset?: number): Promise<KrtkInquiry[]>;
  countAll(): Promise<number>;
  countBySlug(krtkSlug: string): Promise<number>;
  findById(id: string): Promise<KrtkInquiry | null>;
  markRead(id: string): Promise<KrtkInquiry>;
  markForwarded(id: string, forwardedTo: string): Promise<KrtkInquiry>;
  markArchived(id: string): Promise<KrtkInquiry>;
}
