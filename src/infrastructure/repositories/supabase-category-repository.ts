import { Logger } from "@/src/domain/interfaces/logger";
import { Category, CategoryCreate } from "../../domain/entities/category";
import type { IEventDispatcher } from "../../domain/events/event-dispatcher";
import type { DatabaseDataSource } from "../../domain/interfaces/datasources/database-datasource";
import {
  CategoryCreatedEvent,
  CategoryDeletedEvent,
  CategoryError,
  CategoryErrorType,
  CategoryRepository,
  CategoryUpdatedEvent
} from "../../domain/repositories/category-repository";
import {
  DatabaseOperationException,
  EntityAlreadyExistsException,
  EntityNotFoundException,
} from "../exceptions/repository-exceptions";
import { SupabaseCategoryMapper } from "../mappers/supabase-category-mapper";
import { CategoryDbSchema } from "../schemas/category-schema";
import { StandardRepository } from "./base/standard-repository";

/**
 * Supabase implementation of CategoryRepository
 * Following SOLID principles and Clean Architecture
 */
export class SupabaseCategoryRepository extends StandardRepository implements CategoryRepository {
  private readonly tableName = "categories";

  /**
   * Constructor with dependency injection
   * @param dataSource Abstraction for database operations
   * @param logger Abstraction for logging
   * @param eventDispatcher Event dispatcher for domain events
   */
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger,
    private readonly eventDispatcher?: IEventDispatcher
  ) {
    super(dataSource, logger, "Category", false);
  }

  /**
   * Handle repository errors in a consistent way
   * @param error The error to handle
   * @param operation Optional operation name for better error context
   * @param context Optional additional context for the error
   * @throws CategoryError with appropriate type and message
   */
  handleError(error: unknown, operation?: string, context?: Record<string, unknown>): never {
    this.logger.error(`Category repository error during ${operation || 'unknown operation'}`, { error, context });

    // Map infrastructure exceptions to domain exceptions
    if (error instanceof EntityNotFoundException) {
      throw new CategoryError(
        CategoryErrorType.NOT_FOUND,
        `Category not found: ${error.message}`,
        operation,
        context,
        error
      );
    }

    if (error instanceof EntityAlreadyExistsException) {
      throw new CategoryError(
        CategoryErrorType.ALREADY_EXISTS,
        `Category already exists: ${error.message}`,
        operation,
        context,
        error
      );
    }

    if (error instanceof DatabaseOperationException) {
      throw new CategoryError(
        CategoryErrorType.OPERATION_FAILED,
        `Database operation failed: ${error.message}`,
        operation,
        context,
        error
      );
    }

    // For unknown errors
    if (error instanceof Error) {
      throw new CategoryError(
        CategoryErrorType.UNKNOWN,
        `Unexpected error: ${error.message}`,
        operation,
        context,
        error
      );
    }

    throw new CategoryError(
      CategoryErrorType.UNKNOWN,
      'Unknown error occurred',
      operation,
      context,
      error
    );
  }

  /**
   * Get all categories
   * @returns Array of category domain entities
   * @throws CategoryError if the operation fails
   */
  async getAll(): Promise<Category[]> {
    try {
      const result = await this.dataSource.get<CategoryDbSchema>(
        this.tableName
      );

      // Sort by name in memory since our abstraction doesn't support ordering yet
      const sortedResult = [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      return SupabaseCategoryMapper.toDomainList(sortedResult);
    } catch (error) {
      this.handleError(error, 'getAll');
    }
  }

  /**
   * Get a category by ID
   * @param id Category ID
   * @returns Category domain entity or null if not found
   * @throws CategoryError if the operation fails
   */
  async getById(id: string): Promise<Category | null> {
    try {
      const result = await this.dataSource.getById<CategoryDbSchema>(
        this.tableName,
        id
      );
      if (!result) return null;

      return SupabaseCategoryMapper.toDomain(result);
    } catch (error) {
      this.handleError(error, 'getById', { id });
    }
  }

  /**
   * Get a category by slug
   * @param slug Category slug
   * @returns Category domain entity or null if not found
   * @throws CategoryError if the operation fails
   */
  async getBySlug(slug: string): Promise<Category | null> {
    try {
      // Use get method with a filter object instead of search
      const result = await this.dataSource.get<CategoryDbSchema>(
        this.tableName,
        { slug }
      );

      if (!result || result.length === 0) return null;

      return SupabaseCategoryMapper.toDomain(result[0]);
    } catch (error) {
      this.handleError(error, 'getBySlug', { slug });
    }
  }

  /**
   * Create a new category
   * @param category Category data to create
   * @returns Created category domain entity
   * @throws CategoryError if the operation fails
   * @emits CategoryCreatedEvent
   */
  async create(category: CategoryCreate): Promise<Category> {
    try {
      // Check if category with the same slug already exists
      const existing = await this.getBySlug(category.slug);
      if (existing) {
        throw new EntityAlreadyExistsException(
          this.entityName,
          "slug",
          category.slug
        );
      }

      const categoryData = {
        name: category.name,
        slug: category.slug,
        description: category.description ?? null,
      };

      const result = await this.dataSource.insert<CategoryDbSchema>(
        this.tableName,
        categoryData
      );
      if (!result) {
        throw new DatabaseOperationException("create", this.entityName);
      }

      const createdCategory = SupabaseCategoryMapper.toDomain(result);

      // Dispatch domain event
      if (this.eventDispatcher) {
        this.eventDispatcher.dispatch(new CategoryCreatedEvent(createdCategory));
      }

      return createdCategory;
    } catch (error) {
      this.handleError(error, 'create', { category });
    }
  }

  /**
   * Update an existing category
   * @param id Category ID
   * @param category Updated category data
   * @returns Updated category domain entity
   * @throws CategoryError if the operation fails
   * @emits CategoryUpdatedEvent
   */
  async update(
    id: string,
    category: Partial<CategoryCreate>
  ): Promise<Category> {
    try {
      // Check if category exists
      const existing = await this.getById(id);
      if (!existing) {
        throw new EntityNotFoundException(this.entityName, id);
      }

      // If updating slug, check if it already exists
      if (category.slug && category.slug !== existing.slug) {
        const slugExists = await this.getBySlug(category.slug);
        if (slugExists) {
          throw new EntityAlreadyExistsException(
            this.entityName,
            "slug",
            category.slug
          );
        }
      }

      const updateData: Partial<CategoryDbSchema> = {};

      if (category.name) updateData.name = category.name;
      if (category.slug) updateData.slug = category.slug;
      if (category.description !== undefined)
        updateData.description = category.description ?? null;

      const result = await this.dataSource.update<CategoryDbSchema>(
        this.tableName,
        id,
        updateData
      );
      if (!result) {
        throw new EntityNotFoundException(this.entityName, id);
      }

      const updatedCategory = SupabaseCategoryMapper.toDomain(result);

      // Dispatch domain event
      if (this.eventDispatcher) {
        this.eventDispatcher.dispatch(new CategoryUpdatedEvent(updatedCategory));
      }

      return updatedCategory;
    } catch (error) {
      this.handleError(error, 'update', { id, category });
    }
  }

  /**
   * Delete a category
   * @param id Category ID
   * @returns Promise<void>
   * @throws CategoryError if the operation fails
   * @emits CategoryDeletedEvent
   */
  async delete(id: string): Promise<void> {
    try {
      // Check if category exists
      const existing = await this.getById(id);
      if (!existing) {
        throw new EntityNotFoundException(this.entityName, id);
      }

      const { slug } = existing;

      await this.dataSource.delete(this.tableName, id);

      // Dispatch domain event
      if (this.eventDispatcher) {
        this.eventDispatcher.dispatch(new CategoryDeletedEvent(id, slug));
      }
    } catch (error) {
      this.handleError(error, 'delete', { id });
    }
  }
}
