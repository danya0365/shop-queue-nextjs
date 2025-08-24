import { Video } from '../entities/video';
import { IDomainEvent } from './event-dispatcher';
import { v4 as uuidv4 } from 'uuid';

/**
 * Base class for all video events
 * Following Domain-Driven Design principles by using domain events
 */
export abstract class VideoEvent implements IDomainEvent {
  readonly eventId: string;
  readonly timestamp: Date;
  readonly videoId: string;

  constructor(videoId: string) {
    this.eventId = uuidv4();
    this.timestamp = new Date();
    this.videoId = videoId;
  }
}

/**
 * Event fired when a video is created
 */
export class VideoCreatedEvent extends VideoEvent {
  readonly video: Video;

  constructor(video: Video) {
    super(video.id);
    this.video = video;
  }
}

/**
 * Event fired when a video is updated
 */
export class VideoUpdatedEvent extends VideoEvent {
  readonly video: Video;
  readonly previousTitle?: string;

  constructor(video: Video, previousTitle?: string) {
    super(video.id);
    this.video = video;
    this.previousTitle = previousTitle;
  }
}

/**
 * Event fired when a video is deleted
 */
export class VideoDeletedEvent extends VideoEvent {
  constructor(videoId: string) {
    super(videoId);
  }
}

/**
 * Event fired when a video's views are incremented
 */
export class VideoViewedEvent extends VideoEvent {
  readonly currentViews: number;

  constructor(videoId: string, currentViews: number) {
    super(videoId);
    this.currentViews = currentViews;
  }
}

/**
 * Event fired when a video is featured or unfeatured
 */
export class VideoFeaturedEvent extends VideoEvent {
  readonly isFeatured: boolean;

  constructor(videoId: string, isFeatured: boolean) {
    super(videoId);
    this.isFeatured = isFeatured;
  }
}
