import type { EmployeeDTO, CreateEmployeeParams, UpdateEmployeeParams } from "@/src/application/dtos/shop/backend/employees-dto";
import {
  SubscriptionLimits,
  UsageStatsDto,
} from "@/src/application/dtos/subscription-dto";
import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import type { ShopBackendEmployeesService } from "@/src/application/services/shop/backend/BackendEmployeesService";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopBackendPresenter } from "./BaseShopBackendPresenter";


// Define filter interface
export interface EmployeeFilters {
  searchQuery?: string;
  departmentFilter?: string;
  positionFilter?: string;
  statusFilter?: string;
  dateFrom?: string;
  dateTo?: string;
  minSalary?: number;
  maxSalary?: number;
}

// Define interfaces for backward compatibility with View
export interface Employee {
  id: string;
  employeeCode: string;
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

// Define ViewModel interface
export interface EmployeesViewModel {
  employees: Employee[];
  departments: Department[];
  permissions: Permission[];
  filters: {
    status: "all" | "active" | "inactive" | "on_leave" | "suspended";
    department: string;
    position: string;
    search: string;
  };
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  totalSalaryExpense: number;
  loggedInToday: number;
  newEmployeesThisMonth: number;
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
    subscriptionService: ISubscriptionService,
    private readonly employeesBackendService: ShopBackendEmployeesService
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
    filters?: EmployeeFilters
  ): Promise<EmployeesViewModel> {
    try {
      this.logger.info("EmployeesPresenter: Getting view model", {
        shopId,
        page,
        perPage,
        filters,
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

      // Get employees data with pagination and filters
      const employeesData = await this.employeesBackendService.getEmployeesData(
        shopId,
        page,
        perPage,
        {
          searchQuery: filters?.searchQuery,
          departmentFilter: filters?.departmentFilter,
          positionFilter: filters?.positionFilter,
          statusFilter: filters?.statusFilter,
          dateFrom: filters?.dateFrom,
          dateTo: filters?.dateTo,
          minSalary: filters?.minSalary,
          maxSalary: filters?.maxSalary,
        }
      );

      // Extract data from response
      const { employees, stats } = employeesData;

      // Pagination info (commented out for now as not used in ViewModel)
      // const totalPages = Math.ceil(totalCount / responsePerPage);
      // const hasNext = page < Math.ceil(stats.totalEmployees / perPage);
      // const hasPrev = page > 1;

      const staffLimitReached =
        limits.maxStaff !== null && usage.currentStaff >= limits.maxStaff;
      const canAddEmployee = !staffLimitReached;

      // Transform EmployeeDTO to Employee interface for View compatibility
      const transformedEmployees: Employee[] = employees.map(emp => ({
        id: emp.id,
        employeeCode: emp.employeeCode,
        name: emp.name,
        email: emp.email || '',
        phone: emp.phone || '',
        position: emp.position,
        department: emp.departmentName || 'ไม่ระบุแผนก',
        status: this.mapEmployeeStatus(emp.status),
        hireDate: emp.hireDate,
        salary: emp.salary || 0,
        permissions: emp.permissions?.map(p => p.toString()) || [],
        avatar: '👤', // Default avatar
        lastLogin: emp.lastLogin,
        todayStats: emp.todayStats,
      }));

      // Create departments from unique department names
      const departments: Department[] = Array.from(
        new Set(employees.map(emp => emp.departmentName).filter(Boolean))
      ).map((deptName, index) => ({
        id: `dept-${index}`,
        name: deptName!,
        description: `แผนก${deptName}`,
        employeeCount: employees.filter(emp => emp.departmentName === deptName).length,
      }));

      // Default permissions
      const permissions: Permission[] = [
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

      return {
        employees: transformedEmployees,
        departments,
        permissions,
        filters: {
          status: "all",
          department: "all",
          position: "all",
          search: "",
        },
        totalEmployees: stats.totalEmployees,
        activeEmployees: stats.activeEmployees,
        onLeaveEmployees: transformedEmployees.filter(e => e.status === "on_leave").length,
        totalSalaryExpense: transformedEmployees.reduce((sum, e) => sum + e.salary, 0),
        loggedInToday: stats.loggedInToday,
        newEmployeesThisMonth: stats.newEmployeesThisMonth,
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

  // Helper method to map EmployeeStatus enum to string
  private mapEmployeeStatus(status: string | number): "active" | "inactive" | "on_leave" | "suspended" {
    switch (status) {
      case "ACTIVE":
      case "active":
        return "active";
      case "INACTIVE":
      case "inactive":
        return "inactive";
      case "SUSPENDED":
      case "suspended":
        return "suspended";
      default:
        return "inactive";
    }
  }

  async getEmployeeById(id: string): Promise<EmployeeDTO> {
    try {
      this.logger.info("EmployeesPresenter: Getting employee by ID", { id });
      return await this.employeesBackendService.getEmployeeById(id);
    } catch (error) {
      this.logger.error(
        "EmployeesPresenter: Error getting employee by ID",
        error
      );
      throw error;
    }
  }

  async createEmployee(
    shopId: string,
    data: CreateEmployeeParams
  ): Promise<EmployeeDTO> {
    try {
      this.logger.info("EmployeesPresenter: Creating employee", {
        shopId,
        data,
      });
      const employeeData = {
        ...data,
        shopId,
      };
      return await this.employeesBackendService.createEmployee(employeeData);
    } catch (error) {
      this.logger.error("EmployeesPresenter: Error creating employee", error);
      throw error;
    }
  }

  async updateEmployee(
    id: string,
    data: Omit<UpdateEmployeeParams, "id">
  ): Promise<EmployeeDTO> {
    try {
      this.logger.info("EmployeesPresenter: Updating employee", { id, data });
      const updateData = { ...data, id };
      return await this.employeesBackendService.updateEmployee(id, updateData);
    } catch (error) {
      this.logger.error("EmployeesPresenter: Error updating employee", error);
      throw error;
    }
  }

  async deleteEmployee(id: string): Promise<boolean> {
    try {
      this.logger.info("EmployeesPresenter: Deleting employee", { id });
      return await this.employeesBackendService.deleteEmployee(id);
    } catch (error) {
      this.logger.error("EmployeesPresenter: Error deleting employee", error);
      throw error;
    }
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
    const employeesBackendService =
      serverContainer.resolve<ShopBackendEmployeesService>(
        "ShopBackendEmployeesService"
      );
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
      subscriptionService,
      employeesBackendService
    );
  }
}

// Client-side factory for use in React hooks
export class ClientEmployeesPresenterFactory {
  static async create(): Promise<EmployeesPresenter> {
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const employeesBackendService =
      clientContainer.resolve<ShopBackendEmployeesService>(
        "ShopBackendEmployeesService"
      );
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
      subscriptionService,
      employeesBackendService
    );
  }
}
