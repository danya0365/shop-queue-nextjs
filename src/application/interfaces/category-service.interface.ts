import { CategoryDto, CreateCategoryInputDto } from "../dtos/category-dto";

/**
 * Interface for category service
 * Follows the Interface Segregation Principle by defining a clear contract
 */
export interface ICategoryService {
  /**
   * Get all categories
   * @returns Array of category DTOs
   */
  getAllCategories(): Promise<CategoryDto[]>;

  /**
   * Get a category by slug
   * @param slug Category slug
   * @returns Category DTO or null if not found
   */
  getCategoryBySlug(slug: string): Promise<CategoryDto | null>;

  /**
   * Get a category by ID
   * @param id Category ID
   * @returns Category DTO or null if not found
   */
  getCategoryById(id: string): Promise<CategoryDto | null>;

  /**
   * Create a new category
   * @param categoryData Data for the new category
   * @returns Created category as DTO
   */
  createCategory(categoryData: CreateCategoryInputDto): Promise<CategoryDto>;

  /**
   * Update a category
   * @param id Category ID
   * @param categoryData Updated category data
   * @returns Updated category as DTO
   */
  updateCategory(
    id: string,
    categoryData: Partial<CreateCategoryInputDto>
  ): Promise<CategoryDto>;

  /**
   * Delete a category
   * @param id Category ID
   * @returns Promise<void>
   */
  deleteCategory(id: string): Promise<void>;
}
