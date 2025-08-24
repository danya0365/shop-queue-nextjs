import {
  BackendActivityEntity,
  DailyViewsEntity,
  DashboardStatsEntity,
  MonthlyNewVideosEntity,
  PopularVideoEntity,
  RecentProfileEntity,
  SystemHealthEntity
} from "@/src/domain/entities/backend/backend-dashboard.entity";
import type { DatabaseDataSource } from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";
import {
  BackendDashboardError,
  BackendDashboardErrorType,
  BackendDashboardRepository,
} from "@/src/domain/repositories/backend/backend-dashboard-repository";
import {
  DatabaseOperationException,
  EntityNotFoundException,
} from "../../exceptions/repository-exceptions";
import { SupabaseBackendDashboardMapper } from "../../mappers/backend/supabase-backend-dashboard-mapper";
import {
  BackendActivityDbSchema,
  DashboardStatsDbSchema,
  PopularVideoDbSchema,
  RecentProfileDbSchema,
  SystemHealthDbSchema,
} from "../../schemas/backend/dashboard-schema";
import { BackendRepository } from "../base/backend-repository";

/**
 * Supabase implementation of BackendDashboardRepository
 * Following SOLID principles and Clean Architecture
 */
export class SupabaseBackendDashboardRepository
  extends BackendRepository
  implements BackendDashboardRepository {
  /**
   * Constructor with dependency injection
   * @param dataSource Abstraction for database operations (must be admin type)
   * @param logger Abstraction for logging
   */
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger
  ) {
    super(dataSource, logger, "BackendDashboard");
  }

  /**
   * Handle repository errors in a consistent way
   * @param error The error to handle
   * @param operation Optional operation name for better error context
   * @param context Optional additional context for the error
   * @throws BackendDashboardError with appropriate type and message
   */
  handleError(
    error: unknown,
    operation?: string,
    context?: Record<string, unknown>
  ): never {
    this.logger.error(
      `Backend dashboard repository error during ${operation || "unknown operation"
      }`,
      { error, context }
    );

    // Map infrastructure exceptions to domain exceptions
    if (error instanceof EntityNotFoundException) {
      throw new BackendDashboardError(
        BackendDashboardErrorType.NOT_FOUND,
        `Backend dashboard entity not found: ${error.message}`,
        operation,
        context,
        error
      );
    }

    if (error instanceof DatabaseOperationException) {
      throw new BackendDashboardError(
        BackendDashboardErrorType.OPERATION_FAILED,
        `Database operation failed: ${error.message}`,
        operation,
        context,
        error
      );
    }

    // For unknown errors
    if (error instanceof Error) {
      throw new BackendDashboardError(
        BackendDashboardErrorType.UNKNOWN,
        `Unexpected error: ${error.message}`,
        operation,
        context,
        error
      );
    }

    throw new BackendDashboardError(
      BackendDashboardErrorType.UNKNOWN,
      "Unknown error occurred",
      operation,
      context,
      error
    );
  }

  /**
   * Get system health status
   * @returns System health data or null if not available
   * @throws BackendDashboardError if operation fails
   */
  async getSystemHealth(): Promise<SystemHealthEntity | null> {
    try {
      this.logger.info("Fetching system health data using RPC");

      // Use the abstracted callRpc method to call the RPC function
      this.logger.debug("Calling RPC: get_system_health with no parameters");
      const data = await this.dataSource.callRpc<SystemHealthDbSchema[]>(
        "get_system_health",
        {}
      );

      this.logger.debug("RPC get_system_health response received", {
        dataReceived: !!data,
        isArray: Array.isArray(data),
        length: data ? (Array.isArray(data) ? data.length : "not an array") : 0,
      });

      if (!data || !Array.isArray(data) || data.length === 0) {
        this.logger.warn("No system health data returned");
        return null;
      }

      // Map the response to our domain entity using the mapper
      return SupabaseBackendDashboardMapper.toSystemHealthDomain(data[0]);
    } catch (error) {
      return this.handleError(error, "getSystemHealth", {
        operation: "get_system_health",
      });
    }
  }

  /**
   * Get recent backend activities
   * @param limit Maximum number of activities to return (default: 10)
   * @returns List of recent activities
   * @throws BackendDashboardError if operation fails
   */
  async getRecentActivities(
    limit: number = 10
  ): Promise<BackendActivityEntity[]> {
    try {
      this.logger.info("Fetching recent backend activities using RPC", {
        limit,
      });

      // Use the abstracted callRpc method to call the RPC function
      this.logger.debug("Calling RPC: get_recent_backend_activities", {
        parameters: { limit_count: limit },
      });
      const data = await this.dataSource.callRpc<BackendActivityDbSchema[]>(
        "get_recent_backend_activities",
        { limit_count: limit }
      );

      this.logger.debug("RPC get_recent_backend_activities response received", {
        dataReceived: !!data,
        isArray: Array.isArray(data),
        length: data ? (Array.isArray(data) ? data.length : "not an array") : 0,
      });

      if (!data || !Array.isArray(data)) {
        this.logger.warn("Invalid or no backend activities data returned");
        return [];
      }

      if (data.length === 0) {
        this.logger.debug("No backend activities found");
        return [];
      }

      // Map the response to our domain entity using the mapper
      return SupabaseBackendDashboardMapper.toBackendActivityDomainList(data);
    } catch (error) {
      return this.handleError(error, "getRecentActivities", {
        operation: "get_recent_backend_activities",
        limit,
      });
    }
  }

  /**
   * Get dashboard statistics
   * @returns Dashboard statistics data
   * @throws BackendDashboardError if the operation fails
   */
  async getDashboardStats(): Promise<DashboardStatsEntity> {
    try {
      this.logger.info("Fetching dashboard statistics using RPC");

      this.logger.debug("Calling RPC: get_dashboard_stats with no parameters");
      const data = await this.dataSource.callRpc<DashboardStatsDbSchema[]>(
        "get_dashboard_stats",
        {}
      );

      this.logger.debug("RPC get_dashboard_stats response received", {
        dataReceived: !!data,
        isArray: Array.isArray(data),
        length: data ? (Array.isArray(data) ? data.length : "not an array") : 0,
      });

      if (!data) {
        this.logger.warn(
          "RPC get_dashboard_stats returned null or undefined data"
        );
        throw new Error("No dashboard statistics returned");
      }

      if (!Array.isArray(data)) {
        this.logger.warn("RPC get_dashboard_stats did not return an array", {
          actualType: typeof data,
        });
        throw new Error("Invalid dashboard statistics format");
      }

      if (data.length === 0) {
        this.logger.warn("RPC get_dashboard_stats returned empty array");
        throw new Error("No dashboard statistics returned");
      }

      // Use the mapper to convert the database schema to a domain entity
      return SupabaseBackendDashboardMapper.toDashboardStatsEntity(data[0]);
    } catch (error) {
      return this.handleError(error, "getDashboardStats");
    }
  }

  /**
   * Get popular videos
   * @param limit Maximum number of videos to return (default: 5)
   * @returns List of popular videos
   * @throws BackendDashboardError if the operation fails
   */
  async getPopularVideos(limit: number = 5): Promise<PopularVideoEntity[]> {
    try {
      this.logger.info("Fetching popular videos using RPC", { limit });

      // Use the abstracted callRpc method to call the RPC function
      this.logger.debug("Calling RPC: get_popular_videos", {
        parameters: { limit_count: limit },
      });
      const data = await this.dataSource.callRpc<PopularVideoDbSchema[]>(
        "get_popular_videos",
        { limit_count: limit }
      );

      this.logger.debug("RPC get_popular_videos response received", {
        dataReceived: !!data,
        isArray: Array.isArray(data),
        length: data ? (Array.isArray(data) ? data.length : "not an array") : 0,
      });

      if (!data) {
        this.logger.warn(
          "RPC get_popular_videos returned null or undefined data"
        );
        return [];
      }

      if (!Array.isArray(data)) {
        this.logger.warn("RPC get_popular_videos did not return an array", {
          actualType: typeof data,
        });
        return [];
      }

      // Log the actual data received for debugging
      if (data.length > 0) {
        this.logger.debug("Popular videos data sample", {
          firstVideo: JSON.stringify(data[0]),
          lastVideo:
            data.length > 1 ? JSON.stringify(data[data.length - 1]) : "N/A",
        });
      } else {
        this.logger.debug("No popular videos returned from RPC");
      }

      this.logger.debug(`Processed ${data.length} popular videos`);

      // Use the mapper to convert database schema to domain entities
      return SupabaseBackendDashboardMapper.toPopularVideoEntityList(data);
    } catch (error) {
      return this.handleError(error, "getPopularVideos", { limit });
    }
  }

  /**
   * Get recent user profiles
   * @param limit Maximum number of profiles to return (default: 5)
   * @returns List of recent user profiles
   * @throws BackendDashboardError if the operation fails
   */
  async getRecentProfiles(limit: number = 5): Promise<RecentProfileEntity[]> {
    try {
      this.logger.info("Fetching recent profiles using RPC", { limit });

      try {
        // Use the abstracted callRpc method to call the RPC function
        this.logger.debug("Calling RPC: get_recent_profiles", {
          parameters: { limit_count: limit },
        });
        const data = await this.dataSource.callRpc<RecentProfileDbSchema[]>(
          "get_recent_profiles",
          { limit_count: limit }
        );

        this.logger.debug("RPC get_recent_profiles response received", {
          dataReceived: !!data,
          isArray: Array.isArray(data),
          length: data
            ? Array.isArray(data)
              ? data.length
              : "not an array"
            : 0,
        });

        if (!data) {
          this.logger.warn(
            "RPC get_recent_profiles returned null or undefined data"
          );
          return [];
        }

        if (!Array.isArray(data)) {
          this.logger.warn("RPC get_recent_profiles did not return an array", {
            actualType: typeof data,
          });
          return [];
        }

        // Log the actual data received for debugging
        if (data.length > 0) {
          this.logger.debug("Recent profiles data sample", {
            firstProfile: JSON.stringify(data[0]),
            lastProfile:
              data.length > 1 ? JSON.stringify(data[data.length - 1]) : "N/A",
          });
        } else {
          this.logger.debug("No recent profiles returned from RPC");
        }

        this.logger.debug(`Processed ${data.length} recent profiles`);

        // Use the mapper to convert database schema to domain entities
        return SupabaseBackendDashboardMapper.toRecentProfileEntityList(data);
      } catch (rpcError) {
        this.logger.error("Error calling RPC get_recent_profiles", {
          error: rpcError,
          limit,
        });
        throw rpcError;
      }
    } catch (error) {
      return this.handleError(error, "getRecentProfiles", { limit });
    }
  }

  /**
   * Get daily views data for the last n days
   * @param days Number of days to retrieve data for (default: 7)
   * @returns Daily views data
   * @throws BackendDashboardError if the operation fails
   */
  async getDailyViews(days: number = 7): Promise<DailyViewsEntity> {
    try {
      this.logger.info("Fetching daily views data using RPC", { days });

      try {
        // Use the abstracted callRpc method to call the RPC function
        this.logger.debug("Calling RPC: get_daily_views", {
          parameters: { days_count: days },
        });

        // Define a schema for the database response
        interface DailyViewsDbSchema {
          date: string;
          count: number;
        }

        const data = await this.dataSource.callRpc<DailyViewsDbSchema[]>(
          "get_daily_views",
          { days_count: days }
        );

        this.logger.debug("RPC get_daily_views response received", {
          dataReceived: !!data,
          isArray: Array.isArray(data),
          length: data ? (Array.isArray(data) ? data.length : "not an array") : 0,
        });

        if (!data || !Array.isArray(data)) {
          this.logger.warn("RPC get_daily_views did not return valid data");
          // Return empty data with zeros
          return {
            data: [],
            totalViews: 0,
            averageViews: 0
          };
        }

        // Calculate total and average views
        const totalViews = data.reduce((sum, item) => sum + item.count, 0);
        const averageViews = data.length > 0 ? Math.round(totalViews / data.length) : 0;

        // Map the database schema to domain entity
        const dailyViewsEntity: DailyViewsEntity = {
          data: data.map(item => ({
            date: item.date,
            count: item.count
          })),
          totalViews,
          averageViews
        };

        return dailyViewsEntity;
      } catch (rpcError) {
        this.logger.error("Error calling RPC get_daily_views", {
          error: rpcError,
          days,
        });
        throw rpcError;
      }
    } catch (error) {
      return this.handleError(error, "getDailyViews", { days });
    }
  }

  /**
   * Get monthly new videos data for the last n months
   * @param months Number of months to retrieve data for (default: 6)
   * @returns Monthly new videos data
   * @throws BackendDashboardError if the operation fails
   */
  async getMonthlyNewVideos(months: number = 6): Promise<MonthlyNewVideosEntity> {
    try {
      this.logger.info("Fetching monthly new videos data using RPC", { months });

      try {
        // Use the abstracted callRpc method to call the RPC function
        this.logger.debug("Calling RPC: get_monthly_new_videos", {
          parameters: { months_count: months },
        });

        // Define a schema for the database response
        interface MonthlyNewVideosDbSchema {
          month: string;
          count: number;
        }

        const data = await this.dataSource.callRpc<MonthlyNewVideosDbSchema[]>(
          "get_monthly_new_videos",
          { months_count: months }
        );

        this.logger.debug("RPC get_monthly_new_videos response received", {
          dataReceived: !!data,
          isArray: Array.isArray(data),
          length: data ? (Array.isArray(data) ? data.length : "not an array") : 0,
        });

        if (!data || !Array.isArray(data)) {
          this.logger.warn("RPC get_monthly_new_videos did not return valid data");
          // Return empty data with zeros
          return {
            data: [],
            totalVideos: 0,
            averageVideosPerMonth: 0
          };
        }

        // Calculate total and average videos
        const totalVideos = data.reduce((sum, item) => sum + item.count, 0);
        const averageVideosPerMonth = data.length > 0 ? Math.round(totalVideos / data.length) : 0;

        // Map the database schema to domain entity
        const monthlyNewVideosEntity: MonthlyNewVideosEntity = {
          data: data.map(item => ({
            month: item.month,
            count: item.count
          })),
          totalVideos,
          averageVideosPerMonth
        };

        return monthlyNewVideosEntity;
      } catch (rpcError) {
        this.logger.error("Error calling RPC get_monthly_new_videos", {
          error: rpcError,
          months,
        });
        throw rpcError;
      }
    } catch (error) {
      return this.handleError(error, "getMonthlyNewVideos", { months });
    }
  }
}
