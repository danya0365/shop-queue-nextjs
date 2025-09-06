import type {
  RewardsDataDTO,
  RewardTypeStatsDTO
} from '@/src/application/dtos/reward-dto';
import { IBackendRewardsService } from '@/src/application/services/backend/BackendRewardsService';
import { getBackendContainer } from '@/src/di/backend-container';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface RewardsViewModel {
  rewardsData: RewardsDataDTO;
  rewardTypeStats: RewardTypeStatsDTO;
}

export class RewardsPresenter {
  constructor(
    private readonly rewardsService: IBackendRewardsService,
    private readonly logger: Logger
  ) { }

  async getViewModel(): Promise<RewardsViewModel> {
    try {
      this.logger.info('RewardsPresenter: Getting rewards view model');

      const [rewardsData, rewardTypeStats] = await Promise.all([
        this.rewardsService.getRewardsData(),
        this.rewardsService.getRewardTypeStats()
      ]);

      this.logger.info('RewardsPresenter: Successfully retrieved rewards data', {
        totalRewards: rewardsData.totalCount,
        activeRewards: rewardsData.stats.activeRewards
      });

      return {
        rewardsData,
        rewardTypeStats
      };
    } catch (error) {
      this.logger.error('RewardsPresenter: Error getting view model', error);
      throw error;
    }
  }

  getMetadata() {
    return {
      title: 'จัดการรางวัล | Shop Queue Admin',
      description: 'ระบบจัดการรางวัลและแต้มสะสมสำหรับผู้ดูแลระบบ Shop Queue',
    };
  }
}

export class RewardsPresenterFactory {
  static async create(): Promise<RewardsPresenter> {

    const serverContainer = await getBackendContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const backendRewardsService = serverContainer.resolve<IBackendRewardsService>('BackendRewardsService');
    return new RewardsPresenter(backendRewardsService, logger);
  }
}
