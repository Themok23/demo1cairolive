import { PersonProduct } from '../entities/personProduct';

export interface PersonProductRepository {
  listByPerson(personId: string): Promise<PersonProduct[]>;
  findById(id: string): Promise<PersonProduct | null>;
  create(data: Omit<PersonProduct, 'id' | 'createdAt'>): Promise<PersonProduct>;
  update(id: string, data: Partial<PersonProduct>): Promise<PersonProduct | null>;
  delete(id: string): Promise<void>;
  reorder(personId: string, orderedIds: string[]): Promise<void>;
}
