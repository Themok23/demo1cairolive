import { PersonWorkplace } from '../entities/personWorkplace';

export interface PersonWorkplaceRepository {
  listByPerson(personId: string): Promise<PersonWorkplace[]>;
  findById(id: string): Promise<PersonWorkplace | null>;
  create(data: Omit<PersonWorkplace, 'id' | 'createdAt'>): Promise<PersonWorkplace>;
  update(id: string, data: Partial<PersonWorkplace>): Promise<PersonWorkplace | null>;
  delete(id: string): Promise<void>;
  reorder(personId: string, orderedIds: string[]): Promise<void>;
}
