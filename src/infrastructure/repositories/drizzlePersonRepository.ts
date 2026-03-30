import { eq, like, and, or, desc, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { persons } from '../db/schema';
import { Person } from '../../domain/entities/person';
import { PersonRepository } from '../../domain/repositories/personRepository';

export class DrizzlePersonRepository implements PersonRepository {
  private parsePerson(data: any): Person {
    return {
      ...data,
      gender: data.gender as any,
      tier: data.tier as any,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      keywords: data.keywords ? JSON.parse(data.keywords) : undefined,
    };
  }

  async findById(id: string): Promise<Person | null> {
    const result = await db.query.persons.findFirst({
      where: eq(persons.id, id),
    });
    return result ? this.parsePerson(result) : null;
  }

  async findByEmail(email: string): Promise<Person | null> {
    const result = await db.query.persons.findFirst({
      where: eq(persons.email, email),
    });
    return result ? this.parsePerson(result) : null;
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    tier?: string;
    search?: string;
  }): Promise<{ data: Person[]; total: number }> {
    const limit = options?.limit || 20;
    const offset = options?.offset || 0;

    const conditions = [];

    if (options?.tier) {
      conditions.push(eq(persons.tier, options.tier));
    }

    if (options?.search) {
      conditions.push(
        or(
          like(persons.firstName, `%${options.search}%`),
          like(persons.lastName, `%${options.search}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db
      .select()
      .from(persons)
      .where(whereClause)
      .orderBy(desc(persons.createdAt))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(persons)
      .where(whereClause);

    const total = countResult[0]?.count || 0;

    return { data: data.map(d => this.parsePerson(d)), total };
  }

  async create(person: Person): Promise<Person> {
    const values: any = {
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.email,
      phoneNumber: person.phoneNumber,
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
    };

    if (person.dateOfBirth) {
      values.dateOfBirth = person.dateOfBirth;
    }

    const [created] = await db
      .insert(persons)
      .values(values)
      .returning();

    return this.parsePerson(created);
  }

  async update(id: string, person: Partial<Person>): Promise<Person | null> {
    const updates: any = {
      updatedAt: new Date(),
    };

    if (person.firstName !== undefined) updates.firstName = person.firstName;
    if (person.lastName !== undefined) updates.lastName = person.lastName;
    if (person.email !== undefined) updates.email = person.email;
    if (person.phoneNumber !== undefined) updates.phoneNumber = person.phoneNumber;
    if (person.dateOfBirth !== undefined) updates.dateOfBirth = person.dateOfBirth;
    if (person.gender !== undefined) updates.gender = person.gender;
    if (person.bio !== undefined) updates.bio = person.bio;
    if (person.profileImageUrl !== undefined) updates.profileImageUrl = person.profileImageUrl;
    if (person.coverImageUrl !== undefined) updates.coverImageUrl = person.coverImageUrl;
    if (person.currentPosition !== undefined) updates.currentPosition = person.currentPosition;
    if (person.currentCompany !== undefined) updates.currentCompany = person.currentCompany;
    if (person.location !== undefined) updates.location = person.location;
    if (person.tier !== undefined) updates.tier = person.tier;
    if (person.isVerified !== undefined) updates.isVerified = person.isVerified;
    if (person.isClaimed !== undefined) updates.isClaimed = person.isClaimed;
    if (person.claimedBy !== undefined) updates.claimedBy = person.claimedBy;
    if (person.keywords !== undefined) updates.keywords = person.keywords ? JSON.stringify(person.keywords) : null;
    if (person.linkedinUrl !== undefined) updates.linkedinUrl = person.linkedinUrl;
    if (person.twitterUrl !== undefined) updates.twitterUrl = person.twitterUrl;
    if (person.instagramUrl !== undefined) updates.instagramUrl = person.instagramUrl;
    if (person.websiteUrl !== undefined) updates.websiteUrl = person.websiteUrl;

    const [updated] = await db
      .update(persons)
      .set(updates)
      .where(eq(persons.id, id))
      .returning();

    return updated ? this.parsePerson(updated) : null;
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

    return updated ? this.parsePerson(updated) : null;
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

    return results.map(r => this.parsePerson(r));
  }
}
