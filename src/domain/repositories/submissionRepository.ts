import { Submission } from '../entities/submission';

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
  reject(id: string, reviewedBy: string, notes: string): Promise<Submission | null>;
  countByStatus(status: string): Promise<number>;
  findPending(): Promise<Submission[]>;
}
