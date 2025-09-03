import { CategoryEntity, CategoryPaginatedEntity, CategoryStatsEntity } from "../../../domain/entities/backend/backend-category.entity";
import { DatabaseDataSource, FilterOperator, QueryOptions, SortDirection } from "../../../domain/interfaces/datasources/database-datasource";
import { Logger } from "../../../domain/interfaces/logger";
import { PaginationParams } from "../../../domain/interfaces/pagination-types";
import { BackendCategoryError, BackendCategoryErrorType, BackendCategoryRepository } from "../../../domain/repositories/backend/backend-category-repository";
import { SupabaseBackendCategoryMapper } from "../../mappers/backend/supabase-backend-category.mapper";
import { CategorySchema, CategoryStatsSchema } from "../../schemas/backend/category.schema";
import { BackendRepository } from "../base/backend-repository";

// Extended types for joined data
type CategorySchemaRecord = Record<string, unknown> & CategorySchema;
type CategoryStatsSchemaRecord = Record<string, unknown> & CategoryStatsSchema;

/**
 * Supabase implementation of the category repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseBackendCategoryRepository extends BackendRepository implements BackendCategoryRepository {
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger
  ) {
    super(dataSource, logger, "BackendCategory");
  }

  /**
   * Get paginated categories data from database
   * @param params Pagination parameters
   * @returns Paginated categories data
   */
  async getPaginatedCategories(params: PaginationParams): Promise<CategoryPaginatedEntity> {
    try {
      const { page, limit } = params;
      const offset = (page - 1) * limit;

      // Query to get categories with counts
      const queryOptions: QueryOptions = {
        select: ['*'],
        sort: [{ field: 'sort_order', direction: SortDirection.ASC }],
        pagination: {
          limit,
          offset
        }
      };

      // Use extended type that satisfies Record<string, unknown> constraint
      const categories = await this.dataSource.getAdvanced<CategorySchemaRecord>(
        'categories',
        queryOptions
      );

      // Count total items
      const totalItems = await this.dataSource.count('categories');

      // Get category IDs for additional queries
      const categoryIds = categories.map(category => category.id);

      // Query to get shop counts for each category
      const categoryInfoStatsQueryOptions: QueryOptions = {
        select: ['id', 'shops_count', 'services_count', 'active_shops_count', 'available_services_count'],
        filters: [{
          field: 'id',
          operator: FilterOperator.IN,
          value: categoryIds
        }]
      };

      const categoryInfoStats = await this.dataSource.getAdvanced<Record<string, unknown>>(
        'category_info_stats_view',
        categoryInfoStatsQueryOptions
      );

      // Create maps for easy lookup
      const categoryInfoStatsMap = new Map<string, { shops_count: number, services_count: number, active_shops_count: number, available_services_count: number }>();
      categoryInfoStats.forEach(item => {
        categoryInfoStatsMap.set(item.id as string, {
          shops_count: item.shops_count as number,
          services_count: item.services_count as number,
          active_shops_count: item.active_shops_count as number,
          available_services_count: item.available_services_count as number
        });
      });

      // Map database results to domain entities with counts
      const mappedCategories = categories.map(category => {
        const categoryWithCounts = {
          ...category,
          shops_count: categoryInfoStatsMap.get(category.id)?.shops_count || 0,
          services_count: categoryInfoStatsMap.get(category.id)?.services_count || 0
        };

        return SupabaseBackendCategoryMapper.toDomain(categoryWithCounts);
      });

      // Create pagination metadata
      const pagination = SupabaseBackendCategoryMapper.createPaginationMeta(page, limit, totalItems);

      return {
        data: mappedCategories,
        pagination
      };
    } catch (error) {
      if (error instanceof BackendCategoryError) {
        throw error;
      }

      this.logger.error('Error in getPaginatedCategories', { error });
      throw new BackendCategoryError(
        BackendCategoryErrorType.UNKNOWN,
        'An unexpected error occurred while fetching categories',
        'getPaginatedCategories',
        {},
        error
      );
    }
  }

  /**
   * Get category statistics from database
   * @returns Category statistics
   */
  async getCategoryStats(): Promise<CategoryStatsEntity> {
    try {
      // Use getAdvanced to fetch statistics data
      const queryOptions: QueryOptions = {
        select: ['*'],
        // No joins needed for stats view
        // No pagination needed, we want all stats
      };

      // Assuming a view exists for category statistics
      // Use extended type that satisfies Record<string, unknown> constraint
      const statsData = await this.dataSource.getAdvanced<CategoryStatsSchemaRecord>(
        'category_stats_view',
        queryOptions
      );

      if (!statsData || statsData.length === 0) {
        // If no stats are found, return default values
        return {
          totalCategories: 0,
          activeCategories: 0,
          totalShops: 0,
          totalServices: 0,
          mostPopularCategory: '',
          leastPopularCategory: ''
        };
      }

      // Map database results to domain entity
      // Assuming the first record contains all stats
      return SupabaseBackendCategoryMapper.statsToEntity(statsData[0]);
    } catch (error) {
      if (error instanceof BackendCategoryError) {
        throw error;
      }

      this.logger.error('Error in getCategoryStats', { error });
      throw new BackendCategoryError(
        BackendCategoryErrorType.UNKNOWN,
        'An unexpected error occurred while fetching category statistics',
        'getCategoryStats',
        {},
        error
      );
    }
  }

  /**
   * Get category by ID
   * @param id Category ID
   * @returns Category entity or null if not found
   */
  async getCategoryById(id: string): Promise<CategoryEntity | null> {
    try {
      // Use getById which is designed for fetching by ID
      const category = await this.dataSource.getById<CategorySchemaRecord>(
        'categories',
        id
      );

      if (!category) {
        return null;
      }

      // Get shop count for this category
      const shopCountQuery: QueryOptions = {
        select: ['count'],
        filters: [{
          field: 'category_id',
          operator: FilterOperator.EQ,
          value: id
        }]
      };

      const shopCountResult = await this.dataSource.getAdvanced<Record<string, unknown>>(
        'category_shop_counts_view',
        shopCountQuery
      );

      // Get service count for this category
      const serviceCountQuery: QueryOptions = {
        select: ['count'],
        filters: [{
          field: 'category_id',
          operator: FilterOperator.EQ,
          value: id
        }]
      };

      const serviceCountResult = await this.dataSource.getAdvanced<Record<string, unknown>>(
        'category_service_counts_view',
        serviceCountQuery
      );

      const categoryWithCounts = {
        ...category,
        shops_count: shopCountResult.length > 0 ? shopCountResult[0].count as number : 0,
        services_count: serviceCountResult.length > 0 ? serviceCountResult[0].count as number : 0
      };

      // Map database result to domain entity
      return SupabaseBackendCategoryMapper.toDomain(categoryWithCounts);
    } catch (error) {
      if (error instanceof BackendCategoryError) {
        throw error;
      }

      this.logger.error('Error in getCategoryById', { error, id });
      throw new BackendCategoryError(
        BackendCategoryErrorType.UNKNOWN,
        'An unexpected error occurred while fetching category',
        'getCategoryById',
        { id },
        error
      );
    }
  }

  /**
   * Create a new category
   * @param category Category data to create
   * @returns Created category entity
   */
  async createCategory(category: Omit<CategoryEntity, 'id' | 'createdAt' | 'updatedAt' | 'shopsCount' | 'servicesCount'>): Promise<CategoryEntity> {
    try {
      // Generate slug from name if not provided
      const slug = category.slug || this.generateSlug(category.name);

      // Convert domain entity to database schema
      const categorySchema: Omit<CategorySchema, 'id' | 'created_at' | 'updated_at' | 'shops_count' | 'services_count'> = {
        slug,
        name: category.name,
        description: category.description,
        icon: category.icon,
        color: category.color,
        is_active: category.isActive,
        sort_order: category.sortOrder
      };

      // Insert into database
      const result = await this.dataSource.insert<CategorySchemaRecord>(
        'categories',
        categorySchema
      );

      if (!result) {
        throw new BackendCategoryError(
          BackendCategoryErrorType.OPERATION_FAILED,
          'Failed to create category',
          'createCategory',
          { category }
        );
      }

      // Return the created category with default counts
      const createdCategory = {
        ...result,
        shops_count: 0,
        services_count: 0
      };

      return SupabaseBackendCategoryMapper.toDomain(createdCategory);
    } catch (error) {
      if (error instanceof BackendCategoryError) {
        throw error;
      }

      this.logger.error('Error in createCategory', { error, category });
      throw new BackendCategoryError(
        BackendCategoryErrorType.UNKNOWN,
        'An unexpected error occurred while creating category',
        'createCategory',
        { category },
        error
      );
    }
  }

  /**
   * Update an existing category
   * @param id Category ID
   * @param category Category data to update
   * @returns Updated category entity
   */
  async updateCategory(id: string, category: Partial<Omit<CategoryEntity, 'id' | 'createdAt' | 'updatedAt' | 'shopsCount' | 'servicesCount'>>): Promise<CategoryEntity> {
    try {
      // Check if category exists
      const existingCategory = await this.getCategoryById(id);
      if (!existingCategory) {
        throw new BackendCategoryError(
          BackendCategoryErrorType.NOT_FOUND,
          `Category with ID ${id} not found`,
          'updateCategory',
          { id, category }
        );
      }

      // Generate slug from name if name is provided and slug is not
      let slug = category.slug;
      if (category.name && !category.slug) {
        slug = this.generateSlug(category.name);
      }

      // Convert domain entity to database schema
      const categorySchema: Partial<Omit<CategorySchema, 'id' | 'created_at' | 'updated_at' | 'shops_count' | 'services_count'>> = {
        ...(slug && { slug }),
        ...(category.name && { name: category.name }),
        ...(category.description !== undefined && { description: category.description }),
        ...(category.icon !== undefined && { icon: category.icon }),
        ...(category.color !== undefined && { color: category.color }),
        ...(category.isActive !== undefined && { is_active: category.isActive }),
        ...(category.sortOrder !== undefined && { sort_order: category.sortOrder })
      };

      // Update in database
      const result = await this.dataSource.update<CategorySchemaRecord>(
        'categories',
        id,
        categorySchema
      );

      if (!result) {
        throw new BackendCategoryError(
          BackendCategoryErrorType.OPERATION_FAILED,
          `Failed to update category with ID ${id}`,
          'updateCategory',
          { id, category }
        );
      }

      // Get the updated category with counts
      return this.getCategoryById(id) as Promise<CategoryEntity>;
    } catch (error) {
      if (error instanceof BackendCategoryError) {
        throw error;
      }

      this.logger.error('Error in updateCategory', { error, id, category });
      throw new BackendCategoryError(
        BackendCategoryErrorType.UNKNOWN,
        'An unexpected error occurred while updating category',
        'updateCategory',
        { id, category },
        error
      );
    }
  }

  /**
   * Delete a category
   * @param id Category ID
   * @returns true if deleted, false if not found
   */
  async deleteCategory(id: string): Promise<boolean> {
    try {
      // Check if category exists
      const existingCategory = await this.getCategoryById(id);
      if (!existingCategory) {
        return false;
      }

      // Delete from database
      const result = await this.dataSource.delete(
        'categories',
        id
      );

      return result !== null;
    } catch (error) {
      if (error instanceof BackendCategoryError) {
        throw error;
      }

      this.logger.error('Error in deleteCategory', { error, id });
      throw new BackendCategoryError(
        BackendCategoryErrorType.UNKNOWN,
        'An unexpected error occurred while deleting category',
        'deleteCategory',
        { id },
        error
      );
    }
  }

  /**
   * Generate a slug from a string
   * @param text Text to generate slug from
   * @returns Slug
   */
  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
}
