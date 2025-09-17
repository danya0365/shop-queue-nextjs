import {
  SubscriptionLimits,
  UsageStatsDto,
} from "@/src/application/dtos/subscription-dto";
import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopBackendPresenter } from "./BaseShopBackendPresenter";

// Define interfaces for data structures
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: "active" | "inactive" | "on_leave" | "suspended";
  hireDate: string;
  salary: number;
  permissions: string[];
  avatar?: string;
  lastLogin?: string;
  todayStats: {
    queuesServed: number;
    revenue: number;
    averageServiceTime: number;
    rating: number;
  };
}

export interface Department {
  id: string;
  name: string;
  description: string;
  employeeCount: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface EmployeeFilters {
  status: "all" | "active" | "inactive" | "on_leave" | "suspended";
  department: string;
  position: string;
  search: string;
}

// Define ViewModel interface
export interface EmployeesViewModel {
  employees: Employee[];
  departments: Department[];
  permissions: Permission[];
  filters: EmployeeFilters;
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  totalSalaryExpense: number;
  subscription: {
    limits: SubscriptionLimits;
    usage: UsageStatsDto;
    canAddEmployee: boolean;
    staffLimitReached: boolean;
  };
}

// Main Presenter class
export class EmployeesPresenter extends BaseShopBackendPresenter {
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

  async getViewModel(shopId: string): Promise<EmployeesViewModel> {
    try {
      this.logger.info("EmployeesPresenter: Getting view model for shop", {
        shopId,
      });

      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error("Profile not found");
      }

      const subscriptionPlan = await this.getSubscriptionPlan(
        profile.id,
        profile.role
      );
      const limits = this.mapSubscriptionPlanToLimits(subscriptionPlan);
      const usage = await this.getUsageStats(profile.id);

      // Mock data - replace with actual service calls
      const employees = this.getEmployees();
      const departments = this.getDepartments();
      const permissions = this.getPermissions();

      const staffLimitReached =
        limits.maxStaff !== null && usage.currentStaff >= limits.maxStaff;
      const canAddEmployee = !staffLimitReached;

      return {
        employees,
        departments,
        permissions,
        filters: {
          status: "all",
          department: "all",
          position: "all",
          search: "",
        },
        totalEmployees: employees.length,
        activeEmployees: employees.filter((e) => e.status === "active").length,
        onLeaveEmployees: employees.filter((e) => e.status === "on_leave")
          .length,
        totalSalaryExpense: employees.reduce((sum, e) => sum + e.salary, 0),
        subscription: {
          limits,
          usage,
          canAddEmployee,
          staffLimitReached,
        },
      };
    } catch (error) {
      this.logger.error("EmployeesPresenter: Error getting view model", error);
      throw error;
    }
  }

  // Private methods for data preparation
  private getEmployees(): Employee[] {
    return [
      {
        id: "1",
        name: "สมชาย ใจดี",
        email: "somchai@example.com",
        phone: "081-234-5678",
        position: "พนักงานบริการ",
        department: "บริการลูกค้า",
        status: "active",
        hireDate: "2023-01-15",
        salary: 18000,
        permissions: ["serve_customers", "process_payments", "view_queue"],
        avatar: "👨‍💼",
        lastLogin: "2024-01-15 09:30",
        todayStats: {
          queuesServed: 12,
          revenue: 2450,
          averageServiceTime: 8,
          rating: 4.8,
        },
      },
      {
        id: "2",
        name: "สมหญิง รักงาน",
        email: "somying@example.com",
        phone: "082-345-6789",
        position: "หัวหน้าแผนก",
        department: "บริการลูกค้า",
        status: "active",
        hireDate: "2022-06-01",
        salary: 25000,
        permissions: [
          "serve_customers",
          "process_payments",
          "view_queue",
          "manage_employees",
          "view_reports",
        ],
        avatar: "👩‍💼",
        lastLogin: "2024-01-15 08:45",
        todayStats: {
          queuesServed: 8,
          revenue: 1890,
          averageServiceTime: 12,
          rating: 4.9,
        },
      },
      {
        id: "3",
        name: "สมปอง มีความสุข",
        email: "sompong@example.com",
        phone: "083-456-7890",
        position: "พนักงานบริการ",
        department: "บริการลูกค้า",
        status: "on_leave",
        hireDate: "2023-03-20",
        salary: 18000,
        permissions: ["serve_customers", "process_payments", "view_queue"],
        avatar: "👨‍🍳",
        lastLogin: "2024-01-12 17:30",
        todayStats: {
          queuesServed: 0,
          revenue: 0,
          averageServiceTime: 0,
          rating: 0,
        },
      },
      {
        id: "4",
        name: "สมศรี ขยันทำงาน",
        email: "somsri@example.com",
        phone: "084-567-8901",
        position: "แคชเชียร์",
        department: "การเงิน",
        status: "active",
        hireDate: "2023-08-10",
        salary: 16000,
        permissions: ["process_payments", "view_queue", "manage_cash"],
        avatar: "👩‍💻",
        lastLogin: "2024-01-15 10:15",
        todayStats: {
          queuesServed: 15,
          revenue: 3200,
          averageServiceTime: 5,
          rating: 4.7,
        },
      },
    ];
  }

  private getDepartments(): Department[] {
    return [
      {
        id: "1",
        name: "บริการลูกค้า",
        description: "ให้บริการลูกค้าและจัดการคิว",
        employeeCount: 3,
      },
      {
        id: "2",
        name: "การเงิน",
        description: "จัดการการชำระเงินและบัญชี",
        employeeCount: 1,
      },
      {
        id: "3",
        name: "จัดการ",
        description: "บริหารจัดการและกำกับดูแล",
        employeeCount: 0,
      },
    ];
  }

  private getPermissions(): Permission[] {
    return [
      {
        id: "manage_queues",
        name: "จัดการคิว",
        description: "สามารถจัดการคิวลูกค้า",
        category: "คิว",
      },
      {
        id: "manage_employees",
        name: "จัดการพนักงาน",
        description: "สามารถจัดการพนักงาน",
        category: "พนักงาน",
      },
      {
        id: "manage_services",
        name: "จัดการบริการ",
        description: "สามารถจัดการบริการ",
        category: "บริการ",
      },
      {
        id: "manage_customers",
        name: "จัดการลูกค้า",
        description: "สามารถจัดการลูกค้า",
        category: "ลูกค้า",
      },
      {
        id: "manage_settings",
        name: "จัดการตั้งค่า",
        description: "สามารถจัดการตั้งค่า",
        category: "ตั้งค่า",
      },
    ];
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      "จัดการพนักงาน",
      "จัดการข้อมูลพนักงาน สิทธิ์การเข้าถึง และประสิทธิภาพการทำงาน"
    );
  }
}

// Factory class
export class EmployeesPresenterFactory {
  static async create(): Promise<EmployeesPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const shopService = serverContainer.resolve<IShopService>("ShopService");
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService =
      serverContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService = serverContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );

    return new EmployeesPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService
    );
  }
}

// Client-side factory for use in React hooks
export class ClientEmployeesPresenterFactory {
  static async create(): Promise<EmployeesPresenter> {
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const shopService = clientContainer.resolve<IShopService>("ShopService");
    const authService = clientContainer.resolve<IAuthService>("AuthService");
    const profileService =
      clientContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService = clientContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );

    return new EmployeesPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService
    );
  }
}
