import type { CategoriesDataDTO, CategoryDTO, CategoryStatsDTO, CreateCategoryInputDTO, PaginatedCategoriesDTO, UpdateCategoryInputDTO } from '@/src/application/dtos/backend/categories-dto';
import { GetCategoriesPaginatedUseCase, type GetCategoriesPaginatedUseCaseInput } from '@/src/application/usecases/backend/categories/GetCategoriesPaginatedUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BackendCategoryRepository } from '@/src/domain/repositories/backend/backend-category-repository';
import { IUseCase } from '../../interfaces/use-case.interface';
import { CreateCategoryUseCase, DeleteCategoryUseCase, GetCategoryByIdUseCase, GetCategoryStatsUseCase, UpdateCategoryUseCase } from '../../usecases/backend/categories';

export interface IBackendCategoriesService {
  getCategoriesData(page?: number, perPage?: number): Promise<CategoriesDataDTO>;
  getCategoryById(id: string): Promise<CategoryDTO>;
  createCategory(categoryData: CreateCategoryInputDTO): Promise<CategoryDTO>;
  updateCategory(id: string, categoryData: Omit<UpdateCategoryInputDTO, 'id'>): Promise<CategoryDTO>;
  deleteCategory(id: string): Promise<boolean>;
}

export class BackendCategoriesService implements IBackendCategoriesService {
  constructor(
    private readonly getCategoriesPaginatedUseCase: IUseCase<GetCategoriesPaginatedUseCaseInput, PaginatedCategoriesDTO>,
    private readonly getCategoryStatsUseCase: IUseCase<void, CategoryStatsDTO>,
    private readonly getCategoryByIdUseCase: IUseCase<string, CategoryDTO>,
    private readonly createCategoryUseCase: IUseCase<CreateCategoryInputDTO, CategoryDTO>,
    private readonly updateCategoryUseCase: IUseCase<UpdateCategoryInputDTO, CategoryDTO>,
    private readonly deleteCategoryUseCase: IUseCase<string, boolean>,
    private readonly logger: Logger
  ) { }

  /**
   * Get categories data including paginated categories and statistics
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @returns Categories data DTO
   */
  async getCategoriesData(page: number = 1, perPage: number = 10): Promise<CategoriesDataDTO> {
    try {
      this.logger.info('Getting categories data', { page, perPage });

      // Get categories and stats in parallel
      const [categoriesResult, stats] = await Promise.all([
        this.getCategoriesPaginatedUseCase.execute({ page, perPage }),
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
  async createCategory(categoryData: CreateCategoryInputDTO): Promise<CategoryDTO> {
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
  async updateCategory(id: string, categoryData: Omit<UpdateCategoryInputDTO, 'id'>): Promise<CategoryDTO> {
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

export class BackendCategoriesServiceFactory {
  static create(repository: BackendCategoryRepository, logger: Logger): BackendCategoriesService {
    const getCategoriesPaginatedUseCase = new GetCategoriesPaginatedUseCase(repository);
    const getCategoryStatsUseCase = new GetCategoryStatsUseCase(repository);
    const getCategoryByIdUseCase = new GetCategoryByIdUseCase(repository);
    const createCategoryUseCase = new CreateCategoryUseCase(repository);
    const updateCategoryUseCase = new UpdateCategoryUseCase(repository);
    const deleteCategoryUseCase = new DeleteCategoryUseCase(repository);
    return new BackendCategoriesService(getCategoriesPaginatedUseCase, getCategoryStatsUseCase, getCategoryByIdUseCase, createCategoryUseCase, updateCategoryUseCase, deleteCategoryUseCase, logger);
  }
}
