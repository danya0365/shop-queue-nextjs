import { ICategoryRepositoryAdapter } from '../interfaces/category-repository-adapter.interface';
import { CreateCategoryUseCase } from '../usecases/category/create-category';
import { DeleteCategoryUseCase } from '../usecases/category/delete-category';
import { GetCategoriesUseCase } from '../usecases/category/get-categories';
import { GetCategoryByIdUseCase } from '../usecases/category/get-category-by-id';
import { GetCategoryBySlugUseCase } from '../usecases/category/get-category-by-slug';
import { UpdateCategoryUseCase } from '../usecases/category/update-category';

/**
 * Factory for creating category use cases
 * Following Factory Pattern to centralize creation logic
 */
export class CategoryUseCaseFactory {
  /**
   * Create a GetCategoriesUseCase instance
   * @param categoryAdapter The category repository adapter
   * @returns A new GetCategoriesUseCase instance
   */
  static createGetCategoriesUseCase(categoryAdapter: ICategoryRepositoryAdapter): GetCategoriesUseCase {
    return new GetCategoriesUseCase(categoryAdapter);
  }

  /**
   * Create a GetCategoryBySlugUseCase instance
   * @param categoryAdapter The category repository adapter
   * @returns A new GetCategoryBySlugUseCase instance
   */
  static createGetCategoryBySlugUseCase(categoryAdapter: ICategoryRepositoryAdapter): GetCategoryBySlugUseCase {
    return new GetCategoryBySlugUseCase(categoryAdapter);
  }

  /**
   * Create a GetCategoryByIdUseCase instance
   * @param categoryAdapter The category repository adapter
   * @returns A new GetCategoryByIdUseCase instance
   */
  static createGetCategoryByIdUseCase(categoryAdapter: ICategoryRepositoryAdapter): GetCategoryByIdUseCase {
    return new GetCategoryByIdUseCase(categoryAdapter);
  }

  /**
   * Create a CreateCategoryUseCase instance
   * @param categoryAdapter The category repository adapter
   * @returns A new CreateCategoryUseCase instance
   */
  static createCreateCategoryUseCase(categoryAdapter: ICategoryRepositoryAdapter): CreateCategoryUseCase {
    return new CreateCategoryUseCase(categoryAdapter);
  }

  /**
   * Create an UpdateCategoryUseCase instance
   * @param categoryAdapter The category repository adapter
   * @returns A new UpdateCategoryUseCase instance
   */
  static createUpdateCategoryUseCase(categoryAdapter: ICategoryRepositoryAdapter): UpdateCategoryUseCase {
    return new UpdateCategoryUseCase(categoryAdapter);
  }

  /**
   * Create a DeleteCategoryUseCase instance
   * @param categoryAdapter The category repository adapter
   * @returns A new DeleteCategoryUseCase instance
   */
  static createDeleteCategoryUseCase(categoryAdapter: ICategoryRepositoryAdapter): DeleteCategoryUseCase {
    return new DeleteCategoryUseCase(categoryAdapter);
  }
}
