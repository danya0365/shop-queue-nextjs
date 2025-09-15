import type { PromotionStatsDTO } from "@/src/application/dtos/backend/promotions-dto";
import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import type { IShopBackendPromotionsService } from "@/src/application/services/shop/backend/BackendPromotionsService";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopBackendPresenter } from "./BaseShopBackendPresenter";

// Define interfaces for data structures
export interface PromotionData {
  id: string;
  name: string;
  description: string | null;
  type: "percentage" | "fixed_amount" | "buy_x_get_y" | "free_shipping";
  status: "active" | "inactive" | "expired" | "scheduled" | null;
  value: number;
  minPurchaseAmount: number | null;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  startAt: string;
  endAt: string;
  conditions: Record<string, any> | null;
  shopId: string;
  createdBy: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PromotionStats {
  totalPromotions: number;
  activePromotions: number;
  inactivePromotions: number;
  expiredPromotions: number;
  scheduledPromotions: number;
  totalUsage: number;
  totalDiscountGiven: number;
  averageDiscountAmount: number;
  mostUsedPromotionType: string | null;
}

// Define ViewModel interface
export interface PromotionsViewModel {
  promotions: PromotionData[];
  stats: PromotionStats;
  totalCount: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
}

// Main Presenter class
export class PromotionsPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly promotionsService: IShopBackendPromotionsService
  ) {
    super(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService
    );
  }

  async getViewModel(
    shopId: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<PromotionsViewModel> {
    try {
      this.logger.info("PromotionsPresenter: Getting view model", {
        shopId,
        page,
        perPage,
      });

      // Get promotions data from service
      const paginatedPromotions =
        await this.promotionsService.getPaginatedPromotionsByShopId(
          shopId,
          page,
          perPage
        );

      const promotionStats =
        await this.promotionsService.getPromotionsStatsByShopId(shopId);

      // Map service DTOs to view model
      const promotions: PromotionData[] = paginatedPromotions.data.map(
        this.mapPromotionData
      );
      const stats: PromotionStats = this.mapStatsData(promotionStats);

      return {
        promotions,
        stats,
        totalCount: paginatedPromotions.pagination.totalItems,
        currentPage: paginatedPromotions.pagination.currentPage,
        perPage: paginatedPromotions.pagination.itemsPerPage,
        totalPages: paginatedPromotions.pagination.totalPages,
      };
    } catch (error) {
      this.logger.error("PromotionsPresenter: Error getting view model", error);
      throw error;
    }
  }

  // Private methods for data preparation
  private mapPromotionData(promotion: any): PromotionData {
    return {
      id: promotion.id,
      name: promotion.name,
      description: promotion.description,
      type: promotion.type,
      status: promotion.status,
      value: promotion.value,
      minPurchaseAmount: promotion.minPurchaseAmount,
      maxDiscountAmount: promotion.maxDiscountAmount,
      usageLimit: promotion.usageLimit,
      startAt: promotion.startAt,
      endAt: promotion.endAt,
      conditions: promotion.conditions,
      shopId: promotion.shopId,
      createdBy: promotion.createdBy,
      createdAt: promotion.createdAt,
      updatedAt: promotion.updatedAt,
    };
  }

  private mapStatsData(stats: PromotionStatsDTO): PromotionStats {
    return {
      totalPromotions: stats.totalPromotions || 0,
      activePromotions: stats.activePromotions || 0,
      inactivePromotions: stats.inactivePromotions || 0,
      expiredPromotions: stats.expiredPromotions || 0,
      scheduledPromotions: stats.scheduledPromotions || 0,
      totalUsage: stats.totalUsage || 0,
      totalDiscountGiven: stats.totalDiscountGiven || 0,
      averageDiscountAmount: stats.averageDiscountAmount || 0,
      mostUsedPromotionType: stats.mostUsedPromotionType,
    };
  }

  // Metadata generation
  generateMetadata(shopId: string) {
    return {
      title: "จัดการโปรโมชั่น - เจ้าของร้าน | Shop Queue",
      description:
        "จัดการโปรโมชั่นและส่วนลด สร้างแคมเปญส่งเสริมการขายที่น่าสนใจ",
    };
  }
}

// Factory class
export class PromotionsPresenterFactory {
  static async create(): Promise<PromotionsPresenter> {
    const serverContainer = await getServerContainer();
    const promotionsService =
      serverContainer.resolve<IShopBackendPromotionsService>(
        "ShopBackendPromotionsService"
      );
    const logger = serverContainer.resolve<Logger>("Logger");
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService =
      serverContainer.resolve<IProfileService>("ProfileService");
    const shopService = serverContainer.resolve<IShopService>("ShopService");
    const subscriptionService = serverContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    return new PromotionsPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      promotionsService
    );
  }
}

export class ClientPromotionsPresenterFactory {
  static async create(): Promise<PromotionsPresenter> {
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const subscriptionService = clientContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    const authService = clientContainer.resolve<IAuthService>("AuthService");
    const profileService =
      clientContainer.resolve<IProfileService>("ProfileService");
    const shopService = clientContainer.resolve<IShopService>("ShopService");
    const promotionsService =
      clientContainer.resolve<IShopBackendPromotionsService>(
        "ShopBackendPromotionsService"
      );
    return new PromotionsPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      promotionsService
    );
  }
}
