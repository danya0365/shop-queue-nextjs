import type { CategoriesDataDTO, CategoryDTO, CategoryStatsDTO, PaginatedCategoriesDTO } from '@/src/application/dtos/shop/backend/categories-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { CreateCategoryUseCase, DeleteCategoryUseCase, GetCategoryByIdUseCase, GetCategoryStatsUseCase, UpdateCategoryUseCase } from '@/src/application/usecases/backend/categories';
import type { CreateCategoryUseCaseInput } from '@/src/application/usecases/shop/backend/categories/CreateCategoryUseCase';
import { GetCategoriesPaginatedUseCase, type GetCategoriesPaginatedUseCaseInput } from '@/src/application/usecases/shop/backend/categories/GetCategoriesPaginatedUseCase';
import type { UpdateCategoryUseCaseInput } from '@/src/application/usecases/shop/backend/categories/UpdateCategoryUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendCategoryRepository } from '@/src/domain/repositories/shop/backend/backend-category-repository';

export interface IShopBackendCategoriesService {
  getCategoriesData(page?: number, perPage?: number, filters?: {
    searchQuery?: string;
    isActiveFilter?: boolean;
    minShopsCount?: number;
    maxShopsCount?: number;
    minServicesCount?: number;
    maxServicesCount?: number;
  }): Promise<CategoriesDataDTO>;
  getCategoryById(id: string): Promise<CategoryDTO>;
  createCategory(categoryData: CreateCategoryUseCaseInput): Promise<CategoryDTO>;
  updateCategory(id: string, categoryData: Omit<UpdateCategoryUseCaseInput, 'id'>): Promise<CategoryDTO>;
  deleteCategory(id: string): Promise<boolean>;
}

export class ShopBackendCategoriesService implements IShopBackendCategoriesService {
  constructor(
    private readonly getCategoriesPaginatedUseCase: IUseCase<GetCategoriesPaginatedUseCaseInput, PaginatedCategoriesDTO>,
    private readonly getCategoryStatsUseCase: IUseCase<void, CategoryStatsDTO>,
    private readonly getCategoryByIdUseCase: IUseCase<string, CategoryDTO>,
    private readonly createCategoryUseCase: IUseCase<CreateCategoryUseCaseInput, CategoryDTO>,
    private readonly updateCategoryUseCase: IUseCase<UpdateCategoryUseCaseInput, CategoryDTO>,
    private readonly deleteCategoryUseCase: IUseCase<string, boolean>,
    private readonly logger: Logger
  ) { }

  /**
   * Get categories data including paginated categories and statistics
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @param filters Optional filter parameters
   * @returns Categories data DTO
   */
  async getCategoriesData(page: number = 1, perPage: number = 10, filters?: {
    searchQuery?: string;
    isActiveFilter?: boolean;
    minShopsCount?: number;
    maxShopsCount?: number;
    minServicesCount?: number;
    maxServicesCount?: number;
  }): Promise<CategoriesDataDTO> {
    try {
      this.logger.info('Getting categories data', { page, perPage, filters });

      // Get categories and stats in parallel
      const [categoriesResult, stats] = await Promise.all([
        this.getCategoriesPaginatedUseCase.execute({ page, perPage, filters }),
        this.getCategoryStatsUseCase.execute()
      ]);

      return {
        categories: categoriesResult.data,
        stats,
        totalCount: categoriesResult.pagination.totalItems,
        currentPage: categoriesResult.pagination.currentPage,
        perPage: categoriesResult.pagination.itemsPerPage
      };
    } catch (error) {
      this.logger.error('Error getting categories data', { error, page, perPage });
      throw error;
    }
  }

  /**
   * Get a category by ID
   * @param id Category ID
   * @returns Category DTO
   */
  async getCategoryById(id: string): Promise<CategoryDTO> {
    try {
      this.logger.info('Getting category by ID', { id });

      const result = await this.getCategoryByIdUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error getting category by ID', { error, id });
      throw error;
    }
  }

  /**
   * Create a new category
   * @param categoryData Category data
   * @returns Created category DTO
   */
  async createCategory(categoryData: CreateCategoryUseCaseInput): Promise<CategoryDTO> {
    try {
      this.logger.info('Creating category', { categoryData });

      const result = await this.createCategoryUseCase.execute(categoryData);
      return result;
    } catch (error) {
      this.logger.error('Error creating category', { error, categoryData });
      throw error;
    }
  }

  /**
   * Update an existing category
   * @param id Category ID
   * @param categoryData Category data to update
   * @returns Updated category DTO
   */
  async updateCategory(id: string, categoryData: Omit<UpdateCategoryUseCaseInput, 'id'>): Promise<CategoryDTO> {
    try {
      this.logger.info('Updating category', { id, categoryData });

      const updateData = { id, ...categoryData };
      const result = await this.updateCategoryUseCase.execute(updateData);
      return result;
    } catch (error) {
      this.logger.error('Error updating category', { error, id, categoryData });
      throw error;
    }
  }

  /**
   * Delete a category
   * @param id Category ID
   * @returns Success flag
   */
  async deleteCategory(id: string): Promise<boolean> {
    try {
      this.logger.info('Deleting category', { id });

      const result = await this.deleteCategoryUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error deleting category', { error, id });
      throw error;
    }
  }
}

export class ShopBackendCategoriesServiceFactory {
  static create(repository: ShopBackendCategoryRepository, logger: Logger): ShopBackendCategoriesService {
    const getCategoriesPaginatedUseCase = new GetCategoriesPaginatedUseCase(repository);
    const getCategoryStatsUseCase = new GetCategoryStatsUseCase(repository);
    const getCategoryByIdUseCase = new GetCategoryByIdUseCase(repository);
    const createCategoryUseCase = new CreateCategoryUseCase(repository);
    const updateCategoryUseCase = new UpdateCategoryUseCase(repository);
    const deleteCategoryUseCase = new DeleteCategoryUseCase(repository);
    return new ShopBackendCategoriesService(getCategoriesPaginatedUseCase, getCategoryStatsUseCase, getCategoryByIdUseCase, createCategoryUseCase, updateCategoryUseCase, deleteCategoryUseCase, logger);
  }
}
