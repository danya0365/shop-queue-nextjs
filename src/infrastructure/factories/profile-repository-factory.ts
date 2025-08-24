import { Logger } from "@/src/domain/interfaces/logger";
import { DatabaseDataSource } from '../../domain/interfaces/datasources/database-datasource';
import { ProfileRepositoryAdapter } from '../adapters/profile-repository-adapter';
import { SupabaseProfileRepository } from '../repositories/supabase-profile-repository';

/**
 * Factory for creating ProfileRepository and ProfileRepositoryAdapter instances
 * Following Factory pattern for better dependency management
 */
export class ProfileRepositoryFactory {
  /**
   * Create a ProfileRepositoryAdapter with a SupabaseProfileRepository
   * @param dataSource The database data source
   * @param logger Logger for error tracking
   * @returns A ProfileRepositoryAdapter instance
   */
  static createAdapter(
    dataSource: DatabaseDataSource,
    logger: Logger
  ): ProfileRepositoryAdapter {
    const repository = new SupabaseProfileRepository(dataSource, logger);
    return new ProfileRepositoryAdapter(repository, logger);
  }
}
