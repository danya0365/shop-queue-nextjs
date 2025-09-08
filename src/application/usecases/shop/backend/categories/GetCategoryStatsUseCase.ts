import type { CategoryStatsDTO } from '@/src/application/dtos/shop/backend/categories-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { CategoryMapper } from '@/src/application/mappers/shop/backend/category-mapper';
import type { ShopBackendCategoryRepository } from '@/src/domain/repositories/shop/backend/backend-category-repository';

export class GetCategoryStatsUseCase implements IUseCase<void, CategoryStatsDTO> {
  constructor(
    private readonly categoryRepository: ShopBackendCategoryRepository
  ) { }

  async execute(): Promise<CategoryStatsDTO> {
    const stats = await this.categoryRepository.getCategoryStats();
    return CategoryMapper.statsToDTO(stats);
  }
}
