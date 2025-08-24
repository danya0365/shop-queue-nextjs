import { Profile } from '../entities/profile';
import { IDomainEvent } from './event-dispatcher';
import { v4 as uuidv4 } from 'uuid';

/**
 * Base class for all profile events
 * Following Domain-Driven Design principles by using domain events
 */
export abstract class ProfileEvent implements IDomainEvent {
  readonly eventId: string;
  readonly timestamp: Date;
  readonly profileId: string;
  readonly authId: string;

  constructor(profileId: string, authId: string) {
    this.eventId = uuidv4();
    this.timestamp = new Date();
    this.profileId = profileId;
    this.authId = authId;
  }
}

/**
 * Event fired when a profile is created
 */
export class ProfileCreatedEvent extends ProfileEvent {
  readonly profile: Profile;

  constructor(profile: Profile) {
    super(profile.id, profile.authId);
    this.profile = profile;
  }
}

/**
 * Event fired when a profile is updated
 */
export class ProfileUpdatedEvent extends ProfileEvent {
  readonly profile: Profile;
  readonly previousUsername?: string;

  constructor(profile: Profile, previousUsername?: string) {
    super(profile.id, profile.authId);
    this.profile = profile;
    this.previousUsername = previousUsername;
  }
}

/**
 * Event fired when a profile is deleted
 */
export class ProfileDeletedEvent extends ProfileEvent {
  constructor(profileId: string, authId: string) {
    super(profileId, authId);
  }
}

/**
 * Event fired when a profile is set as active
 */
export class ProfileActivatedEvent extends ProfileEvent {
  constructor(profileId: string, authId: string) {
    super(profileId, authId);
  }
}
