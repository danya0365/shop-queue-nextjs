import { GetPromotionsPaginatedInput, PaginatedPromotionsDTO } from "@/src/application/dtos/shop/backend/promotions-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { PromotionMapper } from "@/src/application/mappers/shop/backend/promotion-mapper";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import { ShopBackendPromotionError, ShopBackendPromotionErrorType, ShopBackendPromotionRepository } from "@/src/domain/repositories/shop/backend/backend-promotion-repository";

/**
 * Use case for getting paginated promotions data
 * Following SOLID principles and Clean Architecture
 */
export class GetPromotionsPaginatedUseCase implements IUseCase<GetPromotionsPaginatedInput, PaginatedPromotionsDTO> {
  constructor(
    private promotionRepository: ShopBackendPromotionRepository
  ) { }

  /**
   * Execute the use case to get paginated promotions data
   * @param input Pagination parameters
   * @returns Paginated promotions data
   */
  async execute(input: GetPromotionsPaginatedInput): Promise<PaginatedPromotionsDTO> {
    try {
      const paginationParams: PaginationParams = {
        page: input.page || 1,
        limit: input.limit || 10
      };

      const paginatedPromotions = await this.promotionRepository.getPaginatedPromotions(paginationParams);
      return PromotionMapper.toPaginatedDTO(paginatedPromotions);
    } catch (error) {
      if (error instanceof ShopBackendPromotionError) {
        throw error;
      }

      throw new ShopBackendPromotionError(
        ShopBackendPromotionErrorType.UNKNOWN,
        'Failed to get paginated promotions',
        'GetPromotionsPaginatedUseCase.execute',
        {},
        error
      );
    }
  }
}
