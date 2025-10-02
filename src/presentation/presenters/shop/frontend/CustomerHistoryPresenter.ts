import type { HistoryFiltersDTO } from "@/src/application/dtos/shop/customer/customer-history-dto";
import { ShopService } from "@/src/application/services/shop/ShopService";
import { ShopCustomerHistoryService } from "@/src/application/services/shop/customer/ShopCustomerHistoryService";
import { ShopCustomerService } from "@/src/application/services/shop/customer/ShopCustomerService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import { QueueStatus } from "@/src/domain/entities/shop/backend/backend-queue.entity";
import type { Logger } from "@/src/domain/interfaces/logger";
import { getPaginationConfig } from "@/src/infrastructure/config/PaginationConfig";
import { BaseShopPresenter } from "@/src/presentation/presenters/shop/BaseShopPresenter";

// Define interfaces for data structures
export interface CustomerQueueHistory {
  id: string;
  queueNumber: string;
  shopName: string;
  services: HistoryService[];
  totalAmount: number;
  status: "completed" | "cancelled" | "no_show";
  queueDate: string;
  queueTime: string;
  completedAt?: string;
  waitTime?: number; // in minutes
  serviceTime?: number; // in minutes
  rating?: number;
  feedback?: string;
  employeeName?: string;
  paymentMethod?: "cash" | "card" | "qr" | "transfer";
}

export interface HistoryService {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CustomerStats {
  totalQueues: number;
  completedQueues: number;
  cancelledQueues: number;
  totalSpent: number;
  averageRating: number;
  favoriteService: string;
  memberSince: string;
}

export interface HistoryFilters {
  status: HistoryFilterType;
  dateRange: "all" | "month" | "quarter" | "year";
  shop: string;
  startDate?: string;
  endDate?: string;
}

// type filter
export type HistoryFilterType = "all" | "completed" | "cancelled" | "no_show";

// Pagination interface
export interface Pagination {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Define ViewModel interface
export interface CustomerHistoryViewModel {
  queueHistory: CustomerQueueHistory[];
  customerStats: CustomerStats;
  filters: HistoryFilters;
  customerName: string;
  pagination?: Pagination;
}

// Main Presenter class
export class CustomerHistoryPresenter extends BaseShopPresenter {
  constructor(
    logger: Logger,
    shopService: ShopService,
    private readonly customerHistoryService: ShopCustomerHistoryService,
    private readonly shopCustomerService: ShopCustomerService
  ) {
    super(logger, shopService);
  }

  async getViewModel(
    shopId: string,
    customerId?: string,
    currentPage: number = 1,
    perPage: number = getPaginationConfig().QUEUES_PER_PAGE,
    filters?: HistoryFilters
  ): Promise<CustomerHistoryViewModel> {
    if (!customerId) {
      return {
        queueHistory: [],
        customerStats: {
          totalQueues: 0,
          completedQueues: 0,
          cancelledQueues: 0,
          totalSpent: 0,
          averageRating: 0,
          favoriteService: "",
          memberSince: "",
        },
        filters: {
          status: "all",
          dateRange: "all",
          shop: "all",
        },
        customerName: "",
        pagination: undefined,
      };
    }
    try {
      // Convert filters to DTO format
      const filtersDTO: HistoryFiltersDTO = {
        status: filters?.status || "all",
        dateRange: filters?.dateRange || "all",
        shop: filters?.shop || "all",
        startDate: filters?.startDate,
        endDate: filters?.endDate,
      };

      // Get customer history data from service
      const customerHistoryData =
        await this.customerHistoryService.getCustomerHistory(
          shopId,
          customerId,
          currentPage,
          perPage,
          filtersDTO
        );

      // Convert DTOs to ViewModel format
      const queueHistory: CustomerQueueHistory[] =
        customerHistoryData.queueHistory.map((queue) => ({
          id: queue.id,
          queueNumber: queue.queueNumber,
          shopName: queue.shopName,
          services: queue.services.map((service) => ({
            id: service.id,
            name: service.name,
            price: service.price,
            quantity: service.quantity,
          })),
          totalAmount: queue.totalAmount,
          status: this.mapStatusToString(queue.status),
          queueDate: queue.queueDate,
          queueTime: queue.queueTime,
          completedAt: queue.completedAt,
          waitTime: queue.waitTime,
          serviceTime: queue.serviceTime,
          rating: queue.rating,
          feedback: queue.feedback,
          employeeName: queue.employeeName,
          paymentMethod: queue.paymentMethod,
        }));

      const customerStats: CustomerStats = {
        totalQueues: customerHistoryData.customerStats.totalQueues,
        completedQueues: customerHistoryData.customerStats.completedQueues,
        cancelledQueues: customerHistoryData.customerStats.cancelledQueues,
        totalSpent: customerHistoryData.customerStats.totalSpent,
        averageRating: customerHistoryData.customerStats.averageRating,
        favoriteService: customerHistoryData.customerStats.favoriteService,
        memberSince: customerHistoryData.customerStats.memberSince,
      };

      const pagination: Pagination | undefined = customerHistoryData.pagination
        ? {
            currentPage: customerHistoryData.pagination.currentPage,
            perPage: customerHistoryData.pagination.perPage,
            totalItems: customerHistoryData.pagination.totalItems,
            totalPages: customerHistoryData.pagination.totalPages,
            hasNext: customerHistoryData.pagination.hasNext,
            hasPrev: customerHistoryData.pagination.hasPrev,
          }
        : undefined;

      return {
        queueHistory,
        customerStats,
        filters: filtersDTO,
        customerName: customerHistoryData.customerName,
        pagination,
      };
    } catch (error) {
      this.logger.error(
        "CustomerHistoryPresenter: Error getting view model",
        error
      );
      throw error;
    }
  }

