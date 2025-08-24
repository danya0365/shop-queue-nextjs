import { UserDto } from "@/src/application/dtos/backend/backend-user-dto";
import { PaginatedResultDto, PaginationParamsDto } from "@/src/application/dtos/pagination-dto";
import { BackendUserMapper } from "@/src/application/mappers/backend/backend-user-mapper";
import { BackendUserRepositoryException } from "@/src/domain/exceptions/backend/backend-user-repository-exception";
import { Logger } from "@/src/domain/interfaces/logger";
import type { BackendUserRepository } from "@/src/domain/repositories/backend/backend-user-repository";
import type { IBackendUserRepositoryAdapter } from "../../../application/interfaces/backend/backend-user-repository-adapter.interface";

/**
 * Adapter for Backend Users Repository
 * Follows Clean Architecture principles by adapting domain repository to application layer
 */
export class BackendUserRepositoryAdapter
  implements IBackendUserRepositoryAdapter {
  /**
   * Constructor with dependency injection
   * @param repository Domain repository implementation
   * @param logger Logger instance
   */
  constructor(
    private readonly repository: BackendUserRepository,
    private readonly logger?: Logger
  ) { }

  /**
   * Get users with pagination
   * @param pagination Pagination parameters
   * @returns Paginated users data with total count
   */
  async getUsers(
    pagination: PaginationParamsDto
  ): Promise<PaginatedResultDto<UserDto>> {
    try {
      this.logger?.debug("Getting users with pagination", { page: pagination.page, limit: pagination.limit });

      // Use the repository's getUsers method which returns domain entities
      const result = await this.repository.getUsers(pagination);

      // Use the mapper to convert domain entities to DTOs with pagination
      return BackendUserMapper.toPaginatedUsersDto(result);
    } catch (error: unknown) {
      this.logger?.error(
        `Error getting users data (page: ${pagination.page}, limit: ${pagination.limit}): ${error instanceof Error ? error.message : String(error)
        }`
      );
      throw new BackendUserRepositoryException(
        "Failed to get users data",
        error instanceof Error ? error : undefined
      );
    }
  }
}
