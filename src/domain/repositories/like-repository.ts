import { Like, LikeCreate } from '../entities/like';
import { IDomainEvent } from '../events/event-dispatcher';
import { v4 as uuidv4 } from 'uuid';

/**
 * Like repository error types
 * Following domain-driven design principles by defining domain-specific errors
 */
export enum LikeErrorType {
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  OPERATION_FAILED = 'OPERATION_FAILED',
  CONSTRAINT_VIOLATION = 'CONSTRAINT_VIOLATION',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Domain-specific like repository error
 */
export class LikeError extends Error {
  constructor(
    public readonly type: LikeErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'LikeError';
  }
}

/**
 * Base like repository interface with common functionality
 * Following Interface Segregation Principle by creating specialized interfaces
 */
export interface IBaseLikeRepository {
  /**
   * Handle repository errors in a consistent way
   * @param error The error to handle
   * @param operation Optional operation name for better error context
   * @param context Optional additional context for the error
   * @throws LikeError with appropriate type and message
   */
  handleError(error: unknown, operation?: string, context?: Record<string, unknown>): never;
}

/**
 * Like-specific read repository interface
 * Following Interface Segregation Principle by creating specialized interfaces
 */
export interface ILikeReadRepository extends IBaseLikeRepository {
  /**
   * Get likes by video ID
   * @param videoId Video ID
   * @returns Promise with array of likes
   * @throws LikeError if the operation fails
   */
  getByVideo(videoId: string): Promise<Like[]>;
  
  /**
   * Get likes by profile ID
   * @param profileId Profile ID
   * @returns Promise with array of likes
   * @throws LikeError if the operation fails
   */
  getByUser(profileId: string): Promise<Like[]>;
  
  /**
   * Get like by video and profile ID
   * @param profileId Profile ID
   * @param videoId Video ID
   * @returns Promise with like or null if not found
   * @throws LikeError if the operation fails
   */
  getByUserAndVideo(profileId: string, videoId: string): Promise<Like | null>;
}

/**
 * Like-specific write repository interface
 * Following Interface Segregation Principle by creating specialized interfaces
 */
export interface ILikeWriteRepository extends IBaseLikeRepository {
  /**
   * Create a new like
   * @param like The like to create
   * @returns Promise with the created like
   * @throws LikeError if the operation fails
   * @emits LikeCreatedEvent
   */
  create(like: LikeCreate): Promise<Like>;
  
  /**
   * Delete a like by ID
   * @param id The ID of the like to delete
   * @returns Promise with void
   * @throws LikeError if the operation fails
   * @emits LikeDeletedEvent
   */
  delete(id: string): Promise<void>;
  
  /**
   * Delete a like by video and profile ID
   * @param profileId Profile ID
   * @param videoId Video ID
   * @returns Promise with void
   * @throws LikeError if the operation fails
   * @emits LikeDeletedEvent
   */
  deleteByUserAndVideo(profileId: string, videoId: string): Promise<void>;
}

/**
 * Combined like repository interface
 * Clients should depend on more specific interfaces when possible
 */
export interface LikeRepository extends ILikeReadRepository, ILikeWriteRepository {}

/**
 * Domain event for like creation
 * Following Domain-Driven Design principles by using domain events
 */
export class LikeCreatedEvent implements IDomainEvent {
  public readonly eventId: string;

  constructor(
    public readonly like: Like,
    public readonly timestamp: Date = new Date()
  ) {
    this.eventId = uuidv4();
  }
}

/**
 * Domain event for like deletion
 * Following Domain-Driven Design principles by using domain events
 */
export class LikeDeletedEvent implements IDomainEvent {
  public readonly eventId: string;

  constructor(
    public readonly likeId: string,
    public readonly videoId: string,
    public readonly profileId: string,
    public readonly timestamp: Date = new Date()
  ) {
    this.eventId = uuidv4();
  }
}

/**
 * Domain event dispatcher interface
 * Following Domain-Driven Design principles by using domain events
 */
export interface IEventDispatcher {
  /**
   * Dispatch a domain event
   * @param event The event to dispatch
   */
  dispatch<T>(event: T): void;
  
  /**
   * Subscribe to a domain event
   * @param eventType The event type to subscribe to
   * @param handler The handler function to call when the event is dispatched
   */
  subscribe<T>(eventType: new (...args: unknown[]) => T, handler: (event: T) => void): void;
}

/**
 * Value object for like count
 * Following Domain-Driven Design principles by encapsulating domain concepts
 */
export class LikeCount {
  private readonly value: number;
  
  constructor(count: number) {
    if (count < 0) {
      throw new LikeError(
        LikeErrorType.VALIDATION_ERROR,
        'Like count cannot be negative',
        'LikeCount.constructor',
        { count }
      );
    }
    this.value = count;
  }
  
  getValue(): number {
    return this.value;
  }
  
  increment(): LikeCount {
    return new LikeCount(this.value + 1);
  }
  
  decrement(): LikeCount {
    return new LikeCount(Math.max(0, this.value - 1));
  }
  
  equals(other: LikeCount): boolean {
    return this.value === other.value;
  }
}
