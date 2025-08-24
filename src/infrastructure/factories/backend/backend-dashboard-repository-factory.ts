import type { IBackendDashboardRepositoryAdapter } from '@/src/application/interfaces/backend/backend-dashboard-repository-adapter.interface';
import type { ILogger } from '@/src/application/interfaces/logger.interface';
import type { DatabaseDataSource } from '@/src/domain/interfaces/datasources/database-datasource';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BackendDashboardRepositoryAdapter } from '../../adapters/backend/backend-dashboard-repository-adapter';
import { SupabaseBackendDashboardRepository } from '../../repositories/backend/supabase-backend-dashboard-repository';

/**
 * Factory for creating backend dashboard repository and adapter instances
 * Following Factory Pattern to centralize creation logic
 */
export class BackendDashboardRepositoryFactory {
  /**
   * Create a backend dashboard repository adapter
   * @param dataSource The database data source
   * @param logger Optional logger for error logging
   * @returns A backend dashboard repository adapter
   */
  static createAdapter(
    dataSource: DatabaseDataSource,
    logger?: ILogger
  ): IBackendDashboardRepositoryAdapter {
    // Use the provided logger
    const actualLogger: Logger = logger as Logger;

    // Create the backend dashboard repository
    const backendDashboardRepository = new SupabaseBackendDashboardRepository(
      dataSource,
      actualLogger
    );

    // Create and return the adapter with the repository
    return new BackendDashboardRepositoryAdapter(
      backendDashboardRepository,
      actualLogger
    );
  }
}
