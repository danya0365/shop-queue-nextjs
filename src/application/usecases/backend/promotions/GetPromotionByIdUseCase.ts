import { PromotionDTO } from "@/src/application/dtos/backend/promotions-dto";
import { PromotionMapper } from "@/src/application/mappers/backend/promotion-mapper";
import { BackendPromotionRepository, BackendPromotionError, BackendPromotionErrorType } from "@/src/domain/repositories/backend/backend-promotion-repository";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";

/**
 * Use case for getting a promotion by ID
 * Following SOLID principles and Clean Architecture
 */
export class GetPromotionByIdUseCase implements IUseCase<string, PromotionDTO> {
  constructor(
    private promotionRepository: BackendPromotionRepository
  ) { }

  /**
   * Execute the use case to get a promotion by ID
   * @param id Promotion ID
   * @returns Promotion data
   */
  async execute(id: string): Promise<PromotionDTO> {
    try {
      const promotion = await this.promotionRepository.getPromotionById(id);
      
      if (!promotion) {
        throw new BackendPromotionError(
          BackendPromotionErrorType.NOT_FOUND,
          `Promotion with ID ${id} not found`,
          'GetPromotionByIdUseCase.execute',
          { id }
        );
      }

      return PromotionMapper.toDTO(promotion);
    } catch (error) {
      if (error instanceof BackendPromotionError) {
        throw error;
      }
      
      throw new BackendPromotionError(
        BackendPromotionErrorType.UNKNOWN,
        'Failed to get promotion by ID',
        'GetPromotionByIdUseCase.execute',
        { id },
        error
      );
    }
  }
}
