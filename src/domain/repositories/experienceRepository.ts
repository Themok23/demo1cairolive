import { Experience, ExperienceStatus } from '../entities/experience';

export interface ListPublishedParams {
  limit?: number;
  offset?: number;
  pillarId?: string;
  type?: string;
}

export interface ExperienceRepository {
  listPublished(params?: ListPublishedParams): Promise<Experience[]>;
  listByStatus(status: ExperienceStatus, opts?: { limit?: number }): Promise<Experience[]>;
  findBySlug(slug: string): Promise<Experience | null>;
  findById(id: string): Promise<Experience | null>;
  create(data: Omit<Experience, 'id' | 'likeCount' | 'viewCount' | 'createdAt' | 'updatedAt' | 'publishedAt'>): Promise<Experience>;
  updateStatus(id: string, status: 'published' | 'rejected', opts?: { rejectionReason?: string }): Promise<Experience | null>;
  countByStatus(status: ExperienceStatus): Promise<number>;
  addReaction(experienceId: string, type: 'like' | 'visited' | 'wishlist', userIdentifier: string): Promise<void>;
  removeReaction(experienceId: string, type: 'like' | 'visited' | 'wishlist', userIdentifier: string): Promise<void>;
  getUserReactions(experienceId: string, userIdentifier: string): Promise<string[]>;
}
