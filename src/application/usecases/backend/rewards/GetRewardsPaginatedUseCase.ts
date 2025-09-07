import { RewardsDataDTO } from "@/src/application/dtos/backend/reward-dto";
import { RewardMapper } from "@/src/application/mappers/backend/reward-mapper";
import { BackendRewardRepository, BackendRewardError, BackendRewardErrorType } from "@/src/domain/repositories/backend/backend-reward-repository";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";

export interface GetRewardsPaginatedInput {
  page?: number;
  limit?: number;
}

/**
 * Use case for getting paginated rewards data with stats and recent usage
 * Following SOLID principles and Clean Architecture
 */
export class GetRewardsPaginatedUseCase implements IUseCase<GetRewardsPaginatedInput, RewardsDataDTO> {
  constructor(
    private rewardRepository: BackendRewardRepository
  ) { }

  /**
   * Execute the use case to get paginated rewards data
   * @param input Pagination parameters
   * @returns Rewards data with pagination, stats, and recent usage
   */
  async execute(input: GetRewardsPaginatedInput): Promise<RewardsDataDTO> {
    try {
      const paginationParams: PaginationParams = {
        page: input.page || 1,
        limit: input.limit || 10
      };

      // Get rewards, stats, type stats, and recent usage in parallel
      const [paginatedRewards, stats, typeStats, recentUsage] = await Promise.all([
        this.rewardRepository.getPaginatedRewards(paginationParams),
        this.rewardRepository.getRewardStats(),
        this.rewardRepository.getRewardTypeStats(),
        this.rewardRepository.getRecentRewardUsage(5)
      ]);

      return RewardMapper.toRewardsDataDTO(paginatedRewards, stats, typeStats, recentUsage);
    } catch (error) {
      if (error instanceof BackendRewardError) {
        throw error;
      }
      
      throw new BackendRewardError(
        BackendRewardErrorType.UNKNOWN,
        'Failed to get paginated rewards',
        'GetRewardsPaginatedUseCase.execute',
        {},
        error
      );
    }
  }
}
