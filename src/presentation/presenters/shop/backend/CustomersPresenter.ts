import type { CustomerDTO } from "@/src/application/dtos/shop/backend/customers-dto";
import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import type { ShopBackendCustomersService } from "@/src/application/services/shop/backend/BackendCustomersService";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import type { CreateCustomerUseCaseInput } from "@/src/application/usecases/shop/backend/customers/CreateCustomerUseCase";
import type { UpdateCustomerUseCaseInput } from "@/src/application/usecases/shop/backend/customers/UpdateCustomerUseCase";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopBackendPresenter } from "./BaseShopBackendPresenter";

// Define ViewModel interface
export interface CustomersViewModel {
  customers: {
    data: CustomerDTO[];
    pagination: {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  totalCustomers: number;
  registeredCustomers: number;
  guestCustomers: number;
  totalRevenue: number;
  averageSpent: number;
}

// Define filter interface
export interface CustomerFilters {
  searchQuery?: string;
  membershipTierFilter?: string;
  isActiveFilter?: boolean;
  minTotalPoints?: number;
  maxTotalPoints?: number;
  minTotalQueues?: number;
  maxTotalQueues?: number;
}

// Main Presenter class
export class CustomersPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly customersBackendService: ShopBackendCustomersService
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
    filters?: CustomerFilters
  ): Promise<CustomersViewModel> {
    try {
      this.logger.info("CustomersPresenter: Getting view model", {
        shopId,
        page,
        perPage,
        filters,
      });

      // Get customers data with pagination and filters
      const customersData = await this.customersBackendService.getCustomersData(
        shopId,
        page,
        perPage,
        filters?.searchQuery,
        undefined, // sortBy
        undefined, // sortOrder
        {
          searchQuery: filters?.searchQuery,
          membershipTierFilter: filters?.membershipTierFilter,
          isActiveFilter: filters?.isActiveFilter,
          minTotalPoints: filters?.minTotalPoints,
          maxTotalPoints: filters?.maxTotalPoints,
          minTotalQueues: filters?.minTotalQueues,
          maxTotalQueues: filters?.maxTotalQueues,
        }
      );

      // Extract data from response
      const {
        customers,
        stats,
        totalCount,
        currentPage,
        perPage: responsePerPage,
      } = customersData;

      // Calculate pagination info
      const totalPages = Math.ceil(totalCount / responsePerPage);
      const hasNext = currentPage < totalPages;
      const hasPrev = currentPage > 1;

      return {
        customers: {
          data: customers,
          pagination: {
            page: currentPage,
            perPage: responsePerPage,
            total: totalCount,
            totalPages,
            hasNext,
            hasPrev,
          },
        },
        totalCustomers: stats.totalCustomers,
        registeredCustomers: stats.totalRegisteredCustomers,
        guestCustomers: stats.regularMembers,
        totalRevenue: 0, // Will be calculated from customer data if needed
        averageSpent: 0, // Will be calculated from customer data if needed
      };
    } catch (error) {
      this.logger.error("CustomersPresenter: Error getting view model", error);
      throw error;
    }
  }

  async getCustomerById(id: string): Promise<CustomerDTO> {
    try {
      this.logger.info("CustomersPresenter: Getting customer by ID", { id });
      return await this.customersBackendService.getCustomerById(id);
    } catch (error) {
      this.logger.error(
        "CustomersPresenter: Error getting customer by ID",
        error
      );
      throw error;
    }
  }

  async createCustomer(
    shopId: string,
    data: CreateCustomerUseCaseInput
  ): Promise<CustomerDTO> {
    try {
      this.logger.info("CustomersPresenter: Creating customer", {
        shopId,
        data,
      });
      const customerData = {
        ...data,
        shopId,
      };
      return await this.customersBackendService.createCustomer(customerData);
    } catch (error) {
      this.logger.error("CustomersPresenter: Error creating customer", error);
      throw error;
    }
  }

  async updateCustomer(
    id: string,
    data: Omit<UpdateCustomerUseCaseInput, "id">
  ): Promise<CustomerDTO> {
    try {
      this.logger.info("CustomersPresenter: Updating customer", { id, data });
      return await this.customersBackendService.updateCustomer(id, data);
    } catch (error) {
      this.logger.error("CustomersPresenter: Error updating customer", error);
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      this.logger.info("CustomersPresenter: Deleting customer", { id });
      return await this.customersBackendService.deleteCustomer(id);
    } catch (error) {
      this.logger.error("CustomersPresenter: Error deleting customer", error);
      throw error;
    }
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      "จัดการลูกค้า",
      "จัดการข้อมูลลูกค้า ดูประวัติการใช้บริการ และจัดการโปรแกรมสมาชิก"
    );
  }
}

// Factory class
export class CustomersPresenterFactory {
  static async create(): Promise<CustomersPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const customersBackendService =
      serverContainer.resolve<ShopBackendCustomersService>(
        "ShopBackendCustomersService"
      );
    const shopService = serverContainer.resolve<IShopService>("ShopService");
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService =
      serverContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService = serverContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    return new CustomersPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      customersBackendService
    );
  }
}

// Client-side Factory class
export class ClientCustomersPresenterFactory {
  static async create(): Promise<CustomersPresenter> {
    const { getClientContainer } = await import("@/src/di/client-container");
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const customersBackendService =
      clientContainer.resolve<ShopBackendCustomersService>(
        "ShopBackendCustomersService"
      );
    const shopService = clientContainer.resolve<IShopService>("ShopService");
    const authService = clientContainer.resolve<IAuthService>("AuthService");
    const profileService =
      clientContainer.resolve<IProfileService>("ProfileService");
    const subscriptionService = clientContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    return new CustomersPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      customersBackendService
    );
  }
}
