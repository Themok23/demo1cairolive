import { SearchRepository, SearchResult } from '../../../domain/repositories/searchRepository';

export type { SearchResultKind, SearchResult } from '../../../domain/repositories/searchRepository';

export interface UnifiedSearchParams {
  q: string;
  limit?: number;
}

export class UnifiedSearchUseCase {
  constructor(private repo: SearchRepository) {}

  async execute({ q, limit = 20 }: UnifiedSearchParams): Promise<{ success: true; data: SearchResult[] }> {
    if (!q || q.trim().length < 2) return { success: true, data: [] };
    const data = await this.repo.search({ q, limit });
    return { success: true, data };
  }
}
