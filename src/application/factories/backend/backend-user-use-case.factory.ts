import { IBackendUserRepositoryAdapter } from '../../interfaces/backend/backend-user-repository-adapter.interface';
import { GetUsersUseCase } from '../../usecases/backend/user/get-users';

/**
 * Factory for creating backend user use cases
 * Following SOLID principles with Factory Pattern
 */
export class BackendUserUseCaseFactory {
  /**
   * Create GetUsers use case
   * @param backendUserAdapter Adapter for backend user operations
   * @returns GetUsersUseCase instance
   */
  static createGetUsersUseCase(
    backendUserAdapter: IBackendUserRepositoryAdapter
  ): GetUsersUseCase {
    return new GetUsersUseCase(backendUserAdapter);
  }
}
