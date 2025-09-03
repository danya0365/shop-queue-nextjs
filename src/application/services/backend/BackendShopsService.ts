import type { PaginatedShopsDTO, ShopStatsDTO, ShopsDataDTO } from '@/src/application/dtos/backend/shops-dto';
import type { GetShopsPaginatedUseCaseInput } from '@/src/application/usecases/backend/shops/GetShopsPaginatedUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';
import { IUseCase } from '../../interfaces/use-case.interface';

export interface IBackendShopsService {
  getShopsData(page?: number, perPage?: number): Promise<ShopsDataDTO>;
  getShopsPaginated(page?: number, perPage?: number): Promise<PaginatedShopsDTO>;
  getShopStats(): Promise<ShopStatsDTO>;
}

export class BackendShopsService implements IBackendShopsService {
  constructor(
    private readonly getShopsPaginatedUseCase: IUseCase<GetShopsPaginatedUseCaseInput, PaginatedShopsDTO>,
    private readonly getShopStatsUseCase: IUseCase<void, ShopStatsDTO>,
    private readonly logger: Logger
  ) { }

  /**
   * Get shops data including paginated shops and statistics
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @returns Shops data DTO
   */
  async getShopsData(page: number = 1, perPage: number = 10): Promise<ShopsDataDTO> {
    try {
      this.logger.info('Getting shops data', { page, perPage });

      // Get shops and stats in parallel
      const [shopsResult, stats] = await Promise.all([
        this.getShopsPaginatedUseCase.execute({ page, perPage }),
        this.getShopStatsUseCase.execute()
      ]);

      return {
        shops: shopsResult.data,
        stats,
        totalCount: shopsResult.pagination.totalItems,
        currentPage: shopsResult.pagination.currentPage,
        perPage: shopsResult.pagination.itemsPerPage
      };
    } catch (error) {
      this.logger.error('Error getting shops data', { error, page, perPage });
      throw error;
    }
  }


  async getShopsPaginated(page: number = 1, perPage: number = 10): Promise<PaginatedShopsDTO> {
    try {
      this.logger.info('Getting paginated shops data', { page, perPage });

      const result = await this.getShopsPaginatedUseCase.execute({ page, perPage });
      return result;
    } catch (error) {
      this.logger.error('Error getting paginated shops data', { error, page, perPage });
      throw error;
    }
  }

  async getShopStats(): Promise<ShopStatsDTO> {
    try {
      this.logger.info('Getting shop statistics');

      const result = await this.getShopStatsUseCase.execute();
      return result;
    } catch (error) {
      this.logger.error('Error getting shop statistics', { error });
      throw error;
    }
  }
}
