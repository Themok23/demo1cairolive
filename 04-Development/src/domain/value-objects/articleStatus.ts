export type ArticleStatus = 'draft' | 'published' | 'archived';

export class ArticleStatusVO {
  private readonly value: ArticleStatus;

  constructor(value: ArticleStatus) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid article status: ${value}`);
    }
    this.value = value;
  }

  private isValid(value: ArticleStatus): boolean {
    const validStatuses: ArticleStatus[] = ['draft', 'published', 'archived'];
    return validStatuses.includes(value);
  }

  getValue(): ArticleStatus {
    return this.value;
  }

  equals(other: ArticleStatusVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  isPublished(): boolean {
    return this.value === 'published';
  }

  isDraft(): boolean {
    return this.value === 'draft';
  }

  isArchived(): boolean {
    return this.value === 'archived';
  }
}
