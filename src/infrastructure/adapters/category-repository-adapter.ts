import { CategoryDto, CreateCategoryInputDto } from '../../application/dtos/category-dto';
import {
  CategoryAlreadyExistsException,
  CategoryNotFoundException,
  CategoryRepositoryException
} from '../../application/exceptions/category-exceptions';
import { CategoryMapper } from '../../application/mappers/category-mapper';
import { CategoryCreate } from '../../domain/entities/category';
import { CategoryRepository, CategoryError, CategoryErrorType } from '../../domain/repositories/category-repository';

/**
 * Adapter for CategoryRepository that converts between domain entities and DTOs
 * Following Clean Architecture by separating infrastructure and application layers
 */
export class CategoryRepositoryAdapter {
  /**
   * Constructor with dependency injection
   * @param repository The actual repository implementation
   */
  constructor(private readonly repository: CategoryRepository) {}

  /**
   * Get all categories as DTOs
   * @returns Array of category DTOs
   * @throws CategoryRepositoryException if there's an error in the repository
   */
  async getAll(): Promise<CategoryDto[]> {
    try {
      const categories = await this.repository.getAll();
      return categories.map(category => CategoryMapper.toDto(category));
    } catch (error) {
      if (error instanceof CategoryError) {
        throw this.mapDomainErrorToApplicationError(error);
      }
      throw error;
    }
  }

  /**
   * Get a category by ID as DTO
   * @param id Category ID
   * @returns Category DTO or null if not found
   * @throws CategoryRepositoryException if there's an error in the repository
   */
  async getById(id: string): Promise<CategoryDto | null> {
    try {
      const category = await this.repository.getById(id);
      return category ? CategoryMapper.toDto(category) : null;
    } catch (error) {
      if (error instanceof CategoryError) {
        throw this.mapDomainErrorToApplicationError(error);
      }
      throw error;
    }
  }

  /**
   * Get a category by slug as DTO
   * @param slug Category slug
   * @returns Category DTO or null if not found
   * @throws CategoryRepositoryException if there's an error in the repository
   */
  async getBySlug(slug: string): Promise<CategoryDto | null> {
    try {
      const category = await this.repository.getBySlug(slug);
      return category ? CategoryMapper.toDto(category) : null;
    } catch (error) {
      if (error instanceof CategoryError) {
        throw this.mapDomainErrorToApplicationError(error);
      }
      throw error;
    }
  }

  /**
   * Create a new category
   * @param categoryDto Category data to create
   * @returns Created category as DTO
   * @throws CategoryAlreadyExistsException if a category with the same slug already exists
   * @throws CategoryRepositoryException if there's an error in the repository
   */
  async create(categoryDto: CreateCategoryInputDto): Promise<CategoryDto> {
    try {
      // Convert DTO to domain entity
      const categoryCreate: CategoryCreate = {
        name: categoryDto.name,
        slug: categoryDto.slug,
        description: categoryDto.description
      };
      
      const category = await this.repository.create(categoryCreate);
      return CategoryMapper.toDto(category);
    } catch (error) {
      if (error instanceof CategoryError) {
        throw this.mapDomainErrorToApplicationError(error);
      }
      throw error;
    }
  }

  /**
   * Update an existing category
   * @param id Category ID
   * @param categoryDto Updated category data
   * @returns Updated category as DTO
   * @throws CategoryNotFoundException if the category is not found
   * @throws CategoryAlreadyExistsException if updating the slug and it already exists
   * @throws CategoryRepositoryException if there's an error in the repository
   */
  async update(id: string, categoryDto: Partial<CreateCategoryInputDto>): Promise<CategoryDto> {
    try {
      // Convert DTO to domain entity
      const categoryUpdate: Partial<CategoryCreate> = {
        name: categoryDto.name,
        slug: categoryDto.slug,
        description: categoryDto.description
      };
      
      const category = await this.repository.update(id, categoryUpdate);
      return CategoryMapper.toDto(category);
    } catch (error) {
      if (error instanceof CategoryError) {
        throw this.mapDomainErrorToApplicationError(error);
      }
      throw error;
    }
  }

  /**
   * Delete a category
   * @param id Category ID
   * @returns Promise<void>
   * @throws CategoryNotFoundException if the category is not found
   * @throws CategoryRepositoryException if there's an error in the repository
   */
  async delete(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      if (error instanceof CategoryError) {
        throw this.mapDomainErrorToApplicationError(error);
      }
      throw error;
    }
  }
  
  /**
   * Maps domain-specific CategoryError to application-layer exceptions
   * @param error The domain error to map
   * @returns Appropriate application exception
   */
  private mapDomainErrorToApplicationError(error: CategoryError): Error {
    switch (error.type) {
      case CategoryErrorType.NOT_FOUND:
        return new CategoryNotFoundException(
          error.context?.id as string || 'unknown',
          error
        );
      
      case CategoryErrorType.ALREADY_EXISTS:
        return new CategoryAlreadyExistsException(
          error.context?.slug as string || 'unknown',
          error
        );
      
      case CategoryErrorType.VALIDATION_ERROR:
      case CategoryErrorType.OPERATION_FAILED:
      case CategoryErrorType.CONSTRAINT_VIOLATION:
      case CategoryErrorType.UNAUTHORIZED:
      case CategoryErrorType.UNKNOWN:
      default:
        return new CategoryRepositoryException(
          error.message,
          error
        );
    }
  }
}
