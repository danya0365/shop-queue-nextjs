import { Logger } from "@/src/domain/interfaces/logger";
import { Like, LikeCreate } from '../../domain/entities/like';
import type { IEventDispatcher } from '../../domain/events/event-dispatcher';
import type { DatabaseDataSource } from '../../domain/interfaces/datasources/database-datasource';
import { LikeCreatedEvent, LikeDeletedEvent, LikeError, LikeErrorType, LikeRepository } from '../../domain/repositories/like-repository';
import {
  DatabaseOperationException,
  EntityNotFoundException
} from '../exceptions/repository-exceptions';
import { SupabaseLikeMapper } from '../mappers/supabase-like-mapper';
import { LikeDbSchema } from '../schemas/like-schema';
import { StandardRepository } from './base/standard-repository';

/**
 * Supabase implementation of LikeRepository
 * Following SOLID principles and Clean Architecture
 */

export class SupabaseLikeRepository extends StandardRepository implements LikeRepository {
  private readonly tableName = 'likes';

  /**
   * Constructor with dependency injection
   * @param dataSource Abstraction for database operations
   * @param logger Abstraction for logging
   * @param eventDispatcher Optional event dispatcher for domain events
   */
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger,
    private readonly eventDispatcher?: IEventDispatcher
  ) {
    super(dataSource, logger, "Like", false);
  }

  /**
   * Handle repository errors in a consistent way
   * @param error The error to handle
   * @param operation Optional operation name for better error context
   * @param context Optional additional context for the error
   * @throws LikeError with appropriate type and message
   */
  handleError(error: unknown, operation?: string, context?: Record<string, unknown>): never {
    this.logger.error(`Like repository error in operation: ${operation || 'unknown'}`, { error, context });

    // If it's already a LikeError, just rethrow it
    if (error instanceof LikeError) {
      throw error;
    }

    // Map infrastructure exceptions to domain errors
    if (error instanceof EntityNotFoundException) {
      throw new LikeError(
        LikeErrorType.NOT_FOUND,
        `Like not found: ${error.message}`,
        operation,
        context,
        error
      );
    }

    if (error instanceof DatabaseOperationException) {
      throw new LikeError(
        LikeErrorType.OPERATION_FAILED,
        `Database operation failed: ${error.message}`,
        operation,
        context,
        error
      );
    }

    // Handle other types of errors
    if (error instanceof Error) {
      throw new LikeError(
        LikeErrorType.UNKNOWN,
        `Unexpected error: ${error.message}`,
        operation,
        context,
        error
      );
    }

    // Fallback for non-Error objects
    throw new LikeError(
      LikeErrorType.UNKNOWN,
      'Unknown error occurred',
      operation,
      context,
      error
    );
  }

  /**
   * Get a like by profile ID and video ID
   * @param profileId Profile ID
   * @param videoId Video ID
   * @returns Like domain entity or null if not found
   * @throws LikeError if the operation fails
   */
  async getByUserAndVideo(profileId: string, videoId: string): Promise<Like | null> {
    try {
      const data = await this.dataSource.get<LikeDbSchema>(this.tableName, {
        profile_id: profileId,
        video_id: videoId
      });

      if (!data || data.length === 0) return null;
      return SupabaseLikeMapper.toDomain(data[0]);
    } catch (error) {
      this.handleError(error, 'getByUserAndVideo', { profileId, videoId });
    }
  }

  /**
   * Get all likes for a video
   * @param videoId Video ID
   * @returns Array of like domain entities
   * @throws LikeError if the operation fails
   */
  async getByVideo(videoId: string): Promise<Like[]> {
    try {
      const data = await this.dataSource.get<LikeDbSchema>(this.tableName, {
        video_id: videoId
      });

      return SupabaseLikeMapper.toDomainList(data);
    } catch (error) {
      this.handleError(error, 'getByVideo', { videoId });
    }
  }

  /**
   * Get all likes by a profile
   * @param profileId Profile ID
   * @returns Array of like domain entities
   * @throws LikeError if the operation fails
   */
  async getByUser(profileId: string): Promise<Like[]> {
    try {
      const data = await this.dataSource.get<LikeDbSchema>(this.tableName, {
        profile_id: profileId
      });

      return SupabaseLikeMapper.toDomainList(data);
    } catch (error) {
      this.handleError(error, 'getByUser', { profileId });
    }
  }

  /**
   * Create a new like
   * @param like Like data to create
   * @returns Created like domain entity
   * @throws LikeError if the operation fails
   * @emits LikeCreatedEvent
   */
  async create(like: LikeCreate): Promise<Like> {
    try {
      // First, check if the like already exists
      const existingLike = await this.getByUserAndVideo(like.profileId, like.videoId);
      if (existingLike) return existingLike;

      // Create the like
      const likeData = {
        profile_id: like.profileId,
        video_id: like.videoId
      };

      const data = await this.dataSource.insert<LikeDbSchema>(this.tableName, likeData);
      if (!data) {
        throw new LikeError(
          LikeErrorType.OPERATION_FAILED,
          'Failed to create like, no data returned',
          'create',
          { like }
        );
      }

      const createdLike = SupabaseLikeMapper.toDomain(data);

      // Dispatch domain event if event dispatcher is available
      if (this.eventDispatcher) {
        this.eventDispatcher.dispatch(new LikeCreatedEvent(createdLike));
      }

      return createdLike;
    } catch (error) {
      this.handleError(error, 'create', { like });
    }
  }

  /**
   * Delete a like by ID
   * @param id Like ID
   * @returns Promise with void
   * @throws LikeError if the operation fails
   * @emits LikeDeletedEvent
   */
  async delete(id: string): Promise<void> {
    try {
      // Get the like first to check if it exists and to get data for the event
      const like = await this.dataSource.getById<LikeDbSchema>(this.tableName, id);
      if (!like) {
        throw new LikeError(
          LikeErrorType.NOT_FOUND,
          `Like with id ${id} not found`,
          'delete',
          { id }
        );
      }

      // Store like data for event before deletion
      const likeData = SupabaseLikeMapper.toDomain(like);

      // Delete the like
      await this.dataSource.delete(this.tableName, id);

      // Dispatch domain event if event dispatcher is available
      if (this.eventDispatcher) {
        this.eventDispatcher.dispatch(new LikeDeletedEvent(
          id,
          likeData.videoId,
          likeData.profileId
        ));
      }
    } catch (error) {
      this.handleError(error, 'delete', { id });
    }
  }

  /**
   * Delete a like by profile ID and video ID
   * @param profileId Profile ID
   * @param videoId Video ID
   * @returns Promise with void
   * @throws LikeError if the operation fails
   * @emits LikeDeletedEvent
   */
  async deleteByUserAndVideo(profileId: string, videoId: string): Promise<void> {
    try {
      // First, find the like to get its ID
      const like = await this.getByUserAndVideo(profileId, videoId);
      if (!like) {
        // No like found, nothing to delete
        return;
      }

      // Delete the like using its ID
      await this.delete(like.id);
    } catch (error) {
      this.handleError(error, 'deleteByUserAndVideo', { profileId, videoId });
    }
  }

  // Mapping is now handled by the SupabaseLikeMapper class
}
