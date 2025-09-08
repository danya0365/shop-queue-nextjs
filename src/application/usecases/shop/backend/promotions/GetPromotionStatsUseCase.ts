import { PromotionStatsDTO } from "@/src/application/dtos/shop/backend/promotions-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { PromotionMapper } from "@/src/application/mappers/shop/backend/promotion-mapper";
import { ShopBackendPromotionError, ShopBackendPromotionErrorType, ShopBackendPromotionRepository } from "@/src/domain/repositories/shop/backend/backend-promotion-repository";

/**
 * Use case for getting promotion statistics
 * Following SOLID principles and Clean Architecture
 */
export class GetPromotionStatsUseCase implements IUseCase<void, PromotionStatsDTO> {
  constructor(
    private promotionRepository: ShopBackendPromotionRepository
  ) { }

  /**
   * Execute the use case to get promotion statistics
   * @returns Promotion statistics data
   */
  async execute(): Promise<PromotionStatsDTO> {
    try {
      const promotionStats = await this.promotionRepository.getPromotionStats();
      return PromotionMapper.statsToDTO(promotionStats);
    } catch (error) {
      if (error instanceof ShopBackendPromotionError) {
        throw error;
      }

      throw new ShopBackendPromotionError(
        ShopBackendPromotionErrorType.UNKNOWN,
        'Failed to get promotion statistics',
        'GetPromotionStatsUseCase.execute',
        {},
        error
      );
    }
  }
}
