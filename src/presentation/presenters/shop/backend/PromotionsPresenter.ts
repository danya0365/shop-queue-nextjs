import type {
  CreatePromotionParams,
  PromotionDTO,
  PromotionStatsDTO,
  UpdatePromotionParams,
} from "@/src/application/dtos/shop/backend/promotions-dto";
import {
  PromotionStatus,
  PromotionType,
} from "@/src/application/dtos/shop/backend/promotions-dto";
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
  type: PromotionDTO["type"];
  status: PromotionDTO["status"] | null;
  value: number;
  minPurchaseAmount: number | null;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  startAt: string;
  endAt: string;
  conditions: Record<string, string>[] | null;
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

  private toPromotionTypeEnum(type: PromotionDTO["type"]): PromotionType {
    switch (type) {
      case "percentage":
        return PromotionType.PERCENTAGE;
      case "fixed_amount":
        return PromotionType.FIXED_AMOUNT;
      case "buy_x_get_y":
        return PromotionType.BUY_X_GET_Y;
      case "free_item":
        return PromotionType.FREE_ITEM;
      default:
        return PromotionType.PERCENTAGE;
    }
  }

  private toPromotionStatusEnum(
    status: PromotionDTO["status"]
  ): PromotionStatus {
    switch (status) {
      case "active":
        return PromotionStatus.ACTIVE;
      case "inactive":
        return PromotionStatus.INACTIVE;
      case "expired":
        return PromotionStatus.EXPIRED;
      case "scheduled":
        return PromotionStatus.SCHEDULED;
      default:
        return PromotionStatus.INACTIVE;
    }
  }

  // CRUD methods (real, via service)
  async getPromotionById(
    shopId: string,
    promotionId: string
  ): Promise<PromotionData | null> {
    try {
      this.logger.info("PromotionsPresenter: Getting promotion by ID", {
        shopId,
        promotionId,
      });
      const dto = await this.promotionsService.getPromotionById(promotionId);
      return this.mapPromotionData(dto);
    } catch (error) {
      this.logger.error(
        "PromotionsPresenter: Error getting promotion by ID",
        error
      );
      throw error;
    }
  }

  async createPromotion(
    shopId: string,
    data: {
      name: string;
      description?: string;
      type: PromotionDTO["type"];
      value: number;
      minPurchaseAmount?: number;
      maxDiscountAmount?: number;
      usageLimit?: number;
      startAt: string;
      endAt: string;
      status?: PromotionDTO["status"];
      conditions?: Record<string, any>[];
    }
  ): Promise<PromotionData> {
    try {
      this.logger.info("PromotionsPresenter: Creating promotion", {
        shopId,
        data,
      });
      if (!data.name?.trim()) throw new Error("กรุณากรอกชื่อโปรโมชั่น");
      if (!data.type) throw new Error("กรุณาเลือกประเภทโปรโมชั่น");
      if (data.value <= 0) throw new Error("ค่าส่วนลดต้องมากกว่า 0");
      const startDate = new Date(data.startAt);
      const endDate = new Date(data.endAt);
      if (endDate <= startDate)
        throw new Error("วันที่สิ้นสุดต้องมากกว่าวันที่เริ่มต้น");
      if (data.type === "percentage" && data.value > 100)
        throw new Error("ส่วนลดเปอร์เซ็นต์ต้องไม่เกิน 100%");

      // resolve creator (authenticated)
      const user = await this.getUser();
      if (!user) throw new Error("User not authenticated");
      const profile = await this.getActiveProfile(user);
      if (!profile) throw new Error("Profile not found");

      const params: CreatePromotionParams = {
        shopId,
        name: data.name,
        description: data.description,
        type: this.toPromotionTypeEnum(data.type),
        value: data.value,
        minPurchaseAmount: data.minPurchaseAmount,
        maxDiscountAmount: data.maxDiscountAmount,
        startAt: data.startAt,
        endAt: data.endAt,
        usageLimit: data.usageLimit,
        status: data.status
          ? this.toPromotionStatusEnum(data.status)
          : undefined,
        conditions: data.conditions,
        createdBy: profile.id,
      };
      const dto = await this.promotionsService.createPromotion(params);
      return this.mapPromotionData(dto);
    } catch (error) {
      this.logger.error("PromotionsPresenter: Error creating promotion", error);
      throw error;
    }
  }

  async updatePromotion(
    shopId: string,
    promotionId: string,
    data: {
      name?: string;
      description?: string;
      type?: PromotionDTO["type"];
      status?: PromotionDTO["status"];
      value?: number;
      minPurchaseAmount?: number;
      maxDiscountAmount?: number;
      usageLimit?: number;
      startAt?: string;
      endAt?: string;
      conditions?: Record<string, any>[];
    }
  ): Promise<PromotionData> {
    try {
      this.logger.info("PromotionsPresenter: Updating promotion", {
        shopId,
        promotionId,
        data,
      });
      if (!promotionId) throw new Error("ไม่พบรหัสโปรโมชั่น");
      if (data.value !== undefined && data.value <= 0)
        throw new Error("ค่าส่วนลดต้องมากกว่า 0");
      if (data.startAt && data.endAt) {
        const startDate = new Date(data.startAt);
        const endDate = new Date(data.endAt);
        if (endDate <= startDate)
          throw new Error("วันที่สิ้นสุดต้องมากกว่าวันที่เริ่มต้น");
      }
      if (
        data.type === "percentage" &&
        data.value !== undefined &&
        data.value > 100
      )
        throw new Error("ส่วนลดเปอร์เซ็นต์ต้องไม่เกิน 100%\n");

      const params: UpdatePromotionParams = {
        id: promotionId,
        shopId,
        name: data.name,
        description: data.description,
        type: data.type ? this.toPromotionTypeEnum(data.type) : undefined,
        value: data.value,
        minPurchaseAmount: data.minPurchaseAmount,
        maxDiscountAmount: data.maxDiscountAmount,
        startAt: data.startAt,
        endAt: data.endAt,
        usageLimit: data.usageLimit,
        status: data.status
          ? this.toPromotionStatusEnum(data.status)
          : undefined,
        conditions: data.conditions,
      };
      const dto = await this.promotionsService.updatePromotion(
        promotionId,
        params
      );
      return this.mapPromotionData(dto);
    } catch (error) {
      this.logger.error("PromotionsPresenter: Error updating promotion", error);
      throw error;
    }
  }

  async deletePromotion(shopId: string, promotionId: string): Promise<boolean> {
    try {
      this.logger.info("PromotionsPresenter: Deleting promotion", {
        shopId,
        promotionId,
      });
      if (!promotionId) throw new Error("ไม่พบรหัสโปรโมชั่น");
      return await this.promotionsService.deletePromotion(promotionId);
    } catch (error) {
      this.logger.error("PromotionsPresenter: Error deleting promotion", error);
      throw error;
    }
  }

  async togglePromotionStatus(
    shopId: string,
    promotionId: string
  ): Promise<PromotionData> {
    try {
      this.logger.info("PromotionsPresenter: Toggling promotion status", {
        shopId,
        promotionId,
      });
      const current = await this.promotionsService.getPromotionById(
        promotionId
      );
      if (!current) throw new Error("ไม่พบโปรโมชั่น");
      const nextStatus: PromotionStatus =
        current.status === "active"
          ? PromotionStatus.INACTIVE
          : PromotionStatus.ACTIVE;
      const dto = await this.promotionsService.updatePromotion(promotionId, {
        id: promotionId,
        status: nextStatus,
      });
      return this.mapPromotionData(dto);
    } catch (error) {
      this.logger.error(
        "PromotionsPresenter: Error toggling promotion status",
        error
      );
      throw error;
    }
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
      const promotions: PromotionData[] = paginatedPromotions.data.map((p) =>
        this.mapPromotionData(p)
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
  private mapPromotionData(promotion: PromotionDTO): PromotionData {
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
  static create(): PromotionsPresenter {
    const clientContainer = getClientContainer();
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
