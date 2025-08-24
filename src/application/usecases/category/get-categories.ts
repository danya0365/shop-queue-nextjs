import { CategoryDto } from '../../dtos/category-dto';
import { CategoryRepositoryException } from '../../exceptions/category-exceptions';
import { ICategoryRepositoryAdapter } from '../../interfaces/category-repository-adapter.interface';

/**
 * Use case for retrieving all categories
 * Following SOLID principles and Clean Architecture
 */
export class GetCategoriesUseCase {
  /**
   * Constructor with dependency injection
   * @param categoryAdapter Adapter for category operations
   */
  constructor(private readonly categoryAdapter: ICategoryRepositoryAdapter) {}

  /**
   * Execute the use case to get all categories
   * @returns Array of category DTOs
   * @throws CategoryRepositoryException if there's an error in the repository
   */
  async execute(): Promise<CategoryDto[]> {
    try {
      // Get categories directly as DTOs from adapter
      return await this.categoryAdapter.getAll();
    } catch (error) {
      // Error is already wrapped by adapter
      if (error instanceof CategoryRepositoryException) {
        throw error;
      }
      // Wrap any other errors
      throw new CategoryRepositoryException(
        `Failed to get categories: ${(error as Error)?.message || 'Unknown error'}`,
        error
      );
    }
  }
}
