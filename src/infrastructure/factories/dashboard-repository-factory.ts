import { Logger } from "@/src/domain/interfaces/logger";
import { IDashboardRepositoryAdapter } from '../../application/interfaces/dashboard-repository-adapter.interface';
import { ILogger } from '../../application/interfaces/logger.interface';
import { DatabaseDataSource } from '../../domain/interfaces/datasources/database-datasource';
import { DashboardRepositoryAdapter } from '../adapters/dashboard-repository-adapter';
import { ConsoleLogger } from '../loggers/console-logger';
import { SupabaseDashboardRepository } from '../repositories/supabase-dashboard-repository';
import { SupabaseVideoRepository } from '../repositories/supabase-video-repository';

/**
 * Factory for creating dashboard repository and adapter instances
 * Following Factory Pattern to centralize creation logic
 */
export class DashboardRepositoryFactory {
  /**
   * Create a dashboard repository adapter
   * @param dataSource The database data source
   * @param logger Optional logger for error logging
   * @returns A dashboard repository adapter
   */
  static createAdapter(
    dataSource: DatabaseDataSource,
    logger?: ILogger
  ): IDashboardRepositoryAdapter {
    // Use ConsoleLogger as fallback if logger is not provided
    const actualLogger: Logger = logger as Logger || new ConsoleLogger();

    const dashboardRepository = new SupabaseDashboardRepository(dataSource, actualLogger);
    const videoRepository = new SupabaseVideoRepository(dataSource, actualLogger);
    return new DashboardRepositoryAdapter(dashboardRepository, videoRepository, actualLogger);
  }
}
