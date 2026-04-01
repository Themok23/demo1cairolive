import { randomUUID } from 'crypto';
import { z } from 'zod';
import { Subscriber } from '../../../domain/entities/subscriber';
import { SubscriberRepository } from '../../../domain/repositories/subscriberRepository';

const SubscribeSchema = z.object({
  email: z.string().email(),
  firstName: z.string().max(255).optional(),
  lastName: z.string().max(255).optional(),
});

export type SubscribeInput = z.infer<typeof SubscribeSchema>;

export interface SubscribeResult {
  success: boolean;
  data?: Subscriber;
  error?: string;
}

export class SubscribeUseCase {
  constructor(private subscriberRepository: SubscriberRepository) {}

  async execute(input: SubscribeInput): Promise<SubscribeResult> {
    try {
      const validated = SubscribeSchema.parse(input);

      const existing = await this.subscriberRepository.findByEmail(
        validated.email
      );

      if (existing) {
        if (existing.isActive) {
          return {
            success: false,
            error: 'Email is already subscribed',
          };
        }

        const resubscribed = await this.subscriberRepository.update(
          existing.id,
          {
            isActive: true,
            unsubscribedAt: undefined,
            updatedAt: new Date(),
          }
        );

        if (!resubscribed) {
          return {
            success: false,
            error: 'Failed to resubscribe',
          };
        }

        return {
          success: true,
          data: resubscribed,
        };
      }

      const now = new Date();
      const subscriber: Subscriber = {
        id: randomUUID(),
        email: validated.email,
        firstName: validated.firstName,
        lastName: validated.lastName,
        isActive: true,
        subscribedAt: now,
        updatedAt: now,
      };

      const created = await this.subscriberRepository.create(subscriber);
      return {
        success: true,
        data: created,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: `Validation error: ${error.errors[0].message}`,
        };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

}
