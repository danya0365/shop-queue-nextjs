import type {
  CreateRewardDTO,
  RewardDTO as Reward,
  RewardTypeStatsDTO,
  UpdateRewardDTO,
} from "@/src/application/dtos/shop/backend/reward-dto";
import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import type { ShopBackendRewardsService } from "@/src/application/services/shop/backend/BackendRewardsService";
import type { ShopBackendShopSettingsService } from "@/src/application/services/shop/backend/BackendShopSettingsService";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { Metadata } from "next";
import { BaseShopBackendPresenter } from "./BaseShopBackendPresenter";

// Define ViewModel interface
export interface RewardsViewModel {
  rewards: Reward[];
  totalRewards: number;
  activeRewards: number;
  inactiveRewards: number;
  totalPointsRequired: number;
  totalRedeemed: number;
  totalPointsRedeemed: number;
  averageRedemptionValue: number;
  popularRewardType: Reward["type"] | null;
  typeStats: RewardTypeStatsDTO;
  pointsEnabled: boolean;
}

// Main Presenter class
export class RewardsPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly rewardsBackendService: ShopBackendRewardsService,
    private readonly shopBackendShopSettingsService: ShopBackendShopSettingsService
  ) {
    super(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService
    );
  }

  async getViewModel(shopId: string): Promise<RewardsViewModel> {
    try {
      this.logger.info("RewardsPresenter: Getting view model", { shopId });

      // Auth and profile checks for parity with other backend presenters
      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }
      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error("Profile not found");
      }

      // Get rewards data (scoped by shop)
      const [rewardsData, shopSettings] = await Promise.all([
        this.rewardsBackendService.getRewardsData(shopId),
        this.shopBackendShopSettingsService.getShopSettings(shopId),
      ]);
      const rewards = rewardsData.rewards;
      const pointsEnabled = shopSettings?.pointsEnabled ?? false;

      // Calculate statistics (prefer stats from service if available)
      const totalRewards = rewardsData.stats.totalRewards;
      const activeRewards = rewardsData.stats.activeRewards;
      const inactiveRewards = totalRewards - activeRewards;
      const totalPointsRequired = rewards.reduce(
        (sum, reward) => sum + reward.pointsRequired,
        0
      );
      const totalRedeemed = rewardsData.stats.totalRedemptions;
      const totalPointsRedeemed = rewardsData.stats.totalPointsRedeemed;
      const averageRedemptionValue = rewardsData.stats.averageRedemptionValue;
      const popularRewardType = (rewardsData.stats.popularRewardType ||
        null) as Reward["type"] | null;

      return {
        rewards,
        totalRewards,
        activeRewards,
        inactiveRewards,
        totalPointsRequired,
        totalRedeemed,
        totalPointsRedeemed,
        averageRedemptionValue,
        popularRewardType,
        typeStats: rewardsData.typeStats,
        pointsEnabled,
      };
    } catch (error) {
      this.logger.error("RewardsPresenter: Error getting view model", error);
      throw error;
    }
  }

  async getRewardById(
    shopId: string,
    rewardId: string
  ): Promise<Reward | null> {
    try {
      this.logger.info("RewardsPresenter: Getting reward by ID", {
        shopId,
        rewardId,
      });
      return await this.rewardsBackendService.getRewardById(rewardId);
    } catch (error) {
      this.logger.error("RewardsPresenter: Error getting reward by ID", error);
      throw error;
    }
  }

  async createReward(
    shopId: string,
    data: {
      name: string;
      description?: string;
      type: Reward["type"];
      pointsRequired: number;
      value: number;
      expiryDays?: number;
      usageLimit?: number;
      icon?: string;
    }
  ): Promise<Reward> {
    try {
      this.logger.info("RewardsPresenter: Creating reward", { shopId, data });
      // Basic validations mirroring hook checks
      if (!data.name || !data.type || !data.pointsRequired || !data.value) {
        throw new Error("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      }
      if (data.pointsRequired <= 0)
        throw new Error("แต้มที่ต้องใช้ต้องมากกว่า 0");
      if (data.value <= 0) throw new Error("มูลค่าต้องมากกว่า 0");
      if (data.expiryDays !== undefined && data.expiryDays <= 0)
        throw new Error("จำนวนวันหมดอายุต้องมากกว่า 0");
      // 0 = unlimited (allowed); only reject negative values
      if (data.usageLimit !== undefined && data.usageLimit < 0)
        throw new Error("จำนวนครั้งที่ใช้ได้ต้องไม่ติดลบ (ใส่ 0 หากไม่จำกัด)");

      const dto: CreateRewardDTO = {
        shopId,
        name: data.name,
        description: data.description,
        type: data.type,
        pointsRequired: data.pointsRequired,
        value: data.value,
        expiryDays: data.expiryDays,
        usageLimit: data.usageLimit,
        icon: data.icon,
      };
      return await this.rewardsBackendService.createReward(dto);
    } catch (error) {
      this.logger.error("RewardsPresenter: Error creating reward", error);
      throw error;
    }
  }

  async updateReward(
    shopId: string,
    rewardId: string,
    data: {
      name?: string;
      description?: string;
      type?: Reward["type"];
      pointsRequired?: number;
      value?: number;
      isAvailable?: boolean;
      expiryDays?: number;
      usageLimit?: number;
      icon?: string;
    }
  ): Promise<Reward> {
    try {
      this.logger.info("RewardsPresenter: Updating reward", {
        shopId,
        rewardId,
        data,
      });
      if (!rewardId) throw new Error("ไม่พบรหัสรางวัล");
      if (data.pointsRequired !== undefined && data.pointsRequired <= 0)
        throw new Error("แต้มที่ต้องใช้ต้องมากกว่า 0");
      if (data.value !== undefined && data.value <= 0)
        throw new Error("มูลค่าต้องมากกว่า 0");
      if (data.expiryDays !== undefined && data.expiryDays <= 0)
        throw new Error("จำนวนวันหมดอายุต้องมากกว่า 0");
      // 0 = unlimited (allowed); only reject negative values
      if (data.usageLimit !== undefined && data.usageLimit < 0)
        throw new Error("จำนวนครั้งที่ใช้ได้ต้องไม่ติดลบ (ใส่ 0 หากไม่จำกัด)");

      const updateData: Omit<UpdateRewardDTO, "id"> = {
        name: data.name,
        description: data.description,
        type: data.type,
        pointsRequired: data.pointsRequired,
        value: data.value,
        isAvailable: data.isAvailable,
        expiryDays: data.expiryDays,
        usageLimit: data.usageLimit,
        icon: data.icon,
      };
      return await this.rewardsBackendService.updateReward(
        rewardId,
        updateData
      );
    } catch (error) {
      this.logger.error("RewardsPresenter: Error updating reward", error);
      throw error;
    }
  }

  async deleteReward(shopId: string, rewardId: string): Promise<boolean> {
    try {
      this.logger.info("RewardsPresenter: Deleting reward", {
        shopId,
        rewardId,
      });
      if (!rewardId) throw new Error("ไม่พบรหัสรางวัล");
      return await this.rewardsBackendService.deleteReward(rewardId);
    } catch (error) {
      this.logger.error("RewardsPresenter: Error deleting reward", error);
      throw error;
    }
  }

  async toggleRewardAvailability(
    shopId: string,
    rewardId: string
  ): Promise<Reward> {
    try {
      this.logger.info("RewardsPresenter: Toggling reward availability", {
        shopId,
        rewardId,
      });
      if (!rewardId) throw new Error("ไม่พบรหัสรางวัล");
      // Fetch current reward and flip availability
      const current = await this.rewardsBackendService.getRewardById(rewardId);
      if (!current) throw new Error("ไม่พบรางวัล");
      return await this.rewardsBackendService.updateReward(rewardId, {
        isAvailable: !current.isAvailable,
      });
    } catch (error) {
      this.logger.error(
        "RewardsPresenter: Error toggling reward availability",
        error
      );
      throw error;
    }
  }

  // Metadata generation
  async generateMetadata(shopId: string): Promise<Metadata> {
    return this.generateShopMetadata(
      shopId,
      "จัดการรางวัล",
      "จัดการรางวัลและแต้มสะสม สร้างโปรแกรมสมาชิกที่น่าสนใจ"
    );
  }
}

// Factory class
export class RewardsPresenterFactory {
  static async create(): Promise<RewardsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const rewardsBackendService =
      serverContainer.resolve<ShopBackendRewardsService>(
        "ShopBackendRewardsService"
      );
    const shopBackendShopSettingsService =
      serverContainer.resolve<ShopBackendShopSettingsService>(
        "ShopBackendShopSettingsService"
      );
    const shopService = serverContainer.resolve<IShopService>("ShopService");
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService =
      serverContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService = serverContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    return new RewardsPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      rewardsBackendService,
      shopBackendShopSettingsService
    );
  }
}

// Client Factory class
export class ClientRewardsPresenterFactory {
  static async create(): Promise<RewardsPresenter> {
    const { getClientContainer } = await import("@/src/di/client-container");
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const rewardsBackendService =
      clientContainer.resolve<ShopBackendRewardsService>(
        "ShopBackendRewardsService"
      );
    const shopBackendShopSettingsService =
      clientContainer.resolve<ShopBackendShopSettingsService>(
        "ShopBackendShopSettingsService"
      );
    const shopService = clientContainer.resolve<IShopService>("ShopService");
    const authService = clientContainer.resolve<IAuthService>("AuthService");
    const profileService =
      clientContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService = clientContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    return new RewardsPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      rewardsBackendService,
      shopBackendShopSettingsService
    );
  }
}
