import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { ShopBackendCategoryRepository } from '@/src/domain/repositories/shop/backend/backend-category-repository';
import { ShopBackendCategoryError, ShopBackendCategoryErrorType } from '@/src/domain/repositories/shop/backend/backend-category-repository';

export class DeleteCategoryUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly categoryRepository: ShopBackendCategoryRepository
  ) { }

  async execute(id: string): Promise<boolean> {
    // Validate input
    if (!id) {
      throw new ShopBackendCategoryError(
        ShopBackendCategoryErrorType.VALIDATION_ERROR,
        'Category ID is required',
        'DeleteCategoryUseCase.execute',
        { id }
      );
    }

    const result = await this.categoryRepository.deleteCategory(id);

    if (!result) {
      throw new ShopBackendCategoryError(
        ShopBackendCategoryErrorType.NOT_FOUND,
        `Category with ID ${id} not found`,
        'DeleteCategoryUseCase.execute',
        { id }
      );
    }

    return result;
  }
}
