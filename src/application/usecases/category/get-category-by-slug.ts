import { CategoryDto } from '../../dtos/category-dto';
import { CategoryRepositoryException } from '../../exceptions/category-exceptions';
import { ICategoryRepositoryAdapter } from '../../interfaces/category-repository-adapter.interface';

/**
 * Use case for retrieving a category by slug
 * Following SOLID principles and Clean Architecture
 */
export class GetCategoryBySlugUseCase {
  /**
   * Constructor with dependency injection
   * @param categoryAdapter Adapter for category operations
   */
  constructor(private readonly categoryAdapter: ICategoryRepositoryAdapter) {}

  /**
   * Execute the use case to get a category by slug
   * @param slug Category slug
   * @returns Category DTO or null if not found
   * @throws CategoryRepositoryException if there's an error in the repository
   */
  async execute(slug: string): Promise<CategoryDto | null> {
    try {
      // Get category directly as DTO from adapter
      return await this.categoryAdapter.getBySlug(slug);
    } catch (error) {
      // Error is already wrapped by adapter
      if (error instanceof CategoryRepositoryException) {
        throw error;
      }
      // Wrap any other errors
      throw new CategoryRepositoryException(
        `Failed to get category by slug: ${(error as Error)?.message || 'Unknown error'}`,
        error
      );
    }
  }
}
