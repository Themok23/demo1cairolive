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

  getFullName(): string {
    if (this.firstName || this.lastName) {
      return `${this.firstName || ''} ${this.lastName || ''}`.trim();
    }
    return this.email;
  }

  getInitials(): string {
    if (!this.firstName || !this.lastName) {
      return this.email.charAt(0).toUpperCase();
    }
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
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
      unsubscribedAt: null,
      updatedAt: new Date(),
    });
  }

  update(data: Partial<Subscriber>): SubscriberEntity {
    return new SubscriberEntity({
      ...this,
      ...data,
      updatedAt: new Date(),
    });
  }

  updateEmail(newEmail: string): SubscriberEntity {
    return new SubscriberEntity({
      ...this,
      email: newEmail,
      updatedAt: new Date(),
    });
  }

  updateProfile(firstName: string | null, lastName: string | null): SubscriberEntity {
    return new SubscriberEntity({
      ...this,
      firstName: firstName,
      lastName: lastName,
      updatedAt: new Date(),
    });
  }

  isSubscribed(): boolean {
    return this.isActive;
  }

  isUnsubscribed(): boolean {
    return !this.isActive && !!this.unsubscribedAt;
  }

  getTimeSubscribed(): number {
    return Date.now() - this.subscribedAt.getTime();
  }

  getTimeUnsubscribed(): number | null {
    return this.unsubscribedAt ? Date.now() - this.unsubscribedAt.getTime() : null;
  }

  getDaysSubscribed(): number {
    return Math.floor(this.getTimeSubscribed() / (1000 * 60 * 60 * 24));
  }

  hasName(): boolean {
    return !!(this.firstName || this.lastName);
  }

  toJSON(): Subscriber {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      isActive: this.isActive,
      subscribedAt: this.subscribedAt,
      unsubscribedAt: this.unsubscribedAt,
      updatedAt: this.updatedAt,
    };
  }
}