import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { ShopBackendDepartmentsService } from "@/src/application/services/shop/backend/BackendDepartmentsService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopBackendPresenter } from "./BaseShopBackendPresenter";

// Define Department interface for backward compatibility with View
export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  employeeCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  status: "active" | "inactive";
  averageServiceTime?: number;
  totalQueues?: number;
  totalRevenue?: number;
}

// Define ViewModel interface
export interface DepartmentsViewModel {
  departments: Department[];
  totalDepartments: number;
  totalEmployees: number;
  averageEmployeesPerDepartment: number;
  activeDepartments: number;
  inactiveDepartments: number;
  filters: {
    search: string;
    status: "all" | "active" | "inactive";
    minEmployeeCount?: number;
    maxEmployeeCount?: number;
  };
  search: string;
  status: "all" | "active" | "inactive";
}

// Main Presenter class
export class DepartmentsPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly departmentsBackendService: ShopBackendDepartmentsService
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
      statusFilter?: "all" | "active" | "inactive";
      minEmployeeCount?: number;
      maxEmployeeCount?: number;
    }
  ): Promise<DepartmentsViewModel> {
    try {
      this.logger.info("DepartmentsPresenter: Getting view model", { shopId, page, perPage, filters });

      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error("Profile not found");
      }

      // Get departments data with pagination and filters
      const departmentsData = await this.departmentsBackendService.getDepartmentsData(
        page,
        perPage,
        {
          searchQuery: filters?.searchQuery,
          shopFilter: shopId,
          minEmployeeCount: filters?.minEmployeeCount,
          maxEmployeeCount: filters?.maxEmployeeCount,
        }
      );

      const departments = departmentsData.departments;
      const stats = departmentsData.stats;

      // Transform DepartmentDTO to Department interface for View compatibility
      const transformedDepartments: Department[] = departments.map(dept => ({
        id: dept.id,
        name: dept.name,
        slug: dept.slug,
        description: dept.description,
        employeeCount: dept.employeeCount,
        isActive: dept.isActive,
        createdAt: dept.createdAt,
        updatedAt: dept.updatedAt,
        status: dept.isActive ? "active" : "inactive",
        averageServiceTime: Math.floor(Math.random() * 30) + 10, // Mock data for now
        totalQueues: Math.floor(Math.random() * 100), // Mock data for now
        totalRevenue: Math.floor(Math.random() * 50000), // Mock data for now
      }));

      const activeDepartments = transformedDepartments.filter(d => d.status === "active").length;
      const inactiveDepartments = transformedDepartments.filter(d => d.status === "inactive").length;

      return {
        departments: transformedDepartments,
        totalDepartments: stats.totalDepartments,
        totalEmployees: stats.totalEmployees,
        averageEmployeesPerDepartment: stats.averageEmployeesPerDepartment,
        activeDepartments,
        inactiveDepartments,
        filters: {
          search: filters?.searchQuery || "",
          status: filters?.statusFilter || "all",
          minEmployeeCount: filters?.minEmployeeCount,
          maxEmployeeCount: filters?.maxEmployeeCount,
        },
        search: filters?.searchQuery || "",
        status: filters?.statusFilter || "all",
      };
    } catch (error) {
      this.logger.error(
        "DepartmentsPresenter: Error getting view model",
        error
      );
      throw error;
    }
  }

  async getDepartments(
    shopId: string,
    page: number = 1,
    perPage: number = 10,
    filters?: {
      searchQuery?: string;
      statusFilter?: "all" | "active" | "inactive";
      minEmployeeCount?: number;
      maxEmployeeCount?: number;
    }
  ): Promise<Department[]> {
    this.logger.info(
      "DepartmentsPresenter: Getting departments for shop",
      { shopId, page, perPage, filters }
    );

    try {
      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error("Profile not found");
      }

      const departmentsData = await this.departmentsBackendService.getDepartmentsData(
        page,
        perPage,
        {
          searchQuery: filters?.searchQuery,
          shopFilter: shopId,
          minEmployeeCount: filters?.minEmployeeCount,
          maxEmployeeCount: filters?.maxEmployeeCount,
        }
      );

      // Transform DepartmentDTO to Department interface for View compatibility
      const transformedDepartments: Department[] = departmentsData.departments.map(dept => ({
        id: dept.id,
        name: dept.name,
        slug: dept.slug,
        description: dept.description,
        employeeCount: dept.employeeCount,
        isActive: dept.isActive,
        createdAt: dept.createdAt,
        updatedAt: dept.updatedAt,
        status: dept.isActive ? "active" : "inactive",
        averageServiceTime: Math.floor(Math.random() * 30) + 10, // Mock data for now
        totalQueues: Math.floor(Math.random() * 100), // Mock data for now
        totalRevenue: Math.floor(Math.random() * 50000), // Mock data for now
      }));

      return transformedDepartments;
    } catch (error) {
      this.logger.error(
        "DepartmentsPresenter: Error getting departments",
        error
      );
      throw error;
    }
  }

  // CRUD operations
  async getDepartmentById(id: string): Promise<Department> {
    this.logger.info("DepartmentsPresenter: Getting department by ID", { id });
    try {
      const departmentDTO = await this.departmentsBackendService.getDepartmentById(id);
      
      // Transform DepartmentDTO to Department interface
      return {
        id: departmentDTO.id,
        name: departmentDTO.name,
        slug: departmentDTO.slug,
        description: departmentDTO.description,
        employeeCount: departmentDTO.employeeCount,
        isActive: departmentDTO.isActive,
        createdAt: departmentDTO.createdAt,
        updatedAt: departmentDTO.updatedAt,
        status: departmentDTO.isActive ? "active" : "inactive",
        averageServiceTime: Math.floor(Math.random() * 30) + 10,
        totalQueues: Math.floor(Math.random() * 100),
        totalRevenue: Math.floor(Math.random() * 50000),
      };
    } catch (error) {
      this.logger.error("DepartmentsPresenter: Error getting department by ID", error);
      throw error;
    }
  }

  async createDepartment(params: {
    shopId: string;
    name: string;
    slug: string;
    description?: string | null;
  }): Promise<Department> {
    this.logger.info("DepartmentsPresenter: Creating department", { params });
    try {
      const departmentDTO = await this.departmentsBackendService.createDepartment(params);
      
      // Transform DepartmentDTO to Department interface
      return {
        id: departmentDTO.id,
        name: departmentDTO.name,
        slug: departmentDTO.slug,
        description: departmentDTO.description,
        employeeCount: departmentDTO.employeeCount,
        isActive: departmentDTO.isActive,
        createdAt: departmentDTO.createdAt,
        updatedAt: departmentDTO.updatedAt,
        status: departmentDTO.isActive ? "active" : "inactive",
        averageServiceTime: Math.floor(Math.random() * 30) + 10,
        totalQueues: Math.floor(Math.random() * 100),
        totalRevenue: Math.floor(Math.random() * 50000),
      };
    } catch (error) {
      this.logger.error("DepartmentsPresenter: Error creating department", error);
      throw error;
    }
  }

  async updateDepartment(id: string, params: {
    name?: string;
    slug?: string;
    description?: string | null;
  }): Promise<Department> {
    this.logger.info("DepartmentsPresenter: Updating department", { id, params });
    try {
      const updateParams = {
        id,
        ...params
      };
      const departmentDTO = await this.departmentsBackendService.updateDepartment(id, updateParams);
      
      // Transform DepartmentDTO to Department interface
      return {
        id: departmentDTO.id,
        name: departmentDTO.name,
        slug: departmentDTO.slug,
        description: departmentDTO.description,
        employeeCount: departmentDTO.employeeCount,
        isActive: departmentDTO.isActive,
        createdAt: departmentDTO.createdAt,
        updatedAt: departmentDTO.updatedAt,
        status: departmentDTO.isActive ? "active" : "inactive",
        averageServiceTime: Math.floor(Math.random() * 30) + 10,
        totalQueues: Math.floor(Math.random() * 100),
        totalRevenue: Math.floor(Math.random() * 50000),
      };
    } catch (error) {
      this.logger.error("DepartmentsPresenter: Error updating department", error);
      throw error;
    }
  }

  async deleteDepartment(id: string): Promise<boolean> {
    this.logger.info("DepartmentsPresenter: Deleting department", { id });
    return await this.departmentsBackendService.deleteDepartment(id);
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
    const departmentsBackendService =
      serverContainer.resolve<ShopBackendDepartmentsService>(
        "ShopBackendDepartmentsService"
      );
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
      subscriptionService,
      departmentsBackendService
    );
  }
}

// Client-side factory for use in React hooks
export class ClientDepartmentsPresenterFactory {
  static async create(): Promise<DepartmentsPresenter> {
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const departmentsBackendService =
      clientContainer.resolve<ShopBackendDepartmentsService>(
        "ShopBackendDepartmentsService"
      );
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
      subscriptionService,
      departmentsBackendService
    );
  }
}
