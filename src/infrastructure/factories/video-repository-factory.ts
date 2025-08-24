import { Logger } from "@/src/domain/interfaces/logger";
import { IUserLikedVideosRepositoryAdapter } from '../../application/interfaces/user-liked-videos-repository-adapter.interface';
import { DatabaseDataSource } from '../../domain/interfaces/datasources/database-datasource';
import { UserLikedVideosRepositoryAdapter } from '../adapters/user-liked-videos-repository-adapter';
import { VideoRepositoryAdapter } from '../adapters/video-repository-adapter';
import { SupabaseVideoRepository } from '../repositories/supabase-video-repository';

/**
 * Factory for creating VideoRepository and VideoRepositoryAdapter instances
 * Following Factory pattern for better dependency management
 */
export class VideoRepositoryFactory {
  /**
   * Create a VideoRepositoryAdapter with a SupabaseVideoRepository
   * @param dataSource The database data source
   * @param logger Logger for error tracking
   * @returns A VideoRepositoryAdapter instance
   */
  static createAdapter(
    dataSource: DatabaseDataSource,
    logger: Logger
  ): VideoRepositoryAdapter {
    const repository = new SupabaseVideoRepository(dataSource, logger);
    return new VideoRepositoryAdapter(repository, logger);
  }

  /**
   * Create a UserLikedVideosRepositoryAdapter for handling liked videos
   * @param dataSource The database data source
   * @param logger Logger for error tracking
   * @returns A UserLikedVideosRepositoryAdapter instance
   */
  static createLikedVideosAdapter(
    dataSource: DatabaseDataSource,
    logger: Logger
  ): IUserLikedVideosRepositoryAdapter {
    const repository = new SupabaseVideoRepository(dataSource, logger);
    return new UserLikedVideosRepositoryAdapter(repository, logger);
  }
}
