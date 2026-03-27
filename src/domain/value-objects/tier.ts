export type Tier = 'bronze' | 'silver' | 'gold' | 'platinum';

export class TierVO {
  private readonly value: Tier;

  constructor(value: Tier) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid tier value: ${value}`);
    }
    this.value = value;
  }

  private isValid(value: Tier): boolean {
    const validTiers: Tier[] = ['bronze', 'silver', 'gold', 'platinum'];
    return validTiers.includes(value);
  }

  getValue(): Tier {
    return this.value;
  }

  equals(other: TierVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  rank(): number {
    const ranks: Record<Tier, number> = {
      bronze: 1,
      silver: 2,
      gold: 3,
      platinum: 4,
    };
    return ranks[this.value];
  }

  isHigherThan(other: TierVO): boolean {
    return this.rank() > other.rank();
  }
}
