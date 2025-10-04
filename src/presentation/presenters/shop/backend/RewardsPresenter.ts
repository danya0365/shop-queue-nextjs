import { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import type { Reward, RewardsBackendService, CreateRewardData, UpdateRewardData } from '@/src/application/services/shop/backend/rewards-backend-service';
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

      // Auth and profile checks for parity with other backend presenters
      const user = await this.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error('Profile not found');
      }

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

  async getRewardById(shopId: string, rewardId: string): Promise<Reward | null> {
    try {
      this.logger.info('RewardsPresenter: Getting reward by ID', { shopId, rewardId });
      return await this.rewardsBackendService.getRewardById(shopId, rewardId);
    } catch (error) {
      this.logger.error('RewardsPresenter: Error getting reward by ID', error);
      throw error;
    }
  }

  async createReward(shopId: string, data: CreateRewardData): Promise<Reward> {
    try {
      this.logger.info('RewardsPresenter: Creating reward', { shopId, data });
      // Basic validations mirroring hook checks
      if (!data.name || !data.type || !data.pointsRequired || !data.value) {
        throw new Error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      }
      if (data.pointsRequired <= 0) throw new Error('แต้มที่ต้องใช้ต้องมากกว่า 0');
      if (data.value <= 0) throw new Error('มูลค่าต้องมากกว่า 0');
      if (data.expiryDays !== undefined && data.expiryDays <= 0) throw new Error('จำนวนวันหมดอายุต้องมากกว่า 0');
      if (data.usageLimit !== undefined && data.usageLimit <= 0) throw new Error('จำนวนครั้งที่ใช้ได้ต้องมากกว่า 0');

      return await this.rewardsBackendService.createReward(shopId, data);
    } catch (error) {
      this.logger.error('RewardsPresenter: Error creating reward', error);
      throw error;
    }
  }

  async updateReward(shopId: string, rewardId: string, data: UpdateRewardData): Promise<Reward> {
    try {
      this.logger.info('RewardsPresenter: Updating reward', { shopId, rewardId, data });
      if (!rewardId) throw new Error('ไม่พบรหัสรางวัล');
      if (data.pointsRequired !== undefined && data.pointsRequired <= 0) throw new Error('แต้มที่ต้องใช้ต้องมากกว่า 0');
      if (data.value !== undefined && data.value <= 0) throw new Error('มูลค่าต้องมากกว่า 0');
      if (data.expiryDays !== undefined && data.expiryDays <= 0) throw new Error('จำนวนวันหมดอายุต้องมากกว่า 0');
      if (data.usageLimit !== undefined && data.usageLimit <= 0) throw new Error('จำนวนครั้งที่ใช้ได้ต้องมากกว่า 0');

      return await this.rewardsBackendService.updateReward(shopId, rewardId, data);
    } catch (error) {
      this.logger.error('RewardsPresenter: Error updating reward', error);
      throw error;
    }
  }

  async deleteReward(shopId: string, rewardId: string): Promise<boolean> {
    try {
      this.logger.info('RewardsPresenter: Deleting reward', { shopId, rewardId });
      if (!rewardId) throw new Error('ไม่พบรหัสรางวัล');
      return await this.rewardsBackendService.deleteReward(shopId, rewardId);
    } catch (error) {
      this.logger.error('RewardsPresenter: Error deleting reward', error);
      throw error;
    }
  }

  async toggleRewardAvailability(shopId: string, rewardId: string): Promise<Reward> {
    try {
      this.logger.info('RewardsPresenter: Toggling reward availability', { shopId, rewardId });
      if (!rewardId) throw new Error('ไม่พบรหัสรางวัล');
      return await this.rewardsBackendService.toggleRewardAvailability(shopId, rewardId);
    } catch (error) {
      this.logger.error('RewardsPresenter: Error toggling reward availability', error);
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

// Client Factory class
export class ClientRewardsPresenterFactory {
  static async create(): Promise<RewardsPresenter> {
    const { getClientContainer } = await import('@/src/di/client-container');
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>('Logger');
    const rewardsBackendService = clientContainer.resolve<RewardsBackendService>('RewardsBackendService');
    const shopService = clientContainer.resolve<IShopService>('ShopService');
    const authService = clientContainer.resolve<IAuthService>('AuthService');
    const profileService = clientContainer.resolve<IProfileService>('ProfileService');
    const subscriptionService = clientContainer.resolve<ISubscriptionService>('SubscriptionService');
    return new RewardsPresenter(logger, shopService, authService, profileService, subscriptionService, rewardsBackendService);
  }
}
