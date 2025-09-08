import type { CategoryDTO } from '@/src/application/dtos/shop/backend/categories-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { CategoryMapper } from '@/src/application/mappers/shop/backend/category-mapper';
import type { ShopBackendCategoryRepository } from '@/src/domain/repositories/shop/backend/backend-category-repository';
import { ShopBackendCategoryError, ShopBackendCategoryErrorType } from '@/src/domain/repositories/shop/backend/backend-category-repository';

export interface CreateCategoryUseCaseInput {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
}

export class CreateCategoryUseCase implements IUseCase<CreateCategoryUseCaseInput, CategoryDTO> {
  constructor(
    private readonly categoryRepository: ShopBackendCategoryRepository
  ) { }

  async execute(input: CreateCategoryUseCaseInput): Promise<CategoryDTO> {
    // Validate input
    if (!input.name) {
      throw new ShopBackendCategoryError(
        ShopBackendCategoryErrorType.VALIDATION_ERROR,
        'Category name is required',
        'CreateCategoryUseCase.execute',
        { input }
      );
    }

    if (!input.description) {
      throw new ShopBackendCategoryError(
        ShopBackendCategoryErrorType.VALIDATION_ERROR,
        'Category description is required',
        'CreateCategoryUseCase.execute',
        { input }
      );
    }

    if (!input.icon) {
      throw new ShopBackendCategoryError(
        ShopBackendCategoryErrorType.VALIDATION_ERROR,
        'Category icon is required',
        'CreateCategoryUseCase.execute',
        { input }
      );
    }

    if (!input.color) {
      throw new ShopBackendCategoryError(
        ShopBackendCategoryErrorType.VALIDATION_ERROR,
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
