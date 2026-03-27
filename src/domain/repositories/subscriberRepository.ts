import { Subscriber } from '../entities/subscriber';

export interface SubscriberRepository {
  findById(id: string): Promise<Subscriber | null>;
  findByEmail(email: string): Promise<Subscriber | null>;
  findAll(options?: {
    limit?: number;
    offset?: number;
    isActive?: boolean;
  }): Promise<{ data: Subscriber[]; total: number }>;
  create(subscriber: Subscriber): Promise<Subscriber>;
  update(id: string, subscriber: Partial<Subscriber>): Promise<Subscriber | null>;
  delete(id: string): Promise<boolean>;
  subscribe(email: string, firstName?: string, lastName?: string): Promise<Subscriber>;
  unsubscribe(email: string): Promise<Subscriber | null>;
  countActive(): Promise<number>;
}
