import type { CategoriesDataDTO, CategoryDTO, CategoryStatsDTO, PaginatedCategoriesDTO } from '@/src/application/dtos/categories-dto';
import { GetCategoriesPaginatedInputDTO } from '@/src/application/dtos/categories-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { GetCategoryByIdUseCase, GetCategoryStatsUseCase } from '@/src/application/usecases/categories';
import { GetCategoriesPaginatedUseCase } from '@/src/application/usecases/categories/GetCategoriesPaginatedUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BackendCategoryRepository } from '@/src/domain/repositories/backend/backend-category-repository';

export interface ICategoryService {
  getActiveCategories(): Promise<CategoryDTO[]>;
  getCategoriesData(page?: number, perPage?: number): Promise<CategoriesDataDTO>;
  getCategoryById(id: string): Promise<CategoryDTO>;
}

export class CategoryService implements ICategoryService {
  constructor(
    private readonly getCategoriesPaginatedUseCase: IUseCase<GetCategoriesPaginatedInputDTO, PaginatedCategoriesDTO>,
    private readonly getCategoryStatsUseCase: IUseCase<void, CategoryStatsDTO>,
    private readonly getCategoryByIdUseCase: IUseCase<string, CategoryDTO>,
    private readonly logger: Logger
  ) { }

  async getActiveCategories(): Promise<CategoryDTO[]> {
    try {
      this.logger.info('Getting active categories');
      const categories = await this.getCategoriesPaginatedUseCase.execute({ page: 1, perPage: 10 });
      return categories.data;
    } catch (error) {
      this.logger.error('Error getting active categories', { error });
      throw error;
    }
  }

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
}

export class CategoryServiceFactory {
  static create(repository: BackendCategoryRepository, logger: Logger): CategoryService {
    const getCategoriesPaginatedUseCase = new GetCategoriesPaginatedUseCase(repository);
    const getCategoryStatsUseCase = new GetCategoryStatsUseCase(repository);
    const getCategoryByIdUseCase = new GetCategoryByIdUseCase(repository);
    return new CategoryService(getCategoriesPaginatedUseCase, getCategoryStatsUseCase, getCategoryByIdUseCase, logger);
  }
}
