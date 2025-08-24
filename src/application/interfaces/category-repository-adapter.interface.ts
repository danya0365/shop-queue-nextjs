import { CategoryDto, CreateCategoryInputDto } from '../dtos/category-dto';

/**
 * Interface for CategoryRepositoryAdapter
 * Following SOLID principles - specifically Interface Segregation and Dependency Inversion
 */
export interface ICategoryRepositoryAdapter {
  /**
   * Get all categories
   */
  getAll(): Promise<CategoryDto[]>;
  
  /**
   * Get a category by its slug
   */
  getBySlug(slug: string): Promise<CategoryDto | null>;
  
  /**
   * Get a category by its ID
   */
  getById(id: string): Promise<CategoryDto | null>;
  
  /**
   * Create a new category
   */
  create(categoryData: CreateCategoryInputDto): Promise<CategoryDto>;
  
  /**
   * Update an existing category
   */
  update(id: string, categoryData: Partial<CreateCategoryInputDto>): Promise<CategoryDto>;
  
  /**
   * Delete a category
   */
  delete(id: string): Promise<void>;
}
