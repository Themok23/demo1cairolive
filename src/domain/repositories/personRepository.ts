import { Person } from '../entities/person';

export interface PersonRepository {
  findById(id: string): Promise<Person | null>;
  findByEmail(email: string): Promise<Person | null>;
  findAll(options?: {
    limit?: number;
    offset?: number;
    tier?: string;
    search?: string;
  }): Promise<{ data: Person[]; total: number }>;
  create(person: Person): Promise<Person>;
  update(id: string, person: Partial<Person>): Promise<Person | null>;
  delete(id: string): Promise<boolean>;
  claimProfile(id: string, claimedBy: string): Promise<Person | null>;
  countByTier(tier: string): Promise<number>;
  searchByName(firstName: string, lastName: string): Promise<Person[]>;
  incrementViewCount(id: string): Promise<void>;
}
