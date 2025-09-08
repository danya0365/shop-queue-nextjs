import type { CategoryDTO } from '@/src/application/dtos/shop/backend/categories-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { CategoryMapper } from '@/src/application/mappers/shop/backend/category-mapper';
import type { ShopBackendCategoryRepository } from '@/src/domain/repositories/shop/backend/backend-category-repository';
import { ShopBackendCategoryError, ShopBackendCategoryErrorType } from '@/src/domain/repositories/shop/backend/backend-category-repository';

export interface UpdateCategoryUseCaseInput {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export class UpdateCategoryUseCase implements IUseCase<UpdateCategoryUseCaseInput, CategoryDTO> {
  constructor(
    private readonly categoryRepository: ShopBackendCategoryRepository
  ) { }

  async execute(input: UpdateCategoryUseCaseInput): Promise<CategoryDTO> {
    // Validate input
    if (!input.id) {
      throw new ShopBackendCategoryError(
        ShopBackendCategoryErrorType.VALIDATION_ERROR,
        'Category ID is required',
        'UpdateCategoryUseCase.execute',
        { input }
      );
    }

    // Check if at least one field is provided for update
    const hasUpdateFields = Object.keys(input).some(key => key !== 'id' && input[key as keyof UpdateCategoryUseCaseInput] !== undefined);

    if (!hasUpdateFields) {
      throw new ShopBackendCategoryError(
        ShopBackendCategoryErrorType.VALIDATION_ERROR,
        'At least one field must be provided for update',
        'UpdateCategoryUseCase.execute',
        { input }
      );
    }

    // Check if category exists
    const existingCategory = await this.categoryRepository.getCategoryById(input.id);

    if (!existingCategory) {
      throw new ShopBackendCategoryError(
        ShopBackendCategoryErrorType.NOT_FOUND,
        `Category with ID ${input.id} not found`,
        'UpdateCategoryUseCase.execute',
        { input }
      );
    }

    // Update category
    const updatedCategory = await this.categoryRepository.updateCategory(input.id, {
      name: input.name,
      slug: input.slug,
      description: input.description,
      icon: input.icon,
      color: input.color,
      isActive: input.isActive,
      sortOrder: input.sortOrder
    });

    return CategoryMapper.toDTO(updatedCategory);
  }
}
