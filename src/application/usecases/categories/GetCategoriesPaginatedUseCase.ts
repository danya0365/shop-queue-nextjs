import type { PaginatedCategoriesDTO } from '@/src/application/dtos/backend/categories-dto';
import { GetCategoriesPaginatedInputDTO } from '@/src/application/dtos/categories-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { CategoryMapper } from '@/src/application/mappers/backend/category-mapper';
import type { ShopBackendCategoryRepository } from '@/src/domain/repositories/shop/backend/backend-category-repository';

export class GetCategoriesPaginatedUseCase implements IUseCase<GetCategoriesPaginatedInputDTO, PaginatedCategoriesDTO> {
  constructor(
    private readonly categoryRepository: ShopBackendCategoryRepository
  ) { }

  async execute(input: GetCategoriesPaginatedInputDTO): Promise<PaginatedCategoriesDTO> {
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
