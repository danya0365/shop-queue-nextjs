import type { CategoryDTO, CreateCategoryInputDTO } from '@/src/application/dtos/backend/categories-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { CategoryMapper } from '@/src/application/mappers/backend/category-mapper';
import type { BackendCategoryRepository } from '@/src/domain/repositories/backend/backend-category-repository';
import { BackendCategoryError, BackendCategoryErrorType } from '@/src/domain/repositories/backend/backend-category-repository';

export class CreateCategoryUseCase implements IUseCase<CreateCategoryInputDTO, CategoryDTO> {
  constructor(
    private readonly categoryRepository: BackendCategoryRepository
  ) { }

  async execute(input: CreateCategoryInputDTO): Promise<CategoryDTO> {
    // Validate input
    if (!input.name) {
      throw new BackendCategoryError(
        BackendCategoryErrorType.VALIDATION_ERROR,
        'Category name is required',
        'CreateCategoryUseCase.execute',
        { input }
      );
    }

    if (!input.description) {
      throw new BackendCategoryError(
        BackendCategoryErrorType.VALIDATION_ERROR,
        'Category description is required',
        'CreateCategoryUseCase.execute',
        { input }
      );
    }

    if (!input.icon) {
      throw new BackendCategoryError(
        BackendCategoryErrorType.VALIDATION_ERROR,
        'Category icon is required',
        'CreateCategoryUseCase.execute',
        { input }
      );
    }

    if (!input.color) {
      throw new BackendCategoryError(
        BackendCategoryErrorType.VALIDATION_ERROR,
        'Category color is required',
        'CreateCategoryUseCase.execute',
        { input }
      );
    }

    const category = await this.categoryRepository.createCategory({
      name: input.name,
      slug: input.slug,
      description: input.description,
      icon: input.icon,
      color: input.color,
      isActive: input.isActive,
      sortOrder: input.sortOrder
    });

    return CategoryMapper.toDTO(category);
  }
}
