import type { DatabaseDataSource } from '@/src/domain/interfaces/datasources/database-datasource';
import { Logger } from "@/src/domain/interfaces/logger";
import { BackendUserRepositoryAdapter } from '@/src/infrastructure/adapters/backend/backend-user-repository-adapter';
import { SupabaseBackendUserRepository } from '@/src/infrastructure/repositories/backend/supabase-backend-user-repository';

/**
 * Factory for creating BackendUserRepositoryAdapter instances
 * Following Factory pattern for better testability and dependency management
 */
export class BackendUserRepositoryFactory {
  /**
   * Create a BackendUserRepositoryAdapter instance with its dependencies
   * @param dataSource Database data source
   * @param logger Logger instance
   * @returns BackendUserRepositoryAdapter instance
   */
  static createAdapter(
    dataSource: DatabaseDataSource,
    logger: Logger
  ): BackendUserRepositoryAdapter {
    // Create the repository
    const repository = new SupabaseBackendUserRepository(
      dataSource,
      logger
    );

    // Create and return the adapter with the repository
    return new BackendUserRepositoryAdapter(repository, logger);
  }
}
