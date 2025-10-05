import { PaginatedRewardsDTO } from "@/src/application/dtos/shop/backend/reward-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { RewardMapper } from "@/src/application/mappers/shop/backend/reward-mapper";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import { ShopBackendRewardError, ShopBackendRewardErrorType, ShopBackendRewardRepository } from "@/src/domain/repositories/shop/backend/backend-reward-repository";

export interface GetRewardsPaginatedInput {
  shopId: string;
  page?: number;
  limit?: number;
}

/**
 * Use case for getting only paginated rewards data
 * Following SOLID principles and Clean Architecture
 */
export class GetRewardsPaginatedUseCase implements IUseCase<GetRewardsPaginatedInput, PaginatedRewardsDTO> {
  constructor(
    private rewardRepository: ShopBackendRewardRepository
  ) { }

  /**
   * Execute the use case to get paginated rewards only
   * @param input Pagination parameters
   * @returns Paginated rewards DTO
   */
  async execute(input: GetRewardsPaginatedInput): Promise<PaginatedRewardsDTO> {
    try {
      const paginationParams: PaginationParams = {
        page: input.page || 1,
        limit: input.limit || 10
      };

      const paginatedRewards = await this.rewardRepository.getPaginatedRewards({ ...paginationParams, shopId: input.shopId });
      return RewardMapper.toPaginatedDTO(paginatedRewards);
    } catch (error) {
      if (error instanceof ShopBackendRewardError) {
        throw error;
      }

      throw new ShopBackendRewardError(
        ShopBackendRewardErrorType.UNKNOWN,
        'Failed to get paginated rewards',
        'GetRewardsPaginatedUseCase.execute',
        {},
        error
      );
    }
  }
}
