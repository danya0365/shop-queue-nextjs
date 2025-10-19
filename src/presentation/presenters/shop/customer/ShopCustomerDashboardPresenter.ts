import type { Metadata } from "next";

import type { VisitedShopDTO, VisitedShopsPaginationDTO } from "@/src/application/dtos/shop/customer/customer-visited-shops-dto";
import type { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import type { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import type { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import type { IShopCustomerVisitedShopsService } from "@/src/application/services/shop/customer/ShopCustomerVisitedShopsService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseSubscriptionPresenter } from "@/src/presentation/presenters/base/BaseSubscriptionPresenter";

export interface ShopCustomerVisitedShopItem {
  shopId: string;
  shopSlug: string;
  shopName: string;
  customerId: string;
  totalVisits: number;
  firstVisitedAt: string;
  lastVisitedAt: string;
}

export type ShopCustomerVisitedShopsPagination = VisitedShopsPaginationDTO;

export interface ShopCustomerDashboardHero {
  title: string;
  description: string;
}

export interface ShopCustomerDashboardStats {
  totalVisitedShops: number;
}

export interface ShopCustomerDashboardViewModel {
  profileId: string;
  profileName: string;
  hero: ShopCustomerDashboardHero;
  stats: ShopCustomerDashboardStats;
  visitedShops: ShopCustomerVisitedShopItem[];
  pagination: ShopCustomerVisitedShopsPagination;
  hasVisitedShops: boolean;
}

export class ShopCustomerDashboardPresenter extends BaseSubscriptionPresenter {
  constructor(
    logger: Logger,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly visitedShopsService: IShopCustomerVisitedShopsService
  ) {
    super(logger, authService, profileService, subscriptionService);
  }

  async getViewModel(page: number = 1, limit: number = 10): Promise<ShopCustomerDashboardViewModel> {
    const user = await this.getUser();
    if (!user) {
      throw new Error("ผู้ใช้ยังไม่ได้เข้าสู่ระบบ");
    }

    const profile = await this.getActiveProfile(user);
    if (!profile) {
      throw new Error("ไม่พบโปรไฟล์ของผู้ใช้");
    }

    const visitedShopsData = await this.visitedShopsService.getVisitedShopsByProfile({
      profileId: profile.id,
      page,
      limit,
    });

    const visitedShops = visitedShopsData.visitedShops.map((shop) => this.mapVisitedShop(shop));

    return {
      profileId: profile.id,
      profileName: profile.name || profile.username,
      hero: this.getHeroContent(profile.name || profile.username),
      stats: {
        totalVisitedShops: visitedShopsData.pagination.totalItems,
      },
      visitedShops,
      pagination: visitedShopsData.pagination,
      hasVisitedShops: visitedShops.length > 0,
    };
  }

  async generateMetadata(): Promise<Metadata> {
    try {
      const user = await this.getUser();
      if (!user) {
        return this.getDefaultMetadata();
      }

      const profile = await this.getActiveProfile(user);
      const profileName = profile?.name || profile?.username || "ลูกค้า";

      return {
        title: `ร้านที่ฉันเคยใช้บริการ | Shop Queue`,
        description: `ดูรายชื่อร้านค้าที่${profileName}เคยใช้บริการและจำนวนครั้งที่เข้าชม`,
      };
    } catch (error) {
      this.logger.error("ShopCustomerDashboardPresenter: generateMetadata failed", error);
      return this.getDefaultMetadata();
    }
  }

  private mapVisitedShop(dto: VisitedShopDTO): ShopCustomerVisitedShopItem {
    return {
      shopId: dto.shopId,
      shopSlug: dto.shopSlug,
      shopName: dto.shopName,
      customerId: dto.customerId,
      totalVisits: dto.totalVisits,
      firstVisitedAt: dto.firstVisitedAt,
      lastVisitedAt: dto.lastVisitedAt,
    };
  }

  private getHeroContent(profileName?: string | null): ShopCustomerDashboardHero {
    const name = profileName && profileName.trim().length > 0 ? profileName.trim() : "คุณ";
    return {
      title: `ร้านโปรดของ${name}`,
      description:
        "ย้อนดูร้านที่คุณเคยใช้บริการ จองคิวอีกครั้งได้ทันที หรือค้นหาร้านใหม่ ๆ ในตลาดร้านค้าของเรา",
    };
  }

  private getDefaultMetadata(): Metadata {
    return {
      title: "ร้านที่ฉันเคยใช้บริการ | Shop Queue",
      description: "ดูประวัติร้านค้าที่คุณเคยใช้บริการและจองคิวอีกครั้งได้อย่างง่ายดาย",
    };
  }
}

export class ShopCustomerDashboardPresenterFactory {
  static async create(): Promise<ShopCustomerDashboardPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService = serverContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService =
      serverContainer.resolve<ISubscriptionService>("SubscriptionService");
    const visitedShopsService =
      serverContainer.resolve<IShopCustomerVisitedShopsService>(
        "ShopCustomerVisitedShopsService"
      );

    return new ShopCustomerDashboardPresenter(
      logger,
      authService,
      profileService,
      subscriptionService,
      visitedShopsService
    );
  }
}

export class ClientShopCustomerDashboardPresenterFactory {
  static create(): ShopCustomerDashboardPresenter {
    const clientContainer = getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const authService = clientContainer.resolve<IAuthService>("AuthService");
    const profileService = clientContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService =
      clientContainer.resolve<ISubscriptionService>("SubscriptionService");
    const visitedShopsService =
      clientContainer.resolve<IShopCustomerVisitedShopsService>(
        "ShopCustomerVisitedShopsService"
      );

    return new ShopCustomerDashboardPresenter(
      logger,
      authService,
      profileService,
      subscriptionService,
      visitedShopsService
    );
  }
}
