import { ErrorHandlingDecorator } from "../decorators/error-handling.decorator";
import { CategoryDto, CreateCategoryInputDto } from "../dtos/category-dto";
import { CategoryUseCaseFactory } from "../factories/category-use-case.factory";
import type { ICategoryRepositoryAdapter } from "../interfaces/category-repository-adapter.interface";
import type { ICategoryService } from "../interfaces/category-service.interface";
import type { ILogger } from "../interfaces/logger.interface";
import type { IUseCase } from "../interfaces/use-case.interface";

/**
 * Service class for category operations
 * Following SOLID principles and Clean Architecture
 * Using Factory Pattern, Command Pattern, and Decorator Pattern
 */
export class CategoryService implements ICategoryService {
  private getCategoriesUseCase: IUseCase<void, CategoryDto[]>;
  private getCategoryBySlugUseCase: IUseCase<string, CategoryDto | null>;
  private getCategoryByIdUseCase: IUseCase<string, CategoryDto | null>;
  private createCategoryUseCase: IUseCase<CreateCategoryInputDto, CategoryDto>;
  private updateCategoryUseCase: IUseCase<
    { id: string; data: Partial<CreateCategoryInputDto> },
    CategoryDto
  >;
  private deleteCategoryUseCase: IUseCase<string, void>;

  /**
   * Constructor with dependency injection
   * @param categoryAdapter Adapter for category operations
   * @param logger Optional logger for error logging
   */
  constructor(
    private readonly categoryAdapter: ICategoryRepositoryAdapter,
    private readonly logger?: ILogger
  ) {
    // Create use cases using factory and decorate them with error handling
    this.getCategoriesUseCase = new ErrorHandlingDecorator(
      CategoryUseCaseFactory.createGetCategoriesUseCase(categoryAdapter),
      logger
    );

    this.getCategoryBySlugUseCase = new ErrorHandlingDecorator(
      CategoryUseCaseFactory.createGetCategoryBySlugUseCase(categoryAdapter),
      logger
    );

    this.getCategoryByIdUseCase = new ErrorHandlingDecorator(
      CategoryUseCaseFactory.createGetCategoryByIdUseCase(categoryAdapter),
      logger
    );

    this.createCategoryUseCase = new ErrorHandlingDecorator(
      CategoryUseCaseFactory.createCreateCategoryUseCase(categoryAdapter),
      logger
    );

    this.updateCategoryUseCase = new ErrorHandlingDecorator(
      CategoryUseCaseFactory.createUpdateCategoryUseCase(categoryAdapter),
      logger
    );

    this.deleteCategoryUseCase = new ErrorHandlingDecorator(
      CategoryUseCaseFactory.createDeleteCategoryUseCase(categoryAdapter),
      logger
    );
  }

  /**
   * Get all categories
   * @returns Array of category DTOs
   */
  async getAllCategories(): Promise<CategoryDto[]> {
    // Error handling is now managed by the decorator
    return this.getCategoriesUseCase.execute();
  }

  /**
   * Get a category by slug
   * @param slug Category slug
   * @returns Category DTO or null if not found
   */
  async getCategoryBySlug(slug: string): Promise<CategoryDto | null> {
    // Error handling is now managed by the decorator
    return this.getCategoryBySlugUseCase.execute(slug);
  }

  /**
   * Get a category by ID
   * @param id Category ID
   * @returns Category DTO or null if not found
   */
  async getCategoryById(id: string): Promise<CategoryDto | null> {
    // Error handling is now managed by the decorator
    return this.getCategoryByIdUseCase.execute(id);
  }

  /**
   * Create a new category
   * @param categoryData Data for the new category
   * @returns Created category as DTO
   */
  async createCategory(
    categoryData: CreateCategoryInputDto
  ): Promise<CategoryDto> {
    // Error handling is now managed by the decorator
    return this.createCategoryUseCase.execute(categoryData);
  }

  /**
   * Update a category
   * @param id Category ID
   * @param categoryData Updated category data
   * @returns Updated category as DTO
   */
  async updateCategory(
    id: string,
    categoryData: Partial<CreateCategoryInputDto>
  ): Promise<CategoryDto> {
    // Error handling is now managed by the decorator
    return this.updateCategoryUseCase.execute({ id, data: categoryData });
  }

  /**
   * Delete a category
   * @param id Category ID
   * @returns Promise<void>
   */
  async deleteCategory(id: string): Promise<void> {
    // Error handling is now managed by the decorator
    return this.deleteCategoryUseCase.execute(id);
  }
}
