import { v4 as uuidv4 } from "uuid";
import { Video, VideoCreate } from "../entities/video";
import { IDomainEvent } from "../events/event-dispatcher";
import { PaginatedResult, PaginationParams } from "../interfaces/pagination-types";

/**
 * Base repository interface with common error handling
 */
export interface IBaseVideoRepository {
  /**
   * Handles repository errors in a consistent way
   * @param error The error to handle
   * @throws VideoError with appropriate error type
   */
  handleError(error: unknown): never;
}

/**
 * Video-specific read repository interface
 * Following Interface Segregation Principle by separating read operations
 */
export interface IVideoReadRepository extends IBaseVideoRepository {
  /**
   * Get all videos
   * @returns Promise with array of videos
   * @throws VideoError if the operation fails
   */
  getAll(): Promise<Video[]>;

  /**
   * Get video by ID
   * @param id Video ID
   * @returns Promise with video or null if not found
   * @throws VideoError if the operation fails
   */
  getById(id: string): Promise<Video | null>;

  /**
   * Search videos
   * @param query Search query
   * @returns Promise with array of matching videos
   * @throws VideoError if the operation fails
   */
  search(query: string): Promise<Video[]>;

  /**
   * Search videos with optional category filter
   * @param query Search query
   * @param categoryId Optional category ID filter
   * @returns Promise with array of matching videos
   * @throws VideoError if the operation fails
   */
  search(query: string, categoryId?: string): Promise<Video[]>;

  /**
   * Get paginated videos by category
   * @param categoryId Category ID
   * @param params Pagination parameters
   * @returns Promise with paginated result of videos
   * @throws VideoError if the operation fails
   */
  getPaginatedVideosByCategory(
    categoryId: string,
    params: PaginationParams
  ): Promise<PaginatedResult<Video>>;

  /**
   * Get paginated most viewed videos
   * @param params Pagination parameters
   * @returns Promise with paginated result of videos
   * @throws VideoError if the operation fails
   */
  getPaginatedMostViewed(
    params: PaginationParams
  ): Promise<PaginatedResult<Video>>;

  /**
   * Get paginated most recent videos
   * @param params Pagination parameters
   * @returns Promise with paginated result of videos
   * @throws VideoError if the operation fails
   */
  getPaginatedMostRecent(
    params: PaginationParams
  ): Promise<PaginatedResult<Video>>;

  /**
   * Get paginated videos by user
   * @param profileId Profile ID
   * @param params Pagination parameters
   * @returns Promise with paginated result of videos
   * @throws VideoError if the operation fails
   */
  getPaginatedByUser(
    profileId: string,
    params: PaginationParams
  ): Promise<PaginatedResult<Video>>;

  /**
   * Get paginated videos liked by user
   * @param profileId Profile ID
   * @param params Pagination parameters
   * @returns Promise with paginated result of videos
   * @throws VideoError if the operation fails
   */
  getPaginatedLikedByUser(
    profileId: string,
    params: PaginationParams
  ): Promise<PaginatedResult<Video>>;
}

/**
 * Video-specific write repository interface
 * Following Interface Segregation Principle by separating write operations
 */
export interface IVideoWriteRepository extends IBaseVideoRepository {
  /**
   * Create a new video
   * @param data Video data
   * @returns Promise with created video
   * @throws VideoError if the operation fails
   */
  create(data: VideoCreate): Promise<Video>;

  /**
   * Update an existing video
   * @param id Video ID
   * @param data Video data
   * @returns Promise with updated video
   * @throws VideoError if the operation fails
   */
  update(id: string, data: Partial<VideoCreate>): Promise<Video>;

  /**
   * Delete a video
   * @param id Video ID
   * @throws VideoError if the operation fails
   */
  delete(id: string): Promise<void>;

  /**
   * Increment view count for a video
   * @param id Video ID
   * @throws VideoError if the operation fails
   */
  incrementViews(id: string): Promise<void>;
}

/**
 * Combined video repository interface
 * Clients should depend on more specific interfaces when possible
 */
export interface VideoRepository
  extends IVideoReadRepository,
  IVideoWriteRepository { }

/**
 * Video error types for domain error handling
 */
export enum VideoErrorType {
  NOT_FOUND = "NOT_FOUND",
  ALREADY_EXISTS = "ALREADY_EXISTS",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  OPERATION_FAILED = "OPERATION_FAILED",
  CONSTRAINT_VIOLATION = "CONSTRAINT_VIOLATION",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNKNOWN = "UNKNOWN",
}

/**
 * Domain error for video repository operations
 */
export class VideoError extends Error {
  constructor(
    public readonly type: VideoErrorType,
    message: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "VideoError";
  }
}

/**
 * Domain event for video creation
 */
export class VideoCreatedEvent implements IDomainEvent {
  public readonly eventId: string;

  constructor(
    public readonly video: Video,
    public readonly timestamp: Date = new Date()
  ) {
    this.eventId = uuidv4();
  }
}

/**
 * Domain event for video update
 */
export class VideoUpdatedEvent implements IDomainEvent {
  public readonly eventId: string;

  constructor(
    public readonly video: Video,
    public readonly timestamp: Date = new Date()
  ) {
    this.eventId = uuidv4();
  }
}

/**
 * Domain event for video deletion
 */
export class VideoDeletedEvent implements IDomainEvent {
  public readonly eventId: string;

  constructor(
    public readonly videoId: string,
    public readonly timestamp: Date = new Date()
  ) {
    this.eventId = uuidv4();
  }
}

/**
 * Domain event for video view increment
 */
export class VideoViewedEvent implements IDomainEvent {
  public readonly eventId: string;

  constructor(
    public readonly videoId: string,
    public readonly timestamp: Date = new Date()
  ) {
    this.eventId = uuidv4();
  }
}
