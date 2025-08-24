import type { DatabaseDataSource } from '@/src/domain/interfaces/datasources/database-datasource';
import { Logger } from "@/src/domain/interfaces/logger";
import { SupabaseClientType } from '../../datasources/supabase-datasource';
import { BaseRepository } from './base-repository';

/**
 * Base class for standard repositories that work with client and server datasources
 * Enforces that admin operations cannot be performed
 * Following SOLID principles and Clean Architecture
 */
export abstract class StandardRepository extends BaseRepository {
  /**
   * Constructor with dependency injection
   * @param dataSource Abstraction for database operations (browser or server type)
   * @param logger Abstraction for logging
   * @param entityName Name of the entity this repository manages
   * @param allowServerOnly If true, only allows server client type
   */
  constructor(
    protected readonly dataSource: DatabaseDataSource,
    protected readonly logger: Logger,
    protected readonly entityName: string,
    allowServerOnly: boolean = false
  ) {
    // Allow either both BROWSER and SERVER, or just SERVER based on parameter
    const allowedTypes = allowServerOnly
      ? [SupabaseClientType.SERVER]
      : [SupabaseClientType.BROWSER, SupabaseClientType.SERVER];

    super(dataSource, logger, entityName, allowedTypes);
  }
}
