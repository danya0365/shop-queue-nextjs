import { BackendRewardsService } from '@/src/application/services/BackendRewardsService';
import type { 
  RewardsDataDTO, 
  RewardTypeStatsDTO 
} from '@/src/application/dtos/RewardDTO';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface RewardsViewModel {
  rewardsData: RewardsDataDTO;
  rewardTypeStats: RewardTypeStatsDTO;
}

export class RewardsPresenter {
  constructor(
    private readonly rewardsService: BackendRewardsService,
    private readonly logger: Logger
  ) {}

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
  static create(): RewardsPresenter {
    // Mock logger for now - in real implementation would use DI container
    const mockLogger: Logger = {
      info: (message: string, meta?: any) => console.log(`[INFO] ${message}`, meta),
      error: (message: string, error?: any) => console.error(`[ERROR] ${message}`, error),
      warn: (message: string, meta?: any) => console.warn(`[WARN] ${message}`, meta),
      debug: (message: string, meta?: any) => console.debug(`[DEBUG] ${message}`, meta)
    };

    const rewardsService = new BackendRewardsService();
    
    return new RewardsPresenter(rewardsService, mockLogger);
  }
}
