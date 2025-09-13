import type { ServiceDTO } from "@/src/application/dtos/shop/backend/services-dto";
import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { IShopBackendServicesService } from "@/src/application/services/shop/backend/BackendServicesService";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getClientContainer } from "@/src/di/client-container";
import { Container } from "@/src/di/container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopBackendPresenter } from "./BaseShopBackendPresenter";

// Define ViewModel interface
export interface ServicesViewModel {
  // ข้อมูลบริการพร้อม pagination
  services: {
    data: ServiceDTO[]; // ข้อมูลบริการ (เฉพาะหน้าปัจจุบัน)
    pagination: {
      // ข้อมูล pagination
      currentPage: number; // หน้าปัจจุบัน
      totalPages: number; // จำนวนหน้าทั้งหมด
      perPage: number; // จำนวนรายการต่อหน้า
      totalCount: number; // จำนวนรายการทั้งหมด
      hasNext: boolean; // มีหน้าถัดไปหรือไม่
      hasPrev: boolean; // มีหน้าก่อนหน้าหรือไม่
    };
  };

  // ข้อมูลสถิติ (ยังคงเดิม)
  totalServices: number;
  activeServices: number;
  inactiveServices: number;
  categories: string[];
  averagePrice: number;
  totalRevenue: number;
  popularServices: {
    id: string;
    name: string;
    bookingCount: number;
  }[];
}

// Main Presenter class
export class ServicesPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly backendServicesService: IShopBackendServicesService
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
    perPage: number = 10,
    filters?: {
      searchQuery?: string;
      categoryFilter?: string;
      availabilityFilter?: string;
    }
  ): Promise<ServicesViewModel> {
    try {
      this.logger.info("ServicesPresenter: Getting view model", {
        shopId,
        page,
        perPage,
        filters,
      });

      // Get services data with pagination and filters
      const servicesData = await this.backendServicesService.getServicesData(
        page,
        perPage,
        {
          shopId,
          searchQuery: filters?.searchQuery,
          categoryFilter: filters?.categoryFilter,
          availabilityFilter: filters?.availabilityFilter,
        }
      );

      const {
        services,
        stats,
        totalCount,
        currentPage,
        perPage: responsePerPage,
      } = servicesData;

      // Get unique categories from services
      const categories = [
        ...new Set(services.map((service) => service.category).filter(Boolean)),
      ] as string[];

      const totalPages = Math.ceil(totalCount / responsePerPage);

      return {
        services: {
          data: services,
          pagination: {
            currentPage,
            totalPages,
            perPage: responsePerPage,
            totalCount,
            hasNext: currentPage < totalPages,
            hasPrev: currentPage > 1,
          },
        },
        totalServices: stats.totalServices,
        activeServices: stats.availableServices,
        inactiveServices: stats.unavailableServices,
        categories,
        averagePrice: stats.averagePrice,
        totalRevenue: stats.totalRevenue,
        popularServices: stats.popularServices,
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

  // Create service method
  async createService(shopId: string, data: {
    name: string;
    description: string | null;
    category: string;
    price: number;
    estimatedDuration: number | null;
    icon: string | null;
    isAvailable: boolean;
  }): Promise<void> {
    try {
      this.logger.info("ServicesPresenter: Creating service", {
        shopId,
        serviceName: data.name,
      });

      await this.backendServicesService.createService({
        shopId,
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        description: data.description || undefined,
        category: data.category,
        price: data.price,
        estimatedDuration: data.estimatedDuration || undefined,
        icon: data.icon || undefined,
        isAvailable: data.isAvailable,
      });

      this.logger.info("ServicesPresenter: Service created successfully", {
        shopId,
        serviceName: data.name,
      });
    } catch (error) {
      this.logger.error("ServicesPresenter: Error creating service", error);
      throw error;
    }
  }

  // Get service by ID method
  async getServiceById(id: string): Promise<ServiceDTO | null> {
    try {
      this.logger.info("ServicesPresenter: Getting service by ID", { id });

      const service = await this.backendServicesService.getServiceById(id);
      return service;
    } catch (error) {
      this.logger.error("ServicesPresenter: Error getting service by ID", error);
      throw error;
    }
  }

  // Update service method
  async updateService(id: string, data: {
    name: string;
    description: string | null;
    category: string;
    price: number;
    estimatedDuration: number | null;
    icon: string | null;
    isAvailable: boolean;
  }): Promise<void> {
    try {
      this.logger.info("ServicesPresenter: Updating service", {
        id,
        serviceName: data.name,
      });

      await this.backendServicesService.updateService(id, {
        updates: {
          name: data.name,
          slug: data.name.toLowerCase().replace(/\s+/g, '-'),
          description: data.description || undefined,
          category: data.category,
          price: data.price,
          estimatedDuration: data.estimatedDuration || undefined,
          icon: data.icon || undefined,
          isAvailable: data.isAvailable,
        }
      });

      this.logger.info("ServicesPresenter: Service updated successfully", {
        id,
        serviceName: data.name,
      });
    } catch (error) {
      this.logger.error("ServicesPresenter: Error updating service", error);
      throw error;
    }
  }

  // Delete service method
  async deleteService(id: string): Promise<void> {
    try {
      this.logger.info("ServicesPresenter: Deleting service", { id });

      await this.backendServicesService.deleteService(id);

      this.logger.info("ServicesPresenter: Service deleted successfully", {
        id,
      });
    } catch (error) {
      this.logger.error("ServicesPresenter: Error deleting service", error);
      throw error;
    }
  }
}

// Base Factory class for reducing code duplication
abstract class BaseServicesPresenterFactory {
  protected static async createPresenter(
    getContainer: () => Promise<Container> | Container
  ): Promise<ServicesPresenter> {
    try {
      const container = await getContainer();
      const logger = container.resolve<Logger>("Logger");
      const shopService = container.resolve<IShopService>("ShopService");
      const authService = container.resolve<IAuthService>("AuthService");
      const profileService =
        container.resolve<IProfileService>("ProfileService");
      const subscriptionService = container.resolve<ISubscriptionService>(
        "SubscriptionService"
      );
      const backendServicesService =
        container.resolve<IShopBackendServicesService>(
          "ShopBackendServicesService"
        );

      return new ServicesPresenter(
        logger,
        shopService,
        authService,
        profileService,
        subscriptionService,
        backendServicesService
      );
    } catch (error) {
      throw new Error(
        `Failed to create ServicesPresenter: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

// Factory class for server-side
export class ServicesPresenterFactory extends BaseServicesPresenterFactory {
  static async create(): Promise<ServicesPresenter> {
    return this.createPresenter(() => getServerContainer());
  }
}

// Factory class for client-side
export class ClientServicesPresenterFactory extends BaseServicesPresenterFactory {
  static async create(): Promise<ServicesPresenter> {
    return this.createPresenter(() => getClientContainer());
  }
}
