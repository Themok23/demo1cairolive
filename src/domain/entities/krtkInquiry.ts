export interface KrtkInquiry {
  id: string;
  krtkSlug: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string | null;
  subject?: string | null;
  message: string;
  status: 'new' | 'read' | 'forwarded' | 'archived';
  forwardedAt?: Date | null;
  forwardedTo?: string | null;
  metaJson?: string | null;
  createdAt: Date;
}
