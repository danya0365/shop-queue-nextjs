import { ICategoryRepositoryAdapter } from '../../interfaces/category-repository-adapter.interface';
import { CreateCategoryInputDto, CategoryDto, createCategoryInputSchema } from '../../dtos/category-dto';

import { 
  CategoryValidationException, 
  CategoryRepositoryException,
  CategoryAlreadyExistsException 
} from '../../exceptions/category-exceptions';

/**
 * Use case for creating a new category
 * Following the Clean Architecture pattern and SOLID principles
 */
export class CreateCategoryUseCase {
  /**
   * Constructor with dependency injection
   * @param categoryRepository Repository for category operations
   */
  constructor(private readonly categoryAdapter: ICategoryRepositoryAdapter) {}

  /**
   * Execute the use case to create a new category
   * @param categoryData Input DTO with category data
   * @returns Output DTO with created category data
   * @throws CategoryValidationException if input validation fails
   * @throws CategoryAlreadyExistsException if a category with the same slug already exists
   * @throws CategoryRepositoryException if there's an error in the repository
   */
  async execute(categoryData: CreateCategoryInputDto): Promise<CategoryDto> {
    try {
      // Validate input data
      const validationResult = createCategoryInputSchema.safeParse(categoryData);
      if (!validationResult.success) {
        throw new CategoryValidationException(
          validationResult.error.errors.map(err => err.message).join(', ')
        );
      }
      
      // Use adapter to create category and return DTO directly
      return await this.categoryAdapter.create(categoryData);
    } catch (error) {
      // Handle specific errors
      if (error instanceof CategoryValidationException ||
          error instanceof CategoryAlreadyExistsException ||
          error instanceof CategoryRepositoryException) {
        throw error;
      }
      
      // Wrap other errors
      throw new CategoryRepositoryException(
        `Failed to create category: ${(error as Error)?.message || 'Unknown error'}`,
        error
      );
    }
  }
}
