import { Place } from '../../../domain/entities/place';
import { PlaceRepository, PlaceWithPersons } from '../../../domain/repositories/placeRepository';

export interface GetPlaceResult {
  success: boolean;
  data?: Place;
  error?: string;
}

export interface GetPlaceWithPersonsResult {
  success: boolean;
  data?: PlaceWithPersons;
  error?: string;
}

export class GetPlaceUseCase {
  constructor(private placeRepository: PlaceRepository) {}

  async executeById(id: string): Promise<GetPlaceResult> {
    try {
      const place = await this.placeRepository.findById(id);
      if (!place) return { success: false, error: 'Place not found' };
      return { success: true, data: place };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async executeBySlug(slug: string): Promise<GetPlaceResult> {
    try {
      const place = await this.placeRepository.findBySlug(slug);
      if (!place) return { success: false, error: 'Place not found' };
      return { success: true, data: place };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async executeBySlugWithPersons(slug: string): Promise<GetPlaceWithPersonsResult> {
    try {
      const place = await this.placeRepository.findBySlugWithPersons(slug);
      if (!place) return { success: false, error: 'Place not found' };
      return { success: true, data: place };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
