import { ShopService } from "@/src/application/services/shop/ShopService";
import type { IShopCustomerQueueJoinService } from "@/src/application/services/shop/customer/ShopCustomerQueueJoinService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopPresenter } from "@/src/presentation/presenters/shop/BaseShopPresenter";
import { QueuePriority } from "@/src/domain/entities/shop/backend/backend-queue.entity";

// Define interfaces for data structures
export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedTime: number;
  category: string;
  available: boolean;
  icon: string;
}

export interface QueueService {
  id: string;
  name: string;
  price: number;
  quantity: number;
  estimatedTime: number;
}

export interface QueueFormData {
  customerName: string;
  customerPhone: string;
  services: QueueService[];
  specialRequests?: string;
  priority: QueuePriority;
}

// Define ViewModel interface
export interface CustomerQueueJoinViewModel {
  services: ServiceOption[];
  categories: string[];
  estimatedWaitTime: number;
  currentQueueLength: number;
  shopName: string;
  isAcceptingQueues: boolean;
  maxQueueLength: number;
  // State management properties
  selectedServices: string[];
  isSuccess: boolean;
  queueNumber: string | null;
  isLoading: boolean;
  error: string | null;
}

// Main Presenter class
export class CustomerQueueJoinPresenter extends BaseShopPresenter {
  constructor(
    logger: Logger, 
    shopService: ShopService,
    private readonly shopCustomerQueueJoinService: IShopCustomerQueueJoinService
  ) {
    super(logger, shopService);
  }

  async getViewModel(shopId: string): Promise<CustomerQueueJoinViewModel> {
    try {
      this.logger.info("QueueJoinPresenter: Getting view model for shop", {
        shopId,
      });

      // Get queue join data from service
      const queueJoinData = await this.shopCustomerQueueJoinService.getQueueJoinData(shopId);

      return {
        services: queueJoinData.services,
        categories: queueJoinData.categories,
        estimatedWaitTime: queueJoinData.shopQueueInfo.estimatedWaitTime,
        currentQueueLength: queueJoinData.shopQueueInfo.currentQueueLength,
        shopName: queueJoinData.shopQueueInfo.shopName,
        isAcceptingQueues: queueJoinData.shopQueueInfo.isAcceptingQueues,
        maxQueueLength: queueJoinData.shopQueueInfo.maxQueueLength,
        // State management properties with default values
        selectedServices: [],
        isSuccess: false,
        queueNumber: null,
        isLoading: false,
        error: null,
      };
    } catch (error) {
      this.logger.error("QueueJoinPresenter: Error getting view model", error);
      throw error;
    }
  }

  async joinQueue(formData: QueueFormData, shopId: string): Promise<{
    success: boolean;
    queueNumber?: string;
    message?: string;
    error?: string;
  }> {
    try {
      this.logger.info("QueueJoinPresenter: Joining queue", {
        shopId,
        customerName: formData.customerName,
        serviceCount: formData.services.length,
      });

      const joinQueueInput = {
        shopId,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        services: formData.services,
        specialRequests: formData.specialRequests,
        priority: formData.priority,
      };

      const result = await this.shopCustomerQueueJoinService.joinQueue(joinQueueInput);

      return {
        success: result.success,
        queueNumber: result.queueNumber,
        message: result.message,
        error: result.error,
      };
    } catch (error) {
      this.logger.error("QueueJoinPresenter: Error joining queue", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      "เข้าคิว",
      "เลือกบริการและเข้าคิวออนไลน์ เพื่อประหยัดเวลารอคอย"
    );
  }
}

// Factory class for server-side
export class CustomerQueueJoinPresenterFactory {
  static async create(): Promise<CustomerQueueJoinPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const shopService = serverContainer.resolve<ShopService>("ShopService");
    const shopCustomerQueueJoinService = serverContainer.resolve<IShopCustomerQueueJoinService>("ShopCustomerQueueJoinService");
    return new CustomerQueueJoinPresenter(logger, shopService, shopCustomerQueueJoinService);
  }
}

// Factory class for client-side
export class ClientCustomerQueueJoinPresenterFactory {
  static async create(): Promise<CustomerQueueJoinPresenter> {
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const shopService = clientContainer.resolve<ShopService>("ShopService");
    const shopCustomerQueueJoinService = clientContainer.resolve<IShopCustomerQueueJoinService>("ShopCustomerQueueJoinService");
    return new CustomerQueueJoinPresenter(logger, shopService, shopCustomerQueueJoinService);
  }
}
