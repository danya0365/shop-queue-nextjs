import { Like } from '../entities/like';
import { IDomainEvent } from './event-dispatcher';
import { v4 as uuidv4 } from 'uuid';

/**
 * Base class for all like events
 * Following Domain-Driven Design principles by using domain events
 */
export abstract class LikeEvent implements IDomainEvent {
  readonly eventId: string;
  readonly timestamp: Date;
  readonly videoId: string;
  readonly profileId: string;

  constructor(videoId: string, profileId: string) {
    this.eventId = uuidv4();
    this.timestamp = new Date();
    this.videoId = videoId;
    this.profileId = profileId;
  }
}

/**
 * Event fired when a like is created
 */
export class LikeCreatedEvent extends LikeEvent {
  readonly like: Like;

  constructor(like: Like) {
    super(like.videoId, like.profileId);
    this.like = like;
  }
}

/**
 * Event fired when a like is deleted
 */
export class LikeDeletedEvent extends LikeEvent {
  readonly likeId?: string;

  constructor(videoId: string, profileId: string, likeId?: string) {
    super(videoId, profileId);
    this.likeId = likeId;
  }
}

/**
 * Event fired when a like is toggled
 * This is a higher-level event that might trigger either a LikeCreatedEvent or LikeDeletedEvent
 */
export class LikeToggledEvent extends LikeEvent {
  readonly isLiked: boolean;

  constructor(videoId: string, profileId: string, isLiked: boolean) {
    super(videoId, profileId);
    this.isLiked = isLiked;
  }
}
