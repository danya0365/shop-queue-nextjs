import type { CreatePromotionParams, PromotionDTO, PromotionsDataDTO, PromotionStatsDTO, UpdatePromotionParams } from '@/src/application/dtos/backend/promotions-dto';
import { GetPromotionsPaginatedInput, PaginatedPromotionsDTO } from '@/src/application/dtos/backend/promotions-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IBackendPromotionsService {
  getPromotionsData(page?: number, perPage?: number): Promise<PromotionsDataDTO>;
  getPromotionStats(): Promise<PromotionStatsDTO>;
  getPromotionById(id: string): Promise<PromotionDTO>;
  createPromotion(params: CreatePromotionParams): Promise<PromotionDTO>;
  updatePromotion(id: string, params: UpdatePromotionParams): Promise<PromotionDTO>;
  deletePromotion(id: string): Promise<boolean>;
}

export class BackendPromotionsService implements IBackendPromotionsService {
  constructor(
    private readonly getPromotionsPaginatedUseCase: IUseCase<GetPromotionsPaginatedInput, PaginatedPromotionsDTO>,
    private readonly getPromotionStatsUseCase: IUseCase<void, PromotionStatsDTO>,
    private readonly getPromotionByIdUseCase: IUseCase<string, PromotionDTO>,
    private readonly createPromotionUseCase: IUseCase<CreatePromotionParams, PromotionDTO>,
    private readonly updatePromotionUseCase: IUseCase<UpdatePromotionParams, PromotionDTO>,
    private readonly deletePromotionUseCase: IUseCase<string, boolean>,
    private readonly logger: Logger
  ) { }


  /**
   * Get promotions data including paginated promotions and statistics
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @returns Promotions data DTO
   */
  async getPromotionsData(page: number = 1, perPage: number = 10): Promise<PromotionsDataDTO> {
    try {
      this.logger.info('Getting promotions data', { page, perPage });

      // Get promotions and stats in parallel
      const [promotionsResult, stats] = await Promise.all([
        this.getPromotionsPaginatedUseCase.execute({ page, limit: perPage }),
        this.getPromotionStatsUseCase.execute()
      ]);

      return {
        promotions: promotionsResult.data,
        stats,
        totalCount: promotionsResult.pagination.totalItems,
        currentPage: promotionsResult.pagination.currentPage,
        perPage: promotionsResult.pagination.itemsPerPage
      };
    } catch (error) {
      this.logger.error('Error getting promotions data', { error, page, perPage });
      throw error;
    }
  }

  /**
   * Get promotion statistics
   * @returns Promotion stats DTO
   */
  async getPromotionStats(): Promise<PromotionStatsDTO> {
    try {
      this.logger.info('Getting promotion stats');

      const stats = await this.getPromotionStatsUseCase.execute();
      return stats;
    } catch (error) {
      this.logger.error('Error getting promotion stats', { error });
      throw error;
    }
  }

  /**
   * Get a promotion by ID
   * @param id Promotion ID
   * @returns Promotion DTO
   */
  async getPromotionById(id: string): Promise<PromotionDTO> {
    try {
      this.logger.info('Getting promotion by ID', { id });

      const result = await this.getPromotionByIdUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error getting promotion by ID', { error, id });
      throw error;
    }
  }

  /**
   * Create a new promotion
   * @param params Promotion creation parameters
   * @returns Created promotion DTO
   */
  async createPromotion(params: CreatePromotionParams): Promise<PromotionDTO> {
    try {
      this.logger.info('Creating promotion', { params });

      const result = await this.createPromotionUseCase.execute(params);
      return result;
    } catch (error) {
      this.logger.error('Error creating promotion', { error, params });
      throw error;
    }
  }

  /**
   * Update an existing promotion
   * @param id Promotion ID
   * @param params Promotion update parameters
   * @returns Updated promotion DTO
   */
  async updatePromotion(id: string, params: UpdatePromotionParams): Promise<PromotionDTO> {
    try {
      this.logger.info('Updating promotion', { id, params });

      const updateData = { ...params, id };
      const result = await this.updatePromotionUseCase.execute(updateData);
      return result;
    } catch (error) {
      this.logger.error('Error updating promotion', { error, id, params });
      throw error;
    }
  }

  /**
   * Delete a promotion
   * @param id Promotion ID
   * @returns Success flag
   */
  async deletePromotion(id: string): Promise<boolean> {
    try {
      this.logger.info('Deleting promotion', { id });

      const result = await this.deletePromotionUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error deleting promotion', { error, id });
      throw error;
    }
  }
}
