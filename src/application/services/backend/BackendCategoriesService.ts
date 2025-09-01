
import type { CategoriesDataDTO } from '@/src/application/dtos/backend/categories-dto';
import type { IGetCategoriesUseCase } from '@/src/application/usecases/backend/categories/GetCategoriesUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IBackendCategoriesService {
  getCategoriesData(): Promise<CategoriesDataDTO>;
}

export class BackendCategoriesService implements IBackendCategoriesService {
  constructor(
    private readonly getCategoriesUseCase: IGetCategoriesUseCase,
    private readonly logger: Logger
  ) { }

  async getCategoriesData(): Promise<CategoriesDataDTO> {
    try {
      this.logger.info('BackendCategoriesService: Getting categories data');

      const categoriesData = await this.getCategoriesUseCase.execute();

      this.logger.info('BackendCategoriesService: Successfully retrieved categories data');
      return categoriesData;
    } catch (error) {
      this.logger.error('BackendCategoriesService: Error getting categories data', error);
      throw error;
    }
  }
}
