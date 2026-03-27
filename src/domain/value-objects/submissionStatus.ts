export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export class SubmissionStatusVO {
  private readonly value: SubmissionStatus;

  constructor(value: SubmissionStatus) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid submission status: ${value}`);
    }
    this.value = value;
  }

  private isValid(value: SubmissionStatus): boolean {
    const validStatuses: SubmissionStatus[] = [
      'pending',
      'approved',
      'rejected',
    ];
    return validStatuses.includes(value);
  }

  getValue(): SubmissionStatus {
    return this.value;
  }

  equals(other: SubmissionStatusVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  isPending(): boolean {
    return this.value === 'pending';
  }

  isApproved(): boolean {
    return this.value === 'approved';
  }

  isRejected(): boolean {
    return this.value === 'rejected';
  }
}
