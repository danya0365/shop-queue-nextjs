import { Logger } from "@/src/domain/interfaces/logger";
import { DatabaseDataSource } from '../../domain/interfaces/datasources/database-datasource';
import { CategoryRepository } from '../../domain/repositories/category-repository';
import { CategoryRepositoryAdapter } from '../adapters/category-repository-adapter';
import { SupabaseCategoryRepository } from '../repositories/supabase-category-repository';
import { EventDispatcherFactory } from './event-dispatcher-factory';

/**
 * Factory for creating CategoryRepository and CategoryRepositoryAdapter instances
 * Following Dependency Inversion Principle by providing a way to create repositories
 * without depending on concrete implementations
 */
export class CategoryRepositoryFactory {
  /**
   * Create a CategoryRepository instance
   * @param dataSource Database data source
   * @param logger Logger
   * @returns CategoryRepository instance
   */
  static createRepository(
    dataSource: DatabaseDataSource,
    logger: Logger
  ): CategoryRepository {
    // Create event dispatcher with logger for proper error handling
    const eventDispatcher = EventDispatcherFactory.createInMemoryEventDispatcher(logger);
    return new SupabaseCategoryRepository(dataSource, logger, eventDispatcher);
  }

  /**
   * Create a CategoryRepositoryAdapter instance
   * @param dataSource Database data source
   * @param logger Logger
   * @returns CategoryRepositoryAdapter instance
   */
  static createAdapter(
    dataSource: DatabaseDataSource,
    logger: Logger
  ): CategoryRepositoryAdapter {
    const repository = this.createRepository(dataSource, logger);
    return new CategoryRepositoryAdapter(repository);
  }
}
