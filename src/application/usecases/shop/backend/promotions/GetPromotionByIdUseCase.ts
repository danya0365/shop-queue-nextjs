import { PromotionDTO } from "@/src/application/dtos/shop/backend/promotions-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { PromotionMapper } from "@/src/application/mappers/shop/backend/promotion-mapper";
import { ShopBackendPromotionError, ShopBackendPromotionErrorType, ShopBackendPromotionRepository } from "@/src/domain/repositories/shop/backend/backend-promotion-repository";

/**
 * Use case for getting a promotion by ID
 * Following SOLID principles and Clean Architecture
 */
export class GetPromotionByIdUseCase implements IUseCase<string, PromotionDTO> {
  constructor(
    private promotionRepository: ShopBackendPromotionRepository
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
        throw new ShopBackendPromotionError(
          ShopBackendPromotionErrorType.NOT_FOUND,
          `Promotion with ID ${id} not found`,
          'GetPromotionByIdUseCase.execute',
          { id }
        );
      }

      return PromotionMapper.toDTO(promotion);
    } catch (error) {
      if (error instanceof ShopBackendPromotionError) {
        throw error;
      }

      throw new ShopBackendPromotionError(
        ShopBackendPromotionErrorType.UNKNOWN,
        'Failed to get promotion by ID',
        'GetPromotionByIdUseCase.execute',
        { id },
        error
      );
    }
  }
}
