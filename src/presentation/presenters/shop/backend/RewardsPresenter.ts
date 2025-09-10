import { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import type { Reward, RewardsBackendService } from '@/src/application/services/shop/backend/rewards-backend-service';
import { IShopService } from '@/src/application/services/shop/ShopService';
import { ISubscriptionService } from '@/src/application/services/subscription/SubscriptionService';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { Metadata } from 'next';
import { BaseShopBackendPresenter } from './BaseShopBackendPresenter';

// Define ViewModel interface
export interface RewardsViewModel {
  rewards: Reward[];
  totalRewards: number;
  activeRewards: number;
  inactiveRewards: number;
  totalPointsRequired: number;
  totalRedeemed: number;
  rewardsByType: {
    discount: number;
    free_item: number;
    cashback: number;
    special_privilege: number;
  };
}

// Main Presenter class
export class RewardsPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly rewardsBackendService: RewardsBackendService,
  ) {
    super(logger, shopService, authService, profileService, subscriptionService);
  }

  async getViewModel(shopId: string): Promise<RewardsViewModel> {
    try {
      this.logger.info('RewardsPresenter: Getting view model', { shopId });

      // Get rewards data
      const rewards = await this.rewardsBackendService.getRewards(shopId);

      // Calculate statistics
      const totalRewards = rewards.length;
      const activeRewards = rewards.filter(reward => reward.isAvailable).length;
      const inactiveRewards = totalRewards - activeRewards;
      const totalPointsRequired = rewards.reduce((sum, reward) => sum + reward.pointsRequired, 0);
      const totalRedeemed = rewards.reduce((sum, reward) => sum + (reward.totalRedeemed || 0), 0);

      // Calculate rewards by type
      const rewardsByType = {
        discount: rewards.filter(r => r.type === 'discount').length,
        free_item: rewards.filter(r => r.type === 'free_item').length,
        cashback: rewards.filter(r => r.type === 'cashback').length,
        special_privilege: rewards.filter(r => r.type === 'special_privilege').length,
      };

      return {
        rewards,
        totalRewards,
        activeRewards,
        inactiveRewards,
        totalPointsRequired,
        totalRedeemed,
        rewardsByType,
      };
    } catch (error) {
      this.logger.error('RewardsPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Metadata generation
  async generateMetadata(shopId: string): Promise<Metadata> {
    return this.generateShopMetadata(
      shopId,
      'จัดการรางวัล',
      'จัดการรางวัลและแต้มสะสม สร้างโปรแกรมสมาชิกที่น่าสนใจ',
    );
  }
}

// Factory class
export class RewardsPresenterFactory {
  static async create(): Promise<RewardsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const rewardsBackendService = serverContainer.resolve<RewardsBackendService>('RewardsBackendService');
    const shopService = serverContainer.resolve<IShopService>('ShopService');
    const authService = serverContainer.resolve<IAuthService>('AuthService');
    const profileService = serverContainer.resolve<IProfileService>('ProfileService');
    const subscriptionService = serverContainer.resolve<ISubscriptionService>('SubscriptionService');
    return new RewardsPresenter(logger, shopService, authService, profileService, subscriptionService, rewardsBackendService);
  }
}
