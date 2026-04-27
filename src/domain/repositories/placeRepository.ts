import { Place, PlacePerson, PlaceType, PlaceStatus } from '../entities/place';

export interface PlaceWithPersons extends Place {
  associatedPersons: Array<PlacePerson & {
    firstNameEn: string;
    firstNameAr: string | null;
    lastNameEn: string;
    lastNameAr: string | null;
    profileImageUrl: string | null;
    tier: string;
  }>;
}

export interface PlaceRepository {
  findById(id: string): Promise<Place | null>;
  findBySlug(slug: string): Promise<Place | null>;
  findBySlugWithPersons(slug: string): Promise<PlaceWithPersons | null>;
  findAll(options?: {
    limit?: number;
    offset?: number;
    pillarId?: string;
    type?: PlaceType;
    status?: PlaceStatus;
    isFeatured?: boolean;
    search?: string;
  }): Promise<{ data: Place[]; total: number }>;
  /** Used by pillar landing page — published places in a pillar, ordered. */
  findPublishedByPillar(pillarId: string, limit?: number): Promise<Place[]>;
  /** Used by map view — every published place that has GPS coordinates. */
  findAllWithCoordinates(): Promise<Place[]>;
  create(place: Place): Promise<Place>;
  update(id: string, place: Partial<Place>): Promise<Place | null>;
  delete(id: string): Promise<boolean>;

  // Place ↔ Person M2M (Decision 4: many-to-many with role label)
  linkPerson(placeId: string, personId: string, role: string, roleEn?: string, roleAr?: string, displayOrder?: number): Promise<void>;
  unlinkPerson(placeId: string, personId: string, role: string): Promise<boolean>;
  listPersonsForPlace(placeId: string): Promise<PlaceWithPersons['associatedPersons']>;
}
