import { ICategoryRepositoryAdapter } from '../../interfaces/category-repository-adapter.interface';
import { CategoryDto } from '../../dtos/category-dto';

import { CategoryRepositoryException } from '../../exceptions/category-exceptions';

/**
 * Use case for getting a category by its ID
 * Following the Clean Architecture pattern
 */
export class GetCategoryByIdUseCase {
  /**
   * Constructor with dependency injection
   * @param categoryRepository Repository for category operations
   */
  constructor(private readonly categoryAdapter: ICategoryRepositoryAdapter) {}

  /**
   * Execute the use case to get a category by ID
   * @param id Category ID
   * @returns Category DTO or null if not found
   * @throws CategoryRepositoryException if there's an error in the repository
   */
  async execute(id: string): Promise<CategoryDto | null> {
    try {
      // Get category directly as DTO from adapter
      return await this.categoryAdapter.getById(id);
    } catch (error) {
      // Error is already wrapped by adapter
      if (error instanceof CategoryRepositoryException) {
        throw error;
      }
      // Wrap any other errors
      throw new CategoryRepositoryException(
        `Failed to get category by ID: ${(error as Error)?.message || 'Unknown error'}`,
        error
      );
    }
  }
}
