import { UserDto } from "@/src/application/dtos/backend/backend-user-dto";
import {
  PaginatedResultDto,
  PaginationParamsDto
} from "@/src/application/dtos/pagination-dto";
import { BackendUserUseCaseFactory } from "@/src/application/factories/backend/backend-user-use-case.factory";
import { ErrorHandlingDecorator } from "../../decorators/error-handling.decorator";
import type { IBackendUserRepositoryAdapter } from "../../interfaces/backend/backend-user-repository-adapter.interface";
import type { IBackendUserService } from "../../interfaces/backend/backend-user-service.interface";
import type { ILogger } from "../../interfaces/logger.interface";
import type { IUseCase } from "../../interfaces/use-case.interface";

/**
 * Service class for backend user operations
 * Following SOLID principles and Clean Architecture
 * Using Factory Pattern, Command Pattern, and Decorator Pattern
 */
export class BackendUserService implements IBackendUserService {
  private readonly getUsersUseCase: IUseCase<PaginationParamsDto, PaginatedResultDto<UserDto>>;

  /**
   * Constructor with dependency injection
   * @param backendUserAdapter Adapter for backend user operations
   * @param logger Optional logger for error logging
   */
  constructor(
    private readonly backendUserAdapter: IBackendUserRepositoryAdapter,
    private readonly logger?: ILogger
  ) {
    // Create use cases using factory and decorate them with error handling
    this.getUsersUseCase = new ErrorHandlingDecorator(
      BackendUserUseCaseFactory.createGetUsersUseCase(backendUserAdapter),
      logger
    );
  }

  /**
   * Get users with pagination
   * @param pagination Pagination parameters
   * @returns Paginated users data
   */
  async getUsers(
    pagination: PaginationParamsDto
  ): Promise<PaginatedResultDto<UserDto>> {
    // Error handling is managed by the decorator
    return await this.getUsersUseCase.execute({
      page: pagination.page,
      limit: pagination.limit,
    });
  }
}
