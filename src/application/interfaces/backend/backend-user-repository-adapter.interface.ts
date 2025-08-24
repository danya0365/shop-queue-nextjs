import { UserDto } from "@/src/application/dtos/backend/backend-user-dto";
import { PaginatedResultDto, PaginationParamsDto } from "@/src/application/dtos/pagination-dto";

/**
 * Interface for Backend User Repository Adapter
 * Following SOLID principles by defining a focused interface for backend user operations
 */
export interface IBackendUserRepositoryAdapter {
  /**
   * Get users with pagination
   * @param pagination Pagination parameters
   * @returns Paginated users data
   */
  getUsers(pagination: PaginationParamsDto): Promise<PaginatedResultDto<UserDto>>;
}
