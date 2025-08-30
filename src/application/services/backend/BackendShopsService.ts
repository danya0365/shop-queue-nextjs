
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
        total_count: paginatedData.total_count,
        current_page: paginatedData.current_page,
        per_page: paginatedData.per_page
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
          category_id: '',  // Default values for required fields
          category_name: '',
          owner_id: shop.ownerId,
          owner_name: shop.ownerName || '',
          status: shop.status as 'active' | 'inactive' | 'pending',
          opening_hours: [],
          queue_count: 0,
          total_services: 0,
          rating: 0,
          total_reviews: 0,
          created_at: shop.createdAt,
          updated_at: shop.updatedAt || ''
        })),
        stats: {
          total_shops: 0,
          active_shops: 0,
          pending_approval: 0,
          new_this_month: 0
        }, // Empty stats
        total_count: result.pagination.totalItems,
        current_page: result.pagination.currentPage,
        per_page: result.pagination.itemsPerPage
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
          total_shops: stats.totalShops,
          active_shops: stats.activeShops,
          pending_approval: stats.pendingApproval,
          new_this_month: stats.newThisMonth
        },
        total_count: 0,
        current_page: 0,
        per_page: 0
      };
    } catch (error) {
      this.logger.error('BackendShopsService: Error getting shop statistics', error);
      throw error;
    }
  }
}
