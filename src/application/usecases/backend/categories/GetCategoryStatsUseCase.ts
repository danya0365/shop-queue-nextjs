import type { CategoryStatsDTO } from '@/src/application/dtos/backend/categories-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { CategoryMapper } from '@/src/application/mappers/backend/category-mapper';
import type { BackendCategoryRepository } from '@/src/domain/repositories/backend/backend-category-repository';

export class GetCategoryStatsUseCase implements IUseCase<void, CategoryStatsDTO> {
  constructor(
    private readonly categoryRepository: BackendCategoryRepository
  ) { }

  async execute(): Promise<CategoryStatsDTO> {
    const stats = await this.categoryRepository.getCategoryStats();
    return CategoryMapper.statsToDTO(stats);
  }
}
