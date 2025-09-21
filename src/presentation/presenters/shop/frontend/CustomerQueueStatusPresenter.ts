import { ShopService } from "@/src/application/services/shop/ShopService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopPresenter } from "@/src/presentation/presenters/shop/BaseShopPresenter";
import type { ShopCustomerQueueStatusService } from "@/src/application/services/shop/customer/ShopCustomerQueueStatusService";
import type {
  CustomerQueueStatusDTO,
  QueueProgressDTO,
} from "@/src/application/dtos/shop/customer/customer-queue-status-dto";

// Define interfaces for data structures (maintaining backward compatibility)
export interface CustomerQueue {
  id: string;
  queueNumber: string;
  status: "waiting" | "confirmed" | "serving" | "completed" | "cancelled";
  customerName: string;
  customerPhone: string;
  services: string[];
  totalPrice: number;
  estimatedWaitTime: number;
  position: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueueProgress {
  currentNumber: string;
  totalAhead: number;
  averageServiceTime: number;
  estimatedCallTime: string;
}

// Define ViewModel interface
export interface CustomerQueueStatusViewModel {
  customerQueue: CustomerQueue | null;
  queueProgress: QueueProgress;
  shopName: string;
  isFound: boolean;
  canCancel: boolean;
}

// Main Presenter class
export class CustomerQueueStatusPresenter extends BaseShopPresenter {
  constructor(
    logger: Logger,
    shopService: ShopService,
    private readonly shopCustomerQueueStatusService: ShopCustomerQueueStatusService
  ) {
    super(logger, shopService);
  }

  async getViewModel(
    shopId: string,
    queueNumber?: string
  ): Promise<CustomerQueueStatusViewModel> {
    try {
      this.logger.info("QueueStatusPresenter: Getting view model for shop", {
        shopId,
        queueNumber,
      });

      // Get data from service
      const viewModelDTO = await this.shopCustomerQueueStatusService.getCustomerQueueStatusViewModel(
        shopId,
        queueNumber
      );

      // Convert DTO to ViewModel format
      const customerQueue = viewModelDTO.customerQueue
        ? this.mapCustomerQueueDTOToCustomerQueue(viewModelDTO.customerQueue)
        : null;
      
      const queueProgress = this.mapQueueProgressDTOToQueueProgress(viewModelDTO.queueProgress);

      return {
        customerQueue,
        queueProgress,
        shopName: viewModelDTO.shopName,
        isFound: viewModelDTO.isFound,
        canCancel: viewModelDTO.canCancel,
      };
    } catch (error) {
      this.logger.error(
        "QueueStatusPresenter: Error getting view model",
        error
      );
      throw error;
    }
  }

  // Private methods for data mapping
  private mapCustomerQueueDTOToCustomerQueue(dto: CustomerQueueStatusDTO): CustomerQueue {
    return {
      id: dto.id,
      queueNumber: dto.queueNumber,
      status: dto.status,
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      services: dto.services,
      totalPrice: dto.totalPrice,
      estimatedWaitTime: dto.estimatedWaitTime,
      position: dto.position,
      specialRequests: dto.specialRequests,
      createdAt: this.formatQueueTimeString(dto.createdAt),
      updatedAt: this.formatQueueTimeString(dto.updatedAt),
    };
  }

  private mapQueueProgressDTOToQueueProgress(dto: QueueProgressDTO): QueueProgress {
    return {
      currentNumber: dto.currentNumber,
      totalAhead: dto.totalAhead,
      averageServiceTime: dto.averageServiceTime,
      estimatedCallTime: this.formatQueueTimeString(dto.estimatedCallTime),
    };
  }

  private formatQueueTimeString(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      "ติดตามสถานะคิว",
      "ติดตามสถานะคิวของคุณและรับการแจ้งเตือนเมื่อใกล้ถึงคิว"
    );
  }
}

// Factory class for server-side
export class CustomerQueueStatusPresenterFactory {
  static async create(): Promise<CustomerQueueStatusPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const shopService = serverContainer.resolve<ShopService>("ShopService");
    const shopCustomerQueueStatusService = serverContainer.resolve<ShopCustomerQueueStatusService>("ShopCustomerQueueStatusService");
    return new CustomerQueueStatusPresenter(logger, shopService, shopCustomerQueueStatusService);
  }
}

// Factory class for client-side
export class ClientQueueStatusPresenterFactory {
  static async create(): Promise<CustomerQueueStatusPresenter> {
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const shopService = clientContainer.resolve<ShopService>("ShopService");
    const shopCustomerQueueStatusService = clientContainer.resolve<ShopCustomerQueueStatusService>("ShopCustomerQueueStatusService");
    return new CustomerQueueStatusPresenter(logger, shopService, shopCustomerQueueStatusService);
  }
}
