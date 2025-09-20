import { ShopService } from "@/src/application/services/shop/ShopService";
import { ShopCustomerHistoryService } from "@/src/application/services/shop/customer/ShopCustomerHistoryService";
import { getServerContainer } from "@/src/di/server-container";
import { getClientContainer } from "@/src/di/client-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopPresenter } from "@/src/presentation/presenters/shop/BaseShopPresenter";
import { getPaginationConfig } from "@/src/infrastructure/config/PaginationConfig";
import type { HistoryFiltersDTO } from "@/src/application/dtos/shop/customer/customer-history-dto";

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
    private readonly customerHistoryService: ShopCustomerHistoryService
  ) {
    super(logger, shopService);
  }

  async getViewModel(
    shopId: string,
    currentPage: number = 1,
    perPage: number = getPaginationConfig().QUEUES_PER_PAGE,
    filters: HistoryFilters = {
      status: "all",
      dateRange: "all",
      shop: "all",
    }
  ): Promise<CustomerHistoryViewModel> {
    try {
      this.logger.info(
        "CustomerHistoryPresenter: Getting view model for shop",
        { shopId, currentPage, perPage, filters }
      );

      // Convert filters to DTO format
      const filtersDTO: HistoryFiltersDTO = {
        status: filters.status,
        dateRange: filters.dateRange,
        shop: filters.shop,
        startDate: filters.startDate,
        endDate: filters.endDate,
      };

      // Get customer history data from service
      const customerHistoryData = await this.customerHistoryService.getCustomerHistory(
        shopId,
        undefined, // customerId - will be determined from auth context
        currentPage,
        perPage,
        filtersDTO
      );

      // Convert DTOs to ViewModel format
      const queueHistory: CustomerQueueHistory[] = customerHistoryData.queueHistory.map(queue => ({
        id: queue.id,
        queueNumber: queue.queueNumber,
        shopName: queue.shopName,
        services: queue.services.map(service => ({
          id: service.id,
          name: service.name,
          price: service.price,
          quantity: service.quantity,
        })),
        totalAmount: queue.totalAmount,
        status: queue.status,
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

      const pagination: Pagination | undefined = customerHistoryData.pagination ? {
        currentPage: customerHistoryData.pagination.currentPage,
        perPage: customerHistoryData.pagination.perPage,
        totalItems: customerHistoryData.pagination.totalItems,
        totalPages: customerHistoryData.pagination.totalPages,
        hasNext: customerHistoryData.pagination.hasNext,
        hasPrev: customerHistoryData.pagination.hasPrev,
      } : undefined;

      return {
        queueHistory,
        customerStats,
        filters,
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


  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      "ประวัติการใช้บริการ - ลูกค้า",
      "ดูประวัติการจองคิวและการใช้บริการของคุณ"
    );
  }
}

// Factory class for server-side
export class CustomerHistoryPresenterFactory {
  static async create(): Promise<CustomerHistoryPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const shopService = serverContainer.resolve<ShopService>("ShopService");
    const customerHistoryService = serverContainer.resolve<ShopCustomerHistoryService>("ShopCustomerHistoryService");
    return new CustomerHistoryPresenter(logger, shopService, customerHistoryService);
  }
}

// Factory class for client-side
export class ClientCustomerHistoryPresenterFactory {
  static async create(): Promise<CustomerHistoryPresenter> {
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const shopService = clientContainer.resolve<ShopService>("ShopService");
    const customerHistoryService = clientContainer.resolve<ShopCustomerHistoryService>("ShopCustomerHistoryService");
    return new CustomerHistoryPresenter(logger, shopService, customerHistoryService);
  }
}
