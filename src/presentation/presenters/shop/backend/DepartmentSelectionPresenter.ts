import type { DepartmentDTO } from "@/src/application/dtos/shop/backend/department-dto";
import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { IShopBackendDepartmentsService } from "@/src/application/services/shop/backend/BackendDepartmentsService";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopBackendPresenter } from "./BaseShopBackendPresenter";

// Define ViewModel interface for department selection
export interface DepartmentSelectionViewModel {
  departments: DepartmentDTO[];
  totalCount: number;
  currentPage: number;
  perPage: number;
}

// Main Presenter class for department selection
export class DepartmentSelectionPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly departmentsService: IShopBackendDepartmentsService
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
    perPage: number = 100,
    filters?: {
      searchQuery?: string;
      shopFilter?: string;
      minEmployeeCount?: number;
      maxEmployeeCount?: number;
    }
  ): Promise<DepartmentSelectionViewModel> {
    try {
      // Get departments data with filters
      const departmentsData = await this.departmentsService.getDepartmentsData(
        page,
        perPage,
        filters
      );

      const totalCount = departmentsData.totalCount;
      const currentPage = page;

      return {
        departments: departmentsData.departments,
        totalCount,
        currentPage,
        perPage,
      };
    } catch (error) {
      this.logger.error(
        "DepartmentSelectionPresenter: Error getting view model",
        error
      );
      throw error;
    }
  }

  async createDepartment(departmentData: {
    shopId: string;
    name: string;
    slug: string;
    description?: string;
  }): Promise<DepartmentDTO> {
    try {
      this.logger.info("DepartmentSelectionPresenter: Creating department", {
        name: departmentData.name,
      });

      const department = await this.departmentsService.createDepartment({
        shopId: departmentData.shopId,
        name: departmentData.name,
        slug: departmentData.slug,
        description: departmentData.description,
      });

      return department;
    } catch (error) {
      this.logger.error(
        "DepartmentSelectionPresenter: Error creating department",
        error
      );
      throw error;
    }
  }
}

// Factory class
export class DepartmentSelectionPresenterFactory {
  static async create(): Promise<DepartmentSelectionPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const departmentsService =
      serverContainer.resolve<IShopBackendDepartmentsService>(
        "ShopBackendDepartmentsService"
      );
    const shopService = serverContainer.resolve<IShopService>("ShopService");
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService =
      serverContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService = serverContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    return new DepartmentSelectionPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      departmentsService
    );
  }
}

// Client-side Factory class
export class ClientDepartmentSelectionPresenterFactory {
  static async create(): Promise<DepartmentSelectionPresenter> {
    const { getClientContainer } = await import("@/src/di/client-container");
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const departmentsService =
      clientContainer.resolve<IShopBackendDepartmentsService>(
        "ShopBackendDepartmentsService"
      );
    const shopService = clientContainer.resolve<IShopService>("ShopService");
    const authService = clientContainer.resolve<IAuthService>("AuthService");
    const profileService =
      clientContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService = clientContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    return new DepartmentSelectionPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      departmentsService
    );
  }
}
