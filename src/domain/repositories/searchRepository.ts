export type SearchResultKind = 'person' | 'article' | 'pillar' | 'place' | 'experience';

export interface SearchResult {
  kind: SearchResultKind;
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string | null;
  snippet: string | null;
}

export interface SearchParams {
  q: string;
  limit?: number;
}

export interface SearchRepository {
  search(params: SearchParams): Promise<SearchResult[]>;
}
