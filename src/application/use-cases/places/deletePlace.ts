import { PlaceRepository } from '../../../domain/repositories/placeRepository';

export interface DeletePlaceResult {
  success: boolean;
  error?: string;
}

export class DeletePlaceUseCase {
  constructor(private placeRepository: PlaceRepository) {}

  async execute(id: string): Promise<DeletePlaceResult> {
    try {
      const deleted = await this.placeRepository.delete(id);
      if (!deleted) return { success: false, error: 'Place not found' };
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
