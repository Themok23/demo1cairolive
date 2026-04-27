import { PersonRepository } from '../../../domain/repositories/personRepository';

export class IncrementViewCountUseCase {
  constructor(private repo: PersonRepository) {}

  async execute(personId: string): Promise<void> {
    await this.repo.incrementViewCount(personId);
  }
}
