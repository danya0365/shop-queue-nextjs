import { PromotionStatsDTO } from "@/src/application/dtos/backend/promotions-dto";
import { PromotionMapper } from "@/src/application/mappers/backend/promotion-mapper";
import { BackendPromotionRepository, BackendPromotionError, BackendPromotionErrorType } from "@/src/domain/repositories/backend/backend-promotion-repository";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";

/**
 * Use case for getting promotion statistics
 * Following SOLID principles and Clean Architecture
 */
export class GetPromotionStatsUseCase implements IUseCase<void, PromotionStatsDTO> {
  constructor(
    private promotionRepository: BackendPromotionRepository
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
      if (error instanceof BackendPromotionError) {
        throw error;
      }
      
      throw new BackendPromotionError(
        BackendPromotionErrorType.UNKNOWN,
        'Failed to get promotion statistics',
        'GetPromotionStatsUseCase.execute',
        {},
        error
      );
    }
  }
}