  // Customer-related methods
  async getCustomerByProfileId(profileId: string, shopId: string) {
    try {
      this.logger.info("Getting customer by profile ID", { profileId, shopId });
      const customer = await this.shopCustomerService.getCustomerByProfileId(
        profileId,
        shopId
      );
      return customer;
    } catch (error) {
      this.logger.error("Error getting customer by profile ID", {
        error,
        profileId,
        shopId,
      });
      throw error;
    }
  }

  async getCustomerById(customerId: string) {
    try {
      this.logger.info("Getting customer by ID", { customerId });
      const customer = await this.shopCustomerService.getCustomerById(
        customerId
      );
      return customer;
    } catch (error) {
      this.logger.error("Error getting customer by ID", { error, customerId });
      throw error;
    }
  }

  async registerCustomer(shopId: string, name: string, phone: string) {
    try {
      this.logger.info("Registering customer", { shopId, name, phone });
      const result = await this.shopCustomerService.registerCustomer(
        shopId,
        name,
        phone
      );
      return result;
    } catch (error) {
      this.logger.error("Error registering customer", {
        error,
        shopId,
        name,
        phone,
      });
      throw error;
    }
  }

  async linkCustomerToProfile(customerId: string, phone: string) {
    try {
      this.logger.info("Linking customer to profile", { customerId, phone });
      const result = await this.shopCustomerService.linkCustomerToProfile(
        customerId,
        phone
      );
      return result;
    } catch (error) {
      this.logger.error("Error linking customer to profile", {
        error,
        customerId,
        phone,
      });
      throw error;
    }
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      "ประวัติการใช้บริการ - ลูกค้า",
      "ดูประวัติการจองคิวและการใช้บริการของคุณ"
    );
  }

  /**
   * Map QueueStatus enum to string literals for customer history view
   */
  private mapStatusToString(
    status: QueueStatus
  ): "completed" | "cancelled" | "no_show" {
    switch (status) {
      case QueueStatus.COMPLETED:
        return "completed";
      case QueueStatus.CANCELLED:
        return "cancelled";
      case QueueStatus.WAITING:
      case QueueStatus.SERVING:
        // For customer history, waiting and serving are not shown as final states
        // They should be mapped to cancelled or completed based on business logic
        // For now, we'll map them to cancelled as they represent incomplete transactions
        return "cancelled";
      default:
        return "cancelled";
    }
  }
}

// Factory class for server-side
export class CustomerHistoryPresenterFactory {
  static async create(): Promise<CustomerHistoryPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const shopService = serverContainer.resolve<ShopService>("ShopService");
    const customerHistoryService =
      serverContainer.resolve<ShopCustomerHistoryService>(
        "ShopCustomerHistoryService"
      );
    const shopCustomerService = serverContainer.resolve<ShopCustomerService>(
      "ShopCustomerService"
    );
    return new CustomerHistoryPresenter(
      logger,
      shopService,
      customerHistoryService,
      shopCustomerService
    );
  }
}

// Factory class for client-side
export class ClientCustomerHistoryPresenterFactory {
  static create(): CustomerHistoryPresenter {
    const clientContainer = getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const shopService = clientContainer.resolve<ShopService>("ShopService");
    const customerHistoryService =
      clientContainer.resolve<ShopCustomerHistoryService>(
        "ShopCustomerHistoryService"
      );
    const shopCustomerService = clientContainer.resolve<ShopCustomerService>(
      "ShopCustomerService"
    );
    return new CustomerHistoryPresenter(
      logger,
      shopService,
      customerHistoryService,
      shopCustomerService
    );
  }
}
