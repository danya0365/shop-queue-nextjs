import { RewardUsageDTO } from "@/src/application/dtos/shop/backend/reward-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { RewardMapper } from "@/src/application/mappers/shop/backend/reward-mapper";
import type { ShopBackendRewardRepository } from "@/src/domain/repositories/shop/backend/backend-reward-repository";
import {
  ShopBackendRewardError,
  ShopBackendRewardErrorType,
} from "@/src/domain/repositories/shop/backend/backend-reward-repository";

export interface GetRecentRewardUsageInput {
  shopId: string;
  page?: number;
  limit?: number;
}

export class GetRecentRewardUsageUseCase
  implements IUseCase<GetRecentRewardUsageInput, RewardUsageDTO[]>
{
  constructor(private readonly rewardRepository: ShopBackendRewardRepository) {}

  async execute({
    shopId,
    limit = 10,
    page = 1,
  }: GetRecentRewardUsageInput): Promise<RewardUsageDTO[]> {
    try {
      if (limit < 1 || limit > 100) {
        throw new ShopBackendRewardError(
          ShopBackendRewardErrorType.VALIDATION_ERROR,
          "Limit must be between 1 and 100",
          "GetRecentRewardUsageUseCase.execute",
          { shopId, limit }
        );
      }

      const recentUsage = await this.rewardRepository.getRecentRewardUsage({
        shopId,
        page,
        limit,
      });
      return recentUsage.map((usage) => RewardMapper.usageToDTO(usage));
    } catch (error) {
      if (error instanceof ShopBackendRewardError) {
        throw error;
      }

      throw new ShopBackendRewardError(
        ShopBackendRewardErrorType.UNKNOWN,
        "Failed to get recent reward usage",
        "GetRecentRewardUsageUseCase.execute",
        { shopId, limit, page },
        error
      );
    }
  }
}
