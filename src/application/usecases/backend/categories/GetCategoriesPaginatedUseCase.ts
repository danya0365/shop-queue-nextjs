import type { PaginatedCategoriesDTO } from '@/src/application/dtos/backend/categories-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { CategoryMapper } from '@/src/application/mappers/backend/category-mapper';
import type { BackendCategoryRepository } from '@/src/domain/repositories/backend/backend-category-repository';

export interface GetCategoriesPaginatedUseCaseInput {
  page: number;
  perPage: number;
}

export class GetCategoriesPaginatedUseCase implements IUseCase<GetCategoriesPaginatedUseCaseInput, PaginatedCategoriesDTO> {
  constructor(
    private readonly categoryRepository: BackendCategoryRepository
  ) { }

  async execute(input: GetCategoriesPaginatedUseCaseInput): Promise<PaginatedCategoriesDTO> {
    const { page, perPage } = input;

    // Validate input
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }

    if (perPage < 1 || perPage > 100) {
      throw new Error('Per page must be between 1 and 100');
    }

    const categories = await this.categoryRepository.getPaginatedCategories({
      page,
      limit: perPage
    });
    
    const categoriesDTO = categories.data.map(category => CategoryMapper.toDTO(category));

    return {
      data: categoriesDTO,
      pagination: categories.pagination
    };
  }
}
