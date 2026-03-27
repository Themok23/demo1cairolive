import { eq, like, and, desc, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { persons } from '../db/schema';
import { Person } from '../../domain/entities/person';
import { PersonRepository } from '../../domain/repositories/personRepository';

export class DrizzlePersonRepository implements PersonRepository {
  async findById(id: string): Promise<Person | null> {
    const result = await db.query.persons.findFirst({
      where: eq(persons.id, id),
    });
    return result || null;
  }

  async findByEmail(email: string): Promise<Person | null> {
    const result = await db.query.persons.findFirst({
      where: eq(persons.email, email),
    });
    return result || null;
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    tier?: string;
    search?: string;
  }): Promise<{ data: Person[]; total: number }> {
    const limit = options?.limit || 20;
    const offset = options?.offset || 0;

    let query = db.select().from(persons);

    if (options?.tier) {
      query = query.where(eq(persons.tier, options.tier));
    }

    if (options?.search) {
      query = query.where(
        or(
          like(persons.firstName, `%${options.search}%`),
          like(persons.lastName, `%${options.search}%`)
        )
      );
    }

    const data = await query
      .orderBy(desc(persons.createdAt))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(persons);

    const total = countResult[0]?.count || 0;

    return { data: data as Person[], total };
  }

  async create(person: Person): Promise<Person> {
    const [created] = await db
      .insert(persons)
      .values({
        id: person.id,
        firstName: person.firstName,
        lastName: person.lastName,
        email: person.email,
        phoneNumber: person.phoneNumber,
        dateOfBirth: person.dateOfBirth,
        gender: person.gender,
        bio: person.bio,
        profileImageUrl: person.profileImageUrl,
        coverImageUrl: person.coverImageUrl,
        currentPosition: person.currentPosition,
        currentCompany: person.currentCompany,
        location: person.location,
        tier: person.tier,
        isVerified: person.isVerified,
        isClaimed: person.isClaimed,
        claimedBy: person.claimedBy,
        keywords: person.keywords ? JSON.stringify(person.keywords) : null,
        linkedinUrl: person.linkedinUrl,
        twitterUrl: person.twitterUrl,
        instagramUrl: person.instagramUrl,
        websiteUrl: person.websiteUrl,
        createdAt: person.createdAt,
        updatedAt: person.updatedAt,
      })
      .returning();

    return created as Person;
  }

  async update(id: string, person: Partial<Person>): Promise<Person | null> {
    const [updated] = await db
      .update(persons)
      .set({
        ...person,
        updatedAt: new Date(),
        keywords: person.keywords ? JSON.stringify(person.keywords) : undefined,
      })
      .where(eq(persons.id, id))
      .returning();

    return updated ? (updated as Person) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(persons).where(eq(persons.id, id));
    return result.rowCount > 0;
  }

  async claimProfile(id: string, claimedBy: string): Promise<Person | null> {
    const [updated] = await db
      .update(persons)
      .set({
        isClaimed: true,
        claimedBy,
        updatedAt: new Date(),
      })
      .where(eq(persons.id, id))
      .returning();

    return updated ? (updated as Person) : null;
  }

  async countByTier(tier: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(persons)
      .where(eq(persons.tier, tier));

    return result[0]?.count || 0;
  }

  async searchByName(firstName: string, lastName: string): Promise<Person[]> {
    const results = await db
      .select()
      .from(persons)
      .where(
        and(
          like(persons.firstName, `%${firstName}%`),
          like(persons.lastName, `%${lastName}%`)
        )
      );

    return results as Person[];
  }
}

function or(...conditions: any[]): any {
  // Implementation will be based on drizzle-orm's or helper
  return conditions[0]; // Placeholder
}
