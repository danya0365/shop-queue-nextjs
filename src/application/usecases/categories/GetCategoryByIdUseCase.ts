import type { CategoryDTO } from '@/src/application/dtos/backend/categories-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { CategoryMapper } from '@/src/application/mappers/backend/category-mapper';
import { BackendCategoryError, BackendCategoryErrorType } from '@/src/domain/repositories/backend/backend-category-repository';
import type { ShopBackendCategoryRepository } from '@/src/domain/repositories/shop/backend/backend-category-repository';

export class GetCategoryByIdUseCase implements IUseCase<string, CategoryDTO> {
  constructor(
    private readonly categoryRepository: ShopBackendCategoryRepository
  ) { }

  async execute(id: string): Promise<CategoryDTO> {
    if (!id) {
      throw new BackendCategoryError(
        BackendCategoryErrorType.VALIDATION_ERROR,
        'Category ID is required',
        'GetCategoryByIdUseCase.execute',
        { id }
      );
    }

    const category = await this.categoryRepository.getCategoryById(id);

    if (!category) {
      throw new BackendCategoryError(
        BackendCategoryErrorType.NOT_FOUND,
        `Category with ID ${id} not found`,
        'GetCategoryByIdUseCase.execute',
        { id }
      );
    }

    return CategoryMapper.toDTO(category);
  }
}
