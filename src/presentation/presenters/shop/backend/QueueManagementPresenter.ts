import { QueueDTO } from "@/src/application/dtos/backend/queues-dto";
import {
  SubscriptionLimits,
  UsageStatsDto,
} from "@/src/application/dtos/subscription-dto";
import { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { IShopBackendQueuesService } from "@/src/application/services/shop/backend/BackendQueuesService";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getClientContainer } from "@/src/di/client-container";
import { Container } from "@/src/di/container";
import { getServerContainer } from "@/src/di/server-container";
import { QueueStatus } from "@/src/domain/entities/shop/backend/backend-queue.entity";
import type { Logger } from "@/src/domain/interfaces/logger";
import { getPaginationConfig } from "@/src/infrastructure/config/PaginationConfig";
import { ShopInfo } from "../BaseShopPresenter";
import { BaseShopBackendPresenter } from "./BaseShopBackendPresenter";

// Define interfaces for data structures
export interface QueueItem extends QueueDTO {
  serviceNames: string[];
}

export interface QueueFilter {
  status: string;
  priority: string;
  search: string;
}

// Define ViewModel interface
export interface QueueManagementViewModel {
  shop: ShopInfo;
  // ข้อมูลคิวพร้อม pagination
  queues: {
    data: QueueItem[]; // ข้อมูลคิว (เฉพาะหน้าปัจจุบัน)
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
  waitingCount: number;
  servingCount: number;
  completedToday: number;
  averageWaitTime: number;
  filters: QueueFilter;
  subscription: {
    limits: SubscriptionLimits;
    usage: UsageStatsDto;
    canCreateQueue: boolean;
    dailyLimitReached: boolean;
  };
}

// Main Presenter class
export class QueueManagementPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly backendQueuesService: IShopBackendQueuesService
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
    perPage: number = getPaginationConfig().QUEUES_PER_PAGE,
    filters?: {
      status?: string;
      priority?: string;
      search?: string;
    }
  ): Promise<QueueManagementViewModel> {
    try {
      this.logger.info("QueueManagementPresenter: Getting view model", {
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

      const shop = await this.getShopInfo(shopId);
      if (!shop) {
        throw new Error("Shop not found");
      }

      const subscriptionPlan = await this.getSubscriptionPlan(
        profile.id,
        profile.role
      );
      const limits = this.mapSubscriptionPlanToLimits(subscriptionPlan);
      const usage = await this.getUsageStats(profile.id);

      // Get queues data with pagination and filters from service
      // Transform filters to match the expected format
      const transformedFilters = filters
        ? {
            searchQuery: filters.search,
            statusFilter: filters.status !== "all" ? filters.status : undefined,
            priorityFilter:
              filters.priority !== "all" ? filters.priority : undefined,
            shopId: shopId,
          }
        : undefined;

      const queuesData = await this.backendQueuesService.getQueuesData(
        shopId,
        page,
        perPage,
        transformedFilters
      );

      const {
        queues: queueDTOs,
        stats,
        totalCount,
        currentPage,
        perPage: responsePerPage,
      } = queuesData;

      // Map QueueDTO to QueueItem
      const queues: QueueItem[] = queueDTOs.map((queue) => ({
        ...queue,
        serviceNames: queue.queueServices.map((qs) => qs.serviceName),
      }));

      const totalPages = Math.ceil(totalCount / responsePerPage);

      const dailyLimitReached =
        limits.maxQueuesPerDay !== null &&
        usage.todayQueues >= limits.maxQueuesPerDay;
      const canCreateQueue = !dailyLimitReached;

      return {
        shop,
        queues: {
          data: queues,
          pagination: {
            currentPage,
            totalPages,
            perPage: responsePerPage,
            totalCount,
            hasNext: currentPage < totalPages,
            hasPrev: currentPage > 1,
          },
        },
        waitingCount: stats.allWaitingQueue,
        servingCount: stats.allInProgressQueue,
        completedToday: stats.totalCompletedToday,
        averageWaitTime: stats.avgWaitTimeMinutes,
        filters: {
          status: filters?.status || "all",
          priority: filters?.priority || "all",
          search: filters?.search || "",
        },
        subscription: {
          limits,
          usage,
          canCreateQueue,
          dailyLimitReached,
        },
      };
    } catch (error) {
      this.logger.error(
        "QueueManagementPresenter: Error getting view model",
        error
      );
      throw error;
    }
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      "จัดการคิว",
      "ระบบจัดการคิวลูกค้าและติดตามสถานะการให้บริการ"
    );
  }

  // CRUD Methods
  async updateQueueStatus(
    shopId: string,
    queueId: string,
    status: QueueStatus
  ) {
    try {
      this.logger.info("QueueManagementPresenter: Updating queue status", {
        shopId,
        queueId,
        status,
      });

      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error("Profile not found");
      }

      const result = await this.backendQueuesService.updateQueueStatus({
        queueId,
        status,
        shopId,
      });

      this.logger.info(
        "QueueManagementPresenter: Queue status updated successfully",
        {
          shopId,
          queueId,
          status,
          result,
        }
      );

      return result;
    } catch (error) {
      this.logger.error(
        "QueueManagementPresenter: Error updating queue status",
        error
      );
      throw error;
    }
  }

  async updateQueue(
    shopId: string,
    queueId: string,
    data: {
      services: string[];
      priority: "normal" | "high" | "vip";
      notes?: string;
    }
  ) {
    try {
      this.logger.info("QueueManagementPresenter: Updating queue", {
        shopId,
        queueId,
        data,
      });

      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error("Profile not found");
      }

      // Map UI priority to backend priority
      const backendPriority =
        data.priority === "vip" ? "urgent" : data.priority;

      const result = await this.backendQueuesService.updateQueue(queueId, {
        priority: backendPriority,
        notes: data.notes,
        // Note: services update requires queueServices array with serviceId, quantity, price
        // This will be handled in the actual implementation
      });

      this.logger.info("QueueManagementPresenter: Queue updated successfully", {
        shopId,
        queueId,
        data,
        result,
      });

      return result;
    } catch (error) {
      this.logger.error(
        "QueueManagementPresenter: Error updating queue",
        error
      );
      throw error;
    }
  }

  async deleteQueue(shopId: string, queueId: string) {
    try {
      this.logger.info("QueueManagementPresenter: Deleting queue", {
        shopId,
        queueId,
      });

      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error("Profile not found");
      }

      const result = await this.backendQueuesService.deleteQueue(queueId);

      this.logger.info("QueueManagementPresenter: Queue deleted successfully", {
        shopId,
        queueId,
        result,
      });

      return result;
    } catch (error) {
      this.logger.error(
        "QueueManagementPresenter: Error deleting queue",
        error
      );
      throw error;
    }
  }

  async createQueue(
    shopId: string,
    data: {
      customerName: string;
      customerPhone: string;
      services: string[];
      priority: "normal" | "high" | "vip";
      notes?: string;
    }
  ) {
    try {
      this.logger.info("QueueManagementPresenter: Creating queue", {
        shopId,
        data,
      });

      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error("Profile not found");
      }

      // Map UI priority to backend priority
      const backendPriority =
        data.priority === "vip" ? "urgent" : data.priority;

      // For now, we'll create a simple queue without customer lookup
      // In a real implementation, we would:
      // 1. Check if customer exists by phone
      // 2. If not exists, create customer first
      // 3. Use customerId for queue creation

      // Generate a simple queue number (in real implementation, this would be handled by backend)
      const queueNumber = Math.floor(Math.random() * 1000) + 1;

      // Create queue with minimal required data
      // Note: This is a simplified version for now
      const result = await this.backendQueuesService.createQueue({
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        shopId,
        queueNumber,
        status: "waiting",
        priority: backendPriority,
        estimatedWaitTime: 15, // Default 15 minutes
        notes: data.notes,
        queueServices: data.services.map((serviceId) => ({
          serviceId,
          quantity: 1,
        })),
      });

      this.logger.info("QueueManagementPresenter: Queue created successfully", {
        shopId,
        data,
        result,
      });

      return result;
    } catch (error) {
      this.logger.error(
        "QueueManagementPresenter: Error creating queue",
        error
      );
      throw error;
    }
  }
}

// Base Factory class for reducing code duplication
abstract class BaseQueueManagementPresenterFactory {
  protected static async createPresenter(
    getContainer: () => Promise<Container> | Container
  ): Promise<QueueManagementPresenter> {
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
      const backendQueuesService = container.resolve<IShopBackendQueuesService>(
        "ShopBackendQueuesService"
      );

      return new QueueManagementPresenter(
        logger,
        shopService,
        authService,
        profileService,
        subscriptionService,
        backendQueuesService
      );
    } catch (error) {
      throw new Error(
        `Failed to create QueueManagementPresenter: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

// Factory class for server-side
export class QueueManagementPresenterFactory extends BaseQueueManagementPresenterFactory {
  static async create(): Promise<QueueManagementPresenter> {
    return this.createPresenter(() => getServerContainer());
  }
}

// Factory class for client-side
export class ClientQueueManagementPresenterFactory extends BaseQueueManagementPresenterFactory {
  static async create(): Promise<QueueManagementPresenter> {
    return this.createPresenter(() => getClientContainer());
  }
}
