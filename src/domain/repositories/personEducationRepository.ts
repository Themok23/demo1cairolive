import { PersonEducation } from '../entities/personEducation';

export interface PersonEducationRepository {
  listByPerson(personId: string): Promise<PersonEducation[]>;
  findById(id: string): Promise<PersonEducation | null>;
  create(data: Omit<PersonEducation, 'id' | 'createdAt'>): Promise<PersonEducation>;
  update(id: string, data: Partial<PersonEducation>): Promise<PersonEducation | null>;
  delete(id: string): Promise<void>;
  reorder(personId: string, orderedIds: string[]): Promise<void>;
}
