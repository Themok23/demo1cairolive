import { Submission } from '../entities/submission';
import { Person } from '../entities/person';

export interface SubmissionRepository {
  findById(id: string): Promise<Submission | null>;
  findAll(options?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<{ data: Submission[]; total: number }>;
  create(submission: Submission): Promise<Submission>;
  update(id: string, submission: Partial<Submission>): Promise<Submission | null>;
  delete(id: string): Promise<boolean>;
  approve(id: string, reviewedBy: string): Promise<Submission | null>;
  /** Atomically creates a person and approves the submission in a single transaction. */
  approveWithPerson(id: string, reviewedBy: string, person: Person): Promise<{ submission: Submission; person: Person }>;
  reject(id: string, reviewedBy: string, notes: string): Promise<Submission | null>;
  countByStatus(status: string): Promise<number>;
  findPending(): Promise<Submission[]>;
}
