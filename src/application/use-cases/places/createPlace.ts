import { z } from 'zod';
import { randomUUID } from 'crypto';
import { Place, PlaceType, PlaceStatus } from '../../../domain/entities/place';
import { PlaceRepository } from '../../../domain/repositories/placeRepository';

const SlugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only');

const PlaceTypeEnum = z.enum(['restaurant', 'museum', 'landmark', 'cafe', 'shop', 'gallery', 'hotel']);
const PlaceStatusEnum = z.enum(['draft', 'published', 'archived']);

const CreatePlaceSchema = z.object({
  slug: SlugSchema,
  pillarId: z.string().min(1),
  type: PlaceTypeEnum,
  nameEn: z.string().min(1).max(200),
  nameAr: z.string().max(200).optional(),
  taglineEn: z.string().max(280).optional(),
  taglineAr: z.string().max(280).optional(),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  locationEn: z.string().max(255).optional(),
  locationAr: z.string().max(255).optional(),
  mapUrl: z.string().optional(),
  latitude: z.union([z.string(), z.number()]).optional(),
  longitude: z.union([z.string(), z.number()]).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email().optional(),
  websiteUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  openingHoursJson: z.string().optional(),
  coverImageUrl: z.string().optional(),
  galleryImagesJson: z.string().optional(),
  isFeatured: z.boolean().optional(),
  status: PlaceStatusEnum.optional(),
});

export type CreatePlaceInput = z.infer<typeof CreatePlaceSchema>;

export interface CreatePlaceResult {
  success: boolean;
  data?: Place;
  error?: string;
}

export class CreatePlaceUseCase {
  constructor(private placeRepository: PlaceRepository) {}

  async execute(input: CreatePlaceInput): Promise<CreatePlaceResult> {
    try {
      const validated = CreatePlaceSchema.parse(input);

      const existing = await this.placeRepository.findBySlug(validated.slug);
      if (existing) {
        return { success: false, error: 'A place with this slug already exists' };
      }

      const now = new Date();
      const place: Place = {
        id: randomUUID(),
        slug: validated.slug,
        pillarId: validated.pillarId,
        type: validated.type as PlaceType,
        nameEn: validated.nameEn,
        nameAr: validated.nameAr ?? null,
        taglineEn: validated.taglineEn ?? null,
        taglineAr: validated.taglineAr ?? null,
        descriptionEn: validated.descriptionEn ?? null,
        descriptionAr: validated.descriptionAr ?? null,
        locationEn: validated.locationEn ?? null,
        locationAr: validated.locationAr ?? null,
        mapUrl: validated.mapUrl ?? null,
        latitude: validated.latitude !== undefined ? String(validated.latitude) : null,
        longitude: validated.longitude !== undefined ? String(validated.longitude) : null,
        phone: validated.phone ?? null,
        email: validated.email ?? null,
        websiteUrl: validated.websiteUrl ?? null,
        instagramUrl: validated.instagramUrl ?? null,
        openingHoursJson: validated.openingHoursJson ?? null,
        coverImageUrl: validated.coverImageUrl ?? null,
        galleryImagesJson: validated.galleryImagesJson ?? null,
        isFeatured: validated.isFeatured ?? false,
        status: (validated.status ?? 'draft') as PlaceStatus,
        createdAt: now,
        updatedAt: now,
      };

      const created = await this.placeRepository.create(place);
      return { success: true, data: created };
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
