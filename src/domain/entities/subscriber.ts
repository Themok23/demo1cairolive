export interface Subscriber {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  isActive: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date | null;
  updatedAt: Date;
}

export class SubscriberEntity implements Subscriber {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  isActive: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date | null;
  updatedAt: Date;

  constructor(data: Subscriber) {
    this.id = data.id;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.isActive = data.isActive;
    this.subscribedAt = data.subscribedAt;
    this.unsubscribedAt = data.unsubscribedAt;
    this.updatedAt = data.updatedAt;
  }

  unsubscribe(): SubscriberEntity {
    return new SubscriberEntity({
      ...this,
      isActive: false,
      unsubscribedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  resubscribe(): SubscriberEntity {
    return new SubscriberEntity({
      ...this,
      isActive: true,
      unsubscribedAt: undefined,
      updatedAt: new Date(),
    });
  }
}
