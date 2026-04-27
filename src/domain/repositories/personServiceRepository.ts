import { PersonService } from '../entities/personService';

export interface PersonServiceRepository {
  listByPerson(personId: string): Promise<PersonService[]>;
  findById(id: string): Promise<PersonService | null>;
  create(data: Omit<PersonService, 'id' | 'createdAt'>): Promise<PersonService>;
  update(id: string, data: Partial<PersonService>): Promise<PersonService | null>;
  delete(id: string): Promise<void>;
  reorder(personId: string, orderedIds: string[]): Promise<void>;
}
