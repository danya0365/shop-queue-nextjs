import type { DatabaseDataSource } from '@/src/domain/interfaces/datasources/database-datasource';
import { Logger } from "@/src/domain/interfaces/logger";
import { SupabaseClientType } from '../../datasources/supabase-datasource';
import { BaseRepository } from './base-repository';

/**
 * Base class for repositories that require backend privileges
 * Enforces that only admin datasources can be used
 * Following SOLID principles and Clean Architecture
 */
export abstract class BackendRepository extends BaseRepository {
  /**
   * Constructor with dependency injection
   * @param dataSource Abstraction for database operations (must be admin type)
   * @param logger Abstraction for logging
   * @param entityName Name of the entity this repository manages
   */
  constructor(
    protected readonly dataSource: DatabaseDataSource,
    protected readonly logger: Logger,
    protected readonly entityName: string
  ) {
    // Only allow ADMIN client type for backend repositories
    super(dataSource, logger, entityName, [SupabaseClientType.ADMIN]);
  }
}
