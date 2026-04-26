import { eq, like, and, or, asc, desc, sql, isNotNull } from 'drizzle-orm';
import { db } from '../db/client';
import { places, placePersons, persons } from '../db/schema';
import { Place, PlaceType, PlaceStatus } from '../../domain/entities/place';
import { PlaceRepository, PlaceWithPersons } from '../../domain/repositories/placeRepository';

export class DrizzlePlaceRepository implements PlaceRepository {
  private parsePlace(data: any): Place {
    return {
      ...data,
      type: data.type as PlaceType,
      status: data.status as PlaceStatus,
      isFeatured: data.isFeatured ?? false,
      latitude: data.latitude !== null && data.latitude !== undefined ? String(data.latitude) : null,
      longitude: data.longitude !== null && data.longitude !== undefined ? String(data.longitude) : null,
    };
  }

  async findById(id: string): Promise<Place | null> {
    const result = await db.select().from(places).where(eq(places.id, id)).limit(1);
    return result[0] ? this.parsePlace(result[0]) : null;
  }

  async findBySlug(slug: string): Promise<Place | null> {
    const result = await db.select().from(places).where(eq(places.slug, slug)).limit(1);
    return result[0] ? this.parsePlace(result[0]) : null;
  }

  async findBySlugWithPersons(slug: string): Promise<PlaceWithPersons | null> {
    const place = await this.findBySlug(slug);
    if (!place) return null;
    const associatedPersons = await this.listPersonsForPlace(place.id);
    return { ...place, associatedPersons };
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    pillarId?: string;
    type?: PlaceType;
    status?: PlaceStatus;
    isFeatured?: boolean;
    search?: string;
  }): Promise<{ data: Place[]; total: number }> {
    const limit  = options?.limit  ?? 50;
    const offset = options?.offset ?? 0;

    const conditions = [];
    if (options?.pillarId)   conditions.push(eq(places.pillarId, options.pillarId));
    if (options?.type)       conditions.push(eq(places.type, options.type));
    if (options?.status)     conditions.push(eq(places.status, options.status));
    if (typeof options?.isFeatured === 'boolean') {
      conditions.push(eq(places.isFeatured, options.isFeatured));
    }
    if (options?.search) {
      conditions.push(
        or(
          like(places.nameEn, `%${options.search}%`),
          like(places.nameAr, `%${options.search}%`),
          like(places.locationEn, `%${options.search}%`),
          like(places.slug, `%${options.search}%`)
        )
      );
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select()
      .from(places)
      .where(whereClause)
      .orderBy(desc(places.isFeatured), desc(places.createdAt))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(places)
      .where(whereClause);

    return {
      data: data.map((d) => this.parsePlace(d)),
      total: Number(countResult[0]?.count ?? 0),
    };
  }

  async findPublishedByPillar(pillarId: string, limit = 24): Promise<Place[]> {
    const data = await db
      .select()
      .from(places)
      .where(and(eq(places.pillarId, pillarId), eq(places.status, 'published')))
      .orderBy(desc(places.isFeatured), desc(places.createdAt))
      .limit(limit);
    return data.map((d) => this.parsePlace(d));
  }

  async findAllWithCoordinates(): Promise<Place[]> {
    const data = await db
      .select()
      .from(places)
      .where(
        and(
          eq(places.status, 'published'),
          isNotNull(places.latitude),
          isNotNull(places.longitude)
        )
      )
      .orderBy(asc(places.nameEn));
    return data.map((d) => this.parsePlace(d));
  }

  async create(place: Place): Promise<Place> {
    const values: any = {
      ...place,
      latitude: place.latitude ? String(place.latitude) : null,
      longitude: place.longitude ? String(place.longitude) : null,
    };
    const result = await db.insert(places).values(values).returning();
    return this.parsePlace(result[0]);
  }

  async update(id: string, place: Partial<Place>): Promise<Place | null> {
    const values: any = { updatedAt: new Date() };
    for (const k of Object.keys(place) as (keyof Place)[]) {
      if (place[k] !== undefined) {
        if (k === 'latitude' || k === 'longitude') {
          values[k] = place[k] !== null ? String(place[k]) : null;
        } else {
          values[k] = place[k];
        }
      }
    }
    const result = await db.update(places).set(values).where(eq(places.id, id)).returning();
    return result[0] ? this.parsePlace(result[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    // Cascade-delete the M2M links first.
    await db.delete(placePersons).where(eq(placePersons.placeId, id));
    const result = await db.delete(places).where(eq(places.id, id)).returning();
    return result.length > 0;
  }

  async linkPerson(
    placeId: string,
    personId: string,
    role: string,
    roleEn?: string,
    roleAr?: string,
    displayOrder = 0
  ): Promise<void> {
    await db
      .insert(placePersons)
      .values({
        placeId,
        personId,
        role,
        roleEn: roleEn ?? null,
        roleAr: roleAr ?? null,
        displayOrder,
        createdAt: new Date(),
      })
      .onConflictDoNothing();
  }

  async unlinkPerson(placeId: string, personId: string, role: string): Promise<boolean> {
    const result = await db
      .delete(placePersons)
      .where(
        and(
          eq(placePersons.placeId, placeId),
          eq(placePersons.personId, personId),
          eq(placePersons.role, role)
        )
      )
      .returning();
    return result.length > 0;
  }

  async listPersonsForPlace(placeId: string): Promise<PlaceWithPersons['associatedPersons']> {
    const rows = await db
      .select({
        placeId: placePersons.placeId,
        personId: placePersons.personId,
        role: placePersons.role,
        roleEn: placePersons.roleEn,
        roleAr: placePersons.roleAr,
        displayOrder: placePersons.displayOrder,
        createdAt: placePersons.createdAt,
        firstNameEn: persons.firstNameEn,
        firstNameAr: persons.firstNameAr,
        lastNameEn: persons.lastNameEn,
        lastNameAr: persons.lastNameAr,
        profileImageUrl: persons.profileImageUrl,
        tier: persons.tier,
      })
      .from(placePersons)
      .innerJoin(persons, eq(placePersons.personId, persons.id))
      .where(eq(placePersons.placeId, placeId))
      .orderBy(asc(placePersons.displayOrder));
    return rows as any;
  }
}
