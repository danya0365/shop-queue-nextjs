import type { PaginatedCategoriesDTO } from '@/src/application/dtos/shop/backend/categories-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { CategoryMapper } from '@/src/application/mappers/shop/backend/category-mapper';
import type { ShopBackendCategoryRepository } from '@/src/domain/repositories/shop/backend/backend-category-repository';
import { ShopBackendCategoryError, ShopBackendCategoryErrorType } from '@/src/domain/repositories/shop/backend/backend-category-repository';

export interface GetCategoriesPaginatedUseCaseInput {
  page: number;
  perPage: number;
  filters?: {
    searchQuery?: string;
    isActiveFilter?: boolean;
    minShopsCount?: number;
    maxShopsCount?: number;
    minServicesCount?: number;
    maxServicesCount?: number;
  };
}

export class GetCategoriesPaginatedUseCase implements IUseCase<GetCategoriesPaginatedUseCaseInput, PaginatedCategoriesDTO> {
  constructor(
    private readonly categoryRepository: ShopBackendCategoryRepository
  ) { }

  async execute(input: GetCategoriesPaginatedUseCaseInput): Promise<PaginatedCategoriesDTO> {
    const { page, perPage, filters } = input;

    // Validate input
    if (page < 1) {
      throw new ShopBackendCategoryError(
        ShopBackendCategoryErrorType.VALIDATION_ERROR,
        'Page must be greater than 0',
        'GetCategoriesPaginatedUseCase.execute',
        { page }
      );
    }

    if (perPage < 1 || perPage > 100) {
      throw new ShopBackendCategoryError(
        ShopBackendCategoryErrorType.VALIDATION_ERROR,
        'Per page must be between 1 and 100',
        'GetCategoriesPaginatedUseCase.execute',
        { perPage }
      );
    }

    const categories = await this.categoryRepository.getPaginatedCategories({
      page,
      limit: perPage,
      filters
    });

    const categoriesDTO = categories.data.map(category => CategoryMapper.toDTO(category));

    return {
      data: categoriesDTO,
      pagination: categories.pagination
    };
  }
}
