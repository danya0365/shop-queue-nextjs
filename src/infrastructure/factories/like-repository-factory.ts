import { Logger } from "@/src/domain/interfaces/logger";
import { DatabaseDataSource } from '../../domain/interfaces/datasources/database-datasource';
import { LikeRepository } from '../../domain/repositories/like-repository';
import { VideoRepository } from '../../domain/repositories/video-repository';
import { LikeRepositoryAdapter } from '../adapters/like-repository-adapter';
import { SupabaseLikeRepository } from '../repositories/supabase-like-repository';
import { SupabaseVideoRepository } from '../repositories/supabase-video-repository';
import { EventDispatcherFactory } from './event-dispatcher-factory';

/**
 * Factory for creating LikeRepository and LikeRepositoryAdapter instances
 * Following Dependency Inversion Principle by providing a way to create repositories
 * without depending on concrete implementations
 */
export class LikeRepositoryFactory {
  /**
   * Create a LikeRepository instance
   * @param dataSource Database data source
   * @param logger Logger
   * @returns LikeRepository instance
   */
  static createRepository(
    dataSource: DatabaseDataSource,
    logger: Logger
  ): LikeRepository {
    // Create event dispatcher with logger for proper error handling
    const eventDispatcher = EventDispatcherFactory.createInMemoryEventDispatcher(logger);
    return new SupabaseLikeRepository(dataSource, logger, eventDispatcher);
  }

  /**
   * Create a VideoRepository instance
   * @param dataSource Database data source
   * @param logger Logger
   * @returns VideoRepository instance
   */
  static createVideoRepository(
    dataSource: DatabaseDataSource,
    logger: Logger
  ): VideoRepository {
    return new SupabaseVideoRepository(dataSource, logger);
  }

  /**
   * Create a LikeRepositoryAdapter instance
   * @param dataSource Database data source
   * @param logger Logger
   * @returns LikeRepositoryAdapter instance
   */
  static createAdapter(
    dataSource: DatabaseDataSource,
    logger: Logger
  ): LikeRepositoryAdapter {
    const repository = this.createRepository(dataSource, logger);
    const videoRepository = this.createVideoRepository(dataSource, logger);
    return new LikeRepositoryAdapter(repository, videoRepository);
  }
}
