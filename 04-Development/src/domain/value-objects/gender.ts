export type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say';

export class GenderVO {
  private readonly value: Gender;

  constructor(value: Gender) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid gender value: ${value}`);
    }
    this.value = value;
  }

  private isValid(value: Gender): boolean {
    const validGenders: Gender[] = [
      'male',
      'female',
      'other',
      'prefer-not-to-say',
    ];
    return validGenders.includes(value);
  }

  getValue(): Gender {
    return this.value;
  }

  equals(other: GenderVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
