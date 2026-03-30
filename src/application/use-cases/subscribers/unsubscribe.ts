import { z } from 'zod';
import { Subscriber } from '../../../domain/entities/subscriber';
import { SubscriberRepository } from '../../../domain/repositories/subscriberRepository';

const UnsubscribeSchema = z.object({
  email: z.string().email(),
});

export type UnsubscribeInput = z.infer<typeof UnsubscribeSchema>;

export interface UnsubscribeResult {
  success: boolean;
  data?: Subscriber;
  error?: string;
}

export class UnsubscribeUseCase {
  constructor(private subscriberRepository: SubscriberRepository) {}

  async execute(input: UnsubscribeInput): Promise<UnsubscribeResult> {
    try {
      const validated = UnsubscribeSchema.parse(input);

      const subscriber = await this.subscriberRepository.findByEmail(
        validated.email
      );

      if (!subscriber) {
        return {
          success: false,
          error: 'Subscriber not found',
        };
      }

      if (!subscriber.isActive) {
        return {
          success: false,
          error: 'Email is already unsubscribed',
        };
      }

      const updated = await this.subscriberRepository.update(subscriber.id, {
        isActive: false,
        unsubscribedAt: new Date(),
        updatedAt: new Date(),
      });

      if (!updated) {
        return {
          success: false,
          error: 'Failed to unsubscribe',
        };
      }

      return {
        success: true,
        data: updated,
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
