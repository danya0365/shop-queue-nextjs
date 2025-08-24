import { ICategoryRepositoryAdapter } from '../../interfaces/category-repository-adapter.interface';
import { IUseCase } from '../../interfaces/use-case.interface';
import { CategoryNotFoundException, CategoryRepositoryException, CategoryValidationException } from '../../exceptions/category-exceptions';

/**
 * Use case for deleting a category
 * Following SOLID principles and Clean Architecture
 * Implements IUseCase interface for Command Pattern
 */
export class DeleteCategoryUseCase implements IUseCase<string, void> {
  /**
   * Constructor with dependency injection
   * @param categoryRepository Repository for category operations
   */
  constructor(private readonly categoryAdapter: ICategoryRepositoryAdapter) {}

  /**
   * Execute the use case to delete a category
   * @param id Category ID
   * @returns Promise<void>
   * @throws CategoryNotFoundException if category not found
   * @throws CategoryRepositoryException if there's an error in the repository
   * @throws CategoryValidationException if validation fails
   */
  async execute(id: string): Promise<void> {
    try {
      // Validate ID
      if (!id || id.trim() === '') {
        throw new CategoryValidationException('Category ID cannot be empty');
      }

      // Delete category
      await this.categoryAdapter.delete(id);
    } catch (error) {
      // Handle specific errors
      if (error instanceof CategoryNotFoundException ||
          error instanceof CategoryRepositoryException) {
        throw error;
      }
      
      // Wrap other errors
      throw new CategoryRepositoryException(
        `Failed to delete category: ${(error as Error)?.message || 'Unknown error'}`,
        error
      );
    }
  }
}
