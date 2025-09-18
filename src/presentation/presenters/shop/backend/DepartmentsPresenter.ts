import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopBackendPresenter } from "./BaseShopBackendPresenter";

export interface Department {
  id: string;
  shopId: string;
  name: string;
  description: string | null;
  employeeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define ViewModel interface
export interface DepartmentsViewModel {
  departments: Department[];
  totalDepartments: number;
  totalEmployees: number;
  averageEmployeesPerDepartment: number;
}

// Main Presenter class
export class DepartmentsPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService
  ) {
    super(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService
    );
  }

  async getViewModel(shopId: string): Promise<DepartmentsViewModel> {
    try {
      this.logger.info("DepartmentsPresenter: Getting view model", { shopId });

      // Get departments data
      const departments = await this.getDepartments(shopId);

      // Calculate statistics
      const totalDepartments = departments.length;
      const totalEmployees = departments.reduce(
        (sum, dept) => sum + dept.employeeCount,
        0
      );
      const averageEmployeesPerDepartment =
        totalDepartments > 0 ? totalEmployees / totalDepartments : 0;

      return {
        departments,
        totalDepartments,
        totalEmployees,
        averageEmployeesPerDepartment,
      };
    } catch (error) {
      this.logger.error(
        "DepartmentsPresenter: Error getting view model",
        error
      );
      throw error;
    }
  }

  async getDepartments(shopId: string): Promise<Department[]> {
    this.logger.info(
      "DepartmentsBackendService: Getting departments for shop",
      { shopId }
    );

    // Mock data - replace with actual repository call
    const mockDepartments: Department[] = [
      {
        id: "1",
        shopId,
        name: "แผนกตัดผม",
        description: "แผนกที่ให้บริการตัดผมทุกประเภท",
        employeeCount: 3,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "2",
        shopId,
        name: "แผนกย้อมสี",
        description: "แผนกที่เชี่ยวชาญด้านการย้อมสีผม",
        employeeCount: 2,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "3",
        shopId,
        name: "แผนกดัดผม",
        description: "แผนกที่ให้บริการดัดผมและจัดแต่งทรงผม",
        employeeCount: 2,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "4",
        shopId,
        name: "แผนกสระผม",
        description: "แผนกที่ให้บริการสระผมและนวดศีรษะ",
        employeeCount: 1,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "5",
        shopId,
        name: "แผนกบริหาร",
        description: "แผนกที่ดูแลการบริหารจัดการร้าน",
        employeeCount: 2,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    ];

    return mockDepartments;
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      "จัดการแผนก",
      "จัดการแผนกต่างๆ ในร้าน เพิ่ม แก้ไข และจัดสรรพนักงาน"
    );
  }
}

// Factory class
export class DepartmentsPresenterFactory {
  static async create(): Promise<DepartmentsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const shopService = serverContainer.resolve<IShopService>("ShopService");
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService =
      serverContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService = serverContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    return new DepartmentsPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService
    );
  }
}

// Client-side factory for use in React hooks
export class ClientDepartmentsPresenterFactory {
  static async create(): Promise<DepartmentsPresenter> {
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const shopService = clientContainer.resolve<IShopService>("ShopService");
    const authService = clientContainer.resolve<IAuthService>("AuthService");
    const profileService =
      clientContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService = clientContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );

    return new DepartmentsPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService
    );
  }
}
