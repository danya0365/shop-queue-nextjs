import { UserDto } from "@/src/application/dtos/backend/backend-user-dto";
import { PaginatedResultDto } from "@/src/application/dtos/pagination-dto";
import { IBackendUserRepositoryAdapter } from "@/src/application/interfaces/backend/backend-user-repository-adapter.interface";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { Logger } from '@/src/domain/interfaces/logger';

/**
 * Use case for getting paginated videos by user
 * Following Single Responsibility Principle by handling only one operation
 */
export class GetUsersUseCase
  implements
    IUseCase<{ page: number; limit: number }, PaginatedResultDto<UserDto>>
{
  constructor(
    private backendUserAdapter: IBackendUserRepositoryAdapter,
    private logger?: Logger
  ) {}

  async execute({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<PaginatedResultDto<UserDto>> {
    try {
      // Use database-level pagination through the adapter
      const result = await this.backendUserAdapter.getUsers({ page, limit });

      return {
        data: result.data,
        pagination: result.pagination,
      };
    } catch (error) {
      this.logger?.error("Error getting paginated videos by user", error, {
        page,
        limit,
      });
      return {
        data: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: limit,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }
  }
}
