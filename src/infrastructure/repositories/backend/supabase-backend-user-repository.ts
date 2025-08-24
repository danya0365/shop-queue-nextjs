import {
  UserEntity
} from "@/src/domain/entities/backend/backend-dashboard.entity";
import type { DatabaseDataSource } from "@/src/domain/interfaces/datasources/database-datasource";
import type { Logger } from "@/src/domain/interfaces/logger";
import { PaginatedResult, PaginationParams } from "@/src/domain/interfaces/pagination-types";
import { BackendUserError, BackendUserErrorType, BackendUserRepository } from "@/src/domain/repositories/backend/backend-user-repository";
import { PaginatedUsersDbSchema, UserDbSchema } from "@/src/infrastructure/schemas/backend/user-schema";
import {
  DatabaseOperationException,
  EntityNotFoundException,
} from "../../exceptions/repository-exceptions";
import { BackendRepository } from "../base/backend-repository";

/**
 * Supabase implementation of BackendUserRepository
 * Following SOLID principles and Clean Architecture
 */
export class SupabaseBackendUserRepository
  extends BackendRepository
  implements BackendUserRepository {
  /**
   * Constructor with dependency injection
   * @param dataSource Abstraction for database operations (must be admin type)
   * @param logger Abstraction for logging
   */
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger
  ) {
    super(dataSource, logger, "BackendUser");
  }

  /**
   * Get users with pagination
   * @param params Pagination parameters
   * @returns Paginated users data
   * @throws BackendUserError if the operation fails
   */
  public async getUsers(params: PaginationParams): Promise<PaginatedResult<UserEntity>> {
    try {
      this.logger.debug('Getting paginated users with RPC function', { page: params.page, limit: params.limit });

      // Call the RPC function to get paginated users with all related data
      const result = await this.dataSource.callRpc<PaginatedUsersDbSchema>('get_paginated_users', {
        p_page: params.page,
        p_limit: params.limit
      });

      if (!result || !result.users || !Array.isArray(result.users) || result.users.length === 0) {
        return {
          data: [],
          pagination: {
            currentPage: params.page,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: params.limit,
            hasNextPage: false,
            hasPrevPage: params.page > 1,
          },
        };
      }

      // Get total count from the result
      const totalCount = parseInt(String(result.total_count)) || 0;

      // Map database results to domain entities
      const users: UserEntity[] = result.users.map((user: UserDbSchema) => ({
        id: String(user.id),
        name: user.name ? String(user.name) : 'Unknown',
        email: String(user.email),
        profilesCount: parseInt(String(user.profiles_count)) || 0,
        role: user.role ? String(user.role) : 'user',
        status: user.banned_until ? 'banned' : 'active',
        createdAt: user.created_at as string
      }));

      return {
        data: users,
        pagination: {
          currentPage: params.page,
          totalPages: Math.ceil(totalCount / params.limit),
          totalItems: totalCount,
          itemsPerPage: params.limit,
          hasNextPage: params.page < Math.ceil(totalCount / params.limit),
          hasPrevPage: params.page > 1,
        },
      };
    } catch (error) {
      this.handleError(error, 'getUsers', { page: params.page, limit: params.limit });
    }
  }


  /**
   * Handle repository errors in a consistent way
   * @param error The error to handle
   * @param operation Optional operation name for better error context
   * @param context Optional additional context for the error
   * @throws BackendUserError with appropriate type and message
   */
  handleError(
    error: unknown,
    operation?: string,
    context?: Record<string, unknown>
  ): never {
    this.logger.error(
      `Backend user repository error during ${operation || "unknown operation"
      }`,
      { error, context }
    );

    // Map infrastructure exceptions to domain exceptions
    if (error instanceof EntityNotFoundException) {
      throw new BackendUserError(
        BackendUserErrorType.NOT_FOUND,
        `Backend user entity not found: ${error.message}`,
        operation,
        context,
        error
      );
    }

    if (error instanceof DatabaseOperationException) {
      throw new BackendUserError(
        BackendUserErrorType.OPERATION_FAILED,
        `Database operation failed: ${error.message}`,
        operation,
        context,
        error
      );
    }

    // For unknown errors
    if (error instanceof Error) {
      throw new BackendUserError(
        BackendUserErrorType.UNKNOWN,
        `Unexpected error: ${error.message}`,
        operation,
        context,
        error
      );
    }

    throw new BackendUserError(
      BackendUserErrorType.UNKNOWN,
      "Unknown error occurred",
      operation,
      context,
      error
    );
  }
}
