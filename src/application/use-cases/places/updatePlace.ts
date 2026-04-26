import { z } from 'zod';
import { Place } from '../../../domain/entities/place';
import { PlaceRepository } from '../../../domain/repositories/placeRepository';

const PlaceTypeEnum = z.enum(['restaurant', 'museum', 'landmark', 'cafe', 'shop', 'gallery', 'hotel']);
const PlaceStatusEnum = z.enum(['draft', 'published', 'archived']);

const UpdatePlaceSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  pillarId: z.string().optional(),
  type: PlaceTypeEnum.optional(),
  nameEn: z.string().min(1).max(200).optional(),
  nameAr: z.string().max(200).nullable().optional(),
  taglineEn: z.string().max(280).nullable().optional(),
  taglineAr: z.string().max(280).nullable().optional(),
  descriptionEn: z.string().nullable().optional(),
  descriptionAr: z.string().nullable().optional(),
  locationEn: z.string().max(255).nullable().optional(),
  locationAr: z.string().max(255).nullable().optional(),
  mapUrl: z.string().nullable().optional(),
  latitude: z.union([z.string(), z.number()]).nullable().optional(),
  longitude: z.union([z.string(), z.number()]).nullable().optional(),
  phone: z.string().max(30).nullable().optional(),
  email: z.string().email().nullable().optional(),
  websiteUrl: z.string().nullable().optional(),
  instagramUrl: z.string().nullable().optional(),
  openingHoursJson: z.string().nullable().optional(),
  coverImageUrl: z.string().nullable().optional(),
  galleryImagesJson: z.string().nullable().optional(),
  isFeatured: z.boolean().optional(),
  status: PlaceStatusEnum.optional(),
});

export type UpdatePlaceInput = z.infer<typeof UpdatePlaceSchema>;

export interface UpdatePlaceResult {
  success: boolean;
  data?: Place;
  error?: string;
}

export class UpdatePlaceUseCase {
  constructor(private placeRepository: PlaceRepository) {}

  async execute(id: string, input: UpdatePlaceInput): Promise<UpdatePlaceResult> {
    try {
      const validated = UpdatePlaceSchema.parse(input);

      // Slug uniqueness on rename.
      if (validated.slug) {
        const existing = await this.placeRepository.findBySlug(validated.slug);
        if (existing && existing.id !== id) {
          return { success: false, error: 'A place with this slug already exists' };
        }
      }

      // Coerce numeric coordinates to strings for the decimal column.
      const updates: any = { ...validated };
      if (updates.latitude !== undefined && updates.latitude !== null) {
        updates.latitude = String(updates.latitude);
      }
      if (updates.longitude !== undefined && updates.longitude !== null) {
        updates.longitude = String(updates.longitude);
      }

      const updated = await this.placeRepository.update(id, updates);
      if (!updated) return { success: false, error: 'Place not found' };
      return { success: true, data: updated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: `Validation error: ${error.errors[0].message}` };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
