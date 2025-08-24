import { ICategoryRepositoryAdapter } from '../../interfaces/category-repository-adapter.interface';
import { CategoryDto, CreateCategoryInputDto } from '../../dtos/category-dto';
import { IUseCase } from '../../interfaces/use-case.interface';

import { CategoryNotFoundException, CategoryRepositoryException, CategoryValidationException } from '../../exceptions/category-exceptions';

/**
 * Input DTO for UpdateCategoryUseCase
 */
export interface UpdateCategoryInput {
  id: string;
  data: Partial<CreateCategoryInputDto>;
}
import { z } from 'zod';

/**
 * Use case for updating an existing category
 * Following SOLID principles and Clean Architecture
 * Implements IUseCase interface for Command Pattern
 */
export class UpdateCategoryUseCase implements IUseCase<UpdateCategoryInput, CategoryDto> {
  /**
   * Constructor with dependency injection
   * @param categoryRepository Repository for category operations
   */
  constructor(private readonly categoryAdapter: ICategoryRepositoryAdapter) {}

  /**
   * Execute the use case to update an existing category
   * @param input Object containing id and category data
   * @returns Updated category as DTO
   * @throws CategoryNotFoundException if category not found
   * @throws CategoryRepositoryException if there's an error in the repository
   * @throws CategoryValidationException if validation fails
   */
  async execute(input: UpdateCategoryInput): Promise<CategoryDto> {
    const { id, data: categoryData } = input;
    try {
      // Validate ID
      if (!id || id.trim() === '') {
        throw new CategoryValidationException('Category ID cannot be empty');
      }

      // Validate input data if provided
      if (Object.keys(categoryData).length > 0) {
        // Create a partial schema based on the CreateCategoryInputDto schema
        const updateSchema = z.object({
          name: z.string().min(2).max(100).optional(),
          slug: z.string().min(2).max(100).optional(),
          description: z.string().optional().nullable(),
        });

        try {
          updateSchema.parse(categoryData);
        } catch (validationError) {
          throw new CategoryValidationException(
            'Invalid category data',
            validationError
          );
        }
      }

      // Use adapter to update category and return DTO directly
      return await this.categoryAdapter.update(id, categoryData);
    } catch (error) {
      // Handle specific errors
      if (error instanceof CategoryNotFoundException ||
          error instanceof CategoryValidationException ||
          error instanceof CategoryRepositoryException) {
        throw error;
      }
      
      // Wrap other errors
      throw new CategoryRepositoryException(
        `Failed to update category: ${(error as Error)?.message || 'Unknown error'}`,
        error
      );
    }
  }
}
