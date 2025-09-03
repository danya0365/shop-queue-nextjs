import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { BackendCategoryError, BackendCategoryErrorType } from '@/src/domain/repositories/backend/backend-category-repository';
import type { BackendCategoryRepository } from '@/src/domain/repositories/backend/backend-category-repository';

export class DeleteCategoryUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly categoryRepository: BackendCategoryRepository
  ) { }

  async execute(id: string): Promise<boolean> {
    // Validate input
    if (!id) {
      throw new BackendCategoryError(
        BackendCategoryErrorType.VALIDATION_ERROR,
        'Category ID is required',
        'DeleteCategoryUseCase.execute',
        { id }
      );
    }

    const result = await this.categoryRepository.deleteCategory(id);
    
    if (!result) {
      throw new BackendCategoryError(
        BackendCategoryErrorType.NOT_FOUND,
        `Category with ID ${id} not found`,
        'DeleteCategoryUseCase.execute',
        { id }
      );
    }

    return result;
  }
}
