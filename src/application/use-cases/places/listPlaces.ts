import { Place, PlaceType, PlaceStatus } from '../../../domain/entities/place';
import { PlaceRepository } from '../../../domain/repositories/placeRepository';

export interface ListPlacesInput {
  limit?: number;
  offset?: number;
  pillarId?: string;
  type?: PlaceType;
  status?: PlaceStatus;
  isFeatured?: boolean;
  search?: string;
}

export interface ListPlacesResult {
  success: boolean;
  data?: { data: Place[]; total: number };
  error?: string;
}

export class ListPlacesUseCase {
  constructor(private placeRepository: PlaceRepository) {}

  async execute(input: ListPlacesInput = {}): Promise<ListPlacesResult> {
    try {
      const data = await this.placeRepository.findAll(input);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
