import { Logger } from "@/src/domain/interfaces/logger";
import type { DatabaseDataSource } from "../../domain/interfaces/datasources/database-datasource";
import { DashboardError, DashboardErrorType, DashboardRepository } from "../../domain/repositories/dashboard-repository";
import { DatabaseOperationException, EntityNotFoundException } from "../exceptions/repository-exceptions";
import { SupabaseVideoMapper } from "../mappers/supabase-video-mapper";
import { DashboardData, DashboardDataDbSchema } from "../schemas/video-schema";
import { StandardRepository } from "./base/standard-repository";

/**
 * Supabase implementation of DashboardRepository
 * Following SOLID principles and Clean Architecture
 */
export class SupabaseDashboardRepository extends StandardRepository implements DashboardRepository {
  /**
   * Constructor with dependency injection
   * @param dataSource Abstraction for database operations
   * @param logger Abstraction for logging
   */
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger
  ) {
    super(dataSource, logger, "Dashboard", false);
  }

  /**
   * Get user dashboard data using the Supabase get_user_dashboard function
   * This uses the RPC function defined in the migrations which gets data for the active profile
   * @returns Dashboard data or null if not found
   * @throws DatabaseOperationException if there's an error in the database operation
   */
  /**
   * Handle repository errors in a consistent way
   * @param error The error to handle
   * @param operation Optional operation name for better error context
   * @param context Optional additional context for the error
   * @throws DashboardError with appropriate type and message
   */
  handleError(error: unknown, operation?: string, context?: Record<string, unknown>): never {
    this.logger.error(`Dashboard repository error during ${operation || 'unknown operation'}`, { error, context });

    // Map infrastructure exceptions to domain exceptions
    if (error instanceof EntityNotFoundException) {
      throw new DashboardError(
        DashboardErrorType.NOT_FOUND,
        `Dashboard data not found: ${error.message}`,
        operation,
        context,
        error
      );
    }

    if (error instanceof DatabaseOperationException) {
      throw new DashboardError(
        DashboardErrorType.OPERATION_FAILED,
        `Database operation failed: ${error.message}`,
        operation,
        context,
        error
      );
    }

    // For unknown errors
    if (error instanceof Error) {
      throw new DashboardError(
        DashboardErrorType.UNKNOWN,
        `Unexpected error: ${error.message}`,
        operation,
        context,
        error
      );
    }

    throw new DashboardError(
      DashboardErrorType.UNKNOWN,
      'Unknown error occurred',
      operation,
      context,
      error
    );
  }

  async getUserDashboard(): Promise<DashboardData | null> {
    try {
      // Use the abstracted callRpc method to call the RPC function
      const data = await this.dataSource.callRpc<DashboardDataDbSchema[]>(
        "get_user_dashboard"
      );

      if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
      }

      // Map the response to our domain entity using the mapper
      return SupabaseVideoMapper.toDashboardDomain(data[0]);
    } catch (error) {
      return this.handleError(error, "getUserDashboard", { operation: "get_user_dashboard" });
    }
  }
}
