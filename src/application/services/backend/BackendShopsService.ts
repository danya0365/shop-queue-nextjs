
import type { ShopsDataDTO } from '@/src/application/dtos/backend/ShopsDTO';
import type { GetShopsPaginatedUseCase } from '@/src/application/usecases/backend/shops/GetShopsPaginatedUseCase';
import type { GetShopStatsUseCase } from '@/src/application/usecases/backend/shops/GetShopStatsUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IBackendShopsService {
  getShopsData(page?: number, limit?: number): Promise<ShopsDataDTO>;
  getShopsPaginated(page: number, limit: number): Promise<ShopsDataDTO>;
  getShopStats(): Promise<ShopsDataDTO>;
}

export class BackendShopsService implements IBackendShopsService {
  constructor(
    private readonly getShopsPaginatedUseCase: GetShopsPaginatedUseCase,
    private readonly getShopStatsUseCase: GetShopStatsUseCase,
    private readonly logger: Logger
  ) { }

  /**
   * Get shops data with pagination and stats (legacy method for backward compatibility)
   * @param page Page number (default: 1)
   * @param limit Items per page (default: 10)
   * @returns Combined shops data with pagination and stats
   */
  async getShopsData(page: number = 1, limit: number = 10): Promise<ShopsDataDTO> {
    try {
      this.logger.info('BackendShopsService: Getting shops data', { page, limit });

      // Get both paginated data and stats in parallel
      const [paginatedData, stats] = await Promise.all([
        this.getShopsPaginated(page, limit),
        this.getShopStats()
      ]);

      // Combine the results
      const result: ShopsDataDTO = {
        shops: paginatedData.shops,
        stats: stats.stats,
        totalCount: paginatedData.totalCount,
        currentPage: paginatedData.currentPage,
        perPage: paginatedData.perPage
      };

      this.logger.info('BackendShopsService: Successfully retrieved shops data');
      return result;
    } catch (error) {
      this.logger.error('BackendShopsService: Error getting shops data', error);
      throw error;
    }
  }

  /**
   * Get paginated shops data
   * @param page Page number
   * @param limit Items per page
   * @returns Paginated shops data
   */
  async getShopsPaginated(page: number, limit: number): Promise<ShopsDataDTO> {
    try {
      this.logger.info('BackendShopsService: Getting paginated shops data', { page, limit });

      const result = await this.getShopsPaginatedUseCase.execute({ page, limit });

      // Convert domain entity to DTO
      return {
        shops: result.data.map(shop => ({
          id: shop.id,
          name: shop.name,
          description: shop.description || '',
          address: shop.address || '',
          phone: shop.phone || '',
          email: shop.email || '',
          categoryId: '',
          categoryName: '',
          ownerId: shop.ownerId,
          ownerName: shop.ownerName || '',
          status: shop.status as 'active' | 'inactive' | 'pending',
          openingHours: [],
          queueCount: 0,
          totalServices: 0,
          rating: 0,
          totalReviews: 0,
          createdAt: shop.createdAt,
          updatedAt: shop.updatedAt || ''
        })),
        stats: {
          totalShops: 0,
          activeShops: 0,
          pendingApproval: 0,
          newThisMonth: 0
        }, // Empty stats
        totalCount: result.pagination.totalItems,
        currentPage: result.pagination.currentPage,
        perPage: result.pagination.itemsPerPage
      };
    } catch (error) {
      this.logger.error('BackendShopsService: Error getting paginated shops data', error);
      throw error;
    }
  }

  /**
   * Get shop statistics
   * @returns Shop statistics
   */
  async getShopStats(): Promise<ShopsDataDTO> {
    try {
      this.logger.info('BackendShopsService: Getting shop statistics');

      const stats = await this.getShopStatsUseCase.execute();

      // Convert domain entity to DTO
      return {
        shops: [], // Shops not included in this method
        stats: {
          totalShops: stats.totalShops,
          activeShops: stats.activeShops,
          pendingApproval: stats.pendingApproval,
          newThisMonth: stats.newThisMonth
        },
        totalCount: 0,
        currentPage: 0,
        perPage: 0
      };
    } catch (error) {
      this.logger.error('BackendShopsService: Error getting shop statistics', error);
      throw error;
    }
  }
}
