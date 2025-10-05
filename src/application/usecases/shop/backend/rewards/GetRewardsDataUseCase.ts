import {
  GetRewardsDataInput,
  RewardsDataDTO,
} from "@/src/application/dtos/shop/backend/reward-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { RewardMapper } from "@/src/application/mappers/shop/backend/reward-mapper";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import {
  ShopBackendRewardError,
  ShopBackendRewardErrorType,
  ShopBackendRewardRepository,
} from "@/src/domain/repositories/shop/backend/backend-reward-repository";

/**
 * Use case for getting rewards data bundle: paginated rewards, stats, type stats, recent usage
 */
export class GetRewardsDataUseCase
  implements IUseCase<GetRewardsDataInput, RewardsDataDTO>
{
  constructor(private rewardRepository: ShopBackendRewardRepository) {}

  async execute(input: GetRewardsDataInput): Promise<RewardsDataDTO> {
    try {
      const paginationParams: PaginationParams = {
        page: input.page || 1,
        limit: input.limit || 10,
      };

      const [paginatedRewards, stats, typeStats, recentUsage] =
        await Promise.all([
          this.rewardRepository.getPaginatedRewards({
            ...paginationParams,
            shopId: input.shopId,
          }),
          this.rewardRepository.getRewardStats(input.shopId),
          this.rewardRepository.getRewardTypeStats(input.shopId),
          this.rewardRepository.getRecentRewardUsage({
            ...paginationParams,
            shopId: input.shopId,
          }),
        ]);

      return RewardMapper.toRewardsDataDTO(
        paginatedRewards,
        stats,
        typeStats,
        recentUsage
      );
    } catch (error) {
      if (error instanceof ShopBackendRewardError) {
        throw error;
      }

      throw new ShopBackendRewardError(
        ShopBackendRewardErrorType.UNKNOWN,
        "Failed to get rewards data",
        "GetRewardsDataUseCase.execute",
        { shopId: input.shopId },
        error
      );
    }
  }
}
