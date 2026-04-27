import { Pillar } from '../entities/pillar';

export interface PillarRepository {
  findById(id: string): Promise<Pillar | null>;
  findBySlug(slug: string): Promise<Pillar | null>;
  findAll(options?: {
    limit?: number;
    offset?: number;
    isActive?: boolean;
    search?: string;
  }): Promise<{ data: Pillar[]; total: number }>;
  /** Returns active pillars sorted by displayOrder then name. Used by the public nav menu. */
  findActiveOrdered(): Promise<Pillar[]>;
  create(pillar: Pillar): Promise<Pillar>;
  update(id: string, pillar: Partial<Pillar>): Promise<Pillar | null>;
  delete(id: string): Promise<boolean>;
  /** Bulk reorder: takes [{ id, displayOrder }] tuples. */
  reorder(updates: Array<{ id: string; displayOrder: number }>): Promise<void>;
}
