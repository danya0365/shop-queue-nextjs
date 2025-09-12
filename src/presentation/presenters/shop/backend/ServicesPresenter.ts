import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import type {
  Service,
  ServicesBackendService,
} from "@/src/application/services/shop/backend/services-backend-service";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopBackendPresenter } from "./BaseShopBackendPresenter";

// Define ViewModel interface
export interface ServicesViewModel {
  services: Service[];
  totalServices: number;
  activeServices: number;
  inactiveServices: number;
  categories: string[];
}

// Main Presenter class
export class ServicesPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly servicesBackendService: ServicesBackendService
  ) {
    super(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService
    );
  }

  async getViewModel(shopId: string): Promise<ServicesViewModel> {
    try {
      this.logger.info("ServicesPresenter: Getting view model", { shopId });

      // Get services data
      const services = await this.servicesBackendService.getServices(shopId);

      // Calculate statistics
      const totalServices = services.length;
      const activeServices = services.filter(
        (service) => service.isAvailable
      ).length;
      const inactiveServices = totalServices - activeServices;

      // Get unique categories
      const categories = [
        ...new Set(services.map((service) => service.category).filter(Boolean)),
      ] as string[];

      return {
        services,
        totalServices,
        activeServices,
        inactiveServices,
        categories,
      };
    } catch (error) {
      this.logger.error("ServicesPresenter: Error getting view model", error);
      throw error;
    }
  }

  // Metadata generation
  generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      "จัดการบริการ",
      "จัดการบริการของร้าน เพิ่ม แก้ไข ลบ และตั้งค่าบริการต่างๆ"
    );
  }
}

// Factory class
export class ServicesPresenterFactory {
  static async create(): Promise<ServicesPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const shopService = serverContainer.resolve<IShopService>("ShopService");
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService =
      serverContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService = serverContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    const servicesBackendService =
      serverContainer.resolve<ServicesBackendService>("ServicesBackendService");
    return new ServicesPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      servicesBackendService
    );
  }
}
