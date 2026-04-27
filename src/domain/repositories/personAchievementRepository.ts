import { PersonAchievement } from '../entities/personAchievement';

export interface PersonAchievementRepository {
  listByPerson(personId: string): Promise<PersonAchievement[]>;
  findById(id: string): Promise<PersonAchievement | null>;
  create(data: Omit<PersonAchievement, 'id' | 'createdAt'>): Promise<PersonAchievement>;
  update(id: string, data: Partial<PersonAchievement>): Promise<PersonAchievement | null>;
  delete(id: string): Promise<void>;
  reorder(personId: string, orderedIds: string[]): Promise<void>;
}
