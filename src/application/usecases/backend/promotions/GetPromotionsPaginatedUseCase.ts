import { GetPromotionsPaginatedInput, PaginatedPromotionsDTO } from "@/src/application/dtos/backend/promotions-dto";
import { PromotionMapper } from "@/src/application/mappers/backend/promotion-mapper";
import { BackendPromotionRepository, BackendPromotionError, BackendPromotionErrorType } from "@/src/domain/repositories/backend/backend-promotion-repository";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";

/**
 * Use case for getting paginated promotions data
 * Following SOLID principles and Clean Architecture
 */
export class GetPromotionsPaginatedUseCase implements IUseCase<GetPromotionsPaginatedInput, PaginatedPromotionsDTO> {
  constructor(
    private promotionRepository: BackendPromotionRepository
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
      if (error instanceof BackendPromotionError) {
        throw error;
      }
      
      throw new BackendPromotionError(
        BackendPromotionErrorType.UNKNOWN,
        'Failed to get paginated promotions',
        'GetPromotionsPaginatedUseCase.execute',
        {},
        error
      );
    }
  }
}
