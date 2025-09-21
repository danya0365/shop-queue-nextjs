import type { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type {
  CustomerQueueStatusDTO,
  QueueProgressDTO,
  CustomerQueueStatusViewModelDTO,
} from "@/src/application/dtos/shop/customer/customer-queue-status-dto";
import { GetCustomerQueueStatusUseCase } from "@/src/application/usecases/shop/customer/queue-status/GetCustomerQueueStatusUseCase";
import { GetQueueProgressUseCase } from "@/src/application/usecases/shop/customer/queue-status/GetQueueProgressUseCase";
import { CancelCustomerQueueUseCase } from "@/src/application/usecases/shop/customer/queue-status/CancelCustomerQueueUseCase";
import type { Logger } from "@/src/domain/interfaces/logger";
import type { CustomerQueueStatusRepository } from "@/src/domain/repositories/shop/customer/customer-queue-status-repository";
import type { ShopService } from "@/src/application/services/shop/ShopService";

export interface IShopCustomerQueueStatusService {
  /**
   * Get customer queue status view model
   * @param shopId The shop ID
   * @param queueNumber The queue number (optional)
   * @returns Customer queue status view model
   */
  getCustomerQueueStatusViewModel(
    shopId: string,
    queueNumber?: string
  ): Promise<CustomerQueueStatusViewModelDTO>;

  /**
   * Get customer queue status
   * @param shopId The shop ID
   * @param queueNumber The queue number
   * @returns Customer queue status DTO or null if not found
   */
  getCustomerQueueStatus(
    shopId: string,
    queueNumber: string
  ): Promise<CustomerQueueStatusDTO | null>;

  /**
   * Get queue progress
   * @param shopId The shop ID
   * @returns Queue progress DTO
   */
  getQueueProgress(shopId: string): Promise<QueueProgressDTO>;

  /**
   * Cancel customer queue
   * @param shopId The shop ID
   * @param queueNumber The queue number
   * @returns True if cancellation was successful
   */
  cancelCustomerQueue(
    shopId: string,
    queueNumber: string
  ): Promise<boolean>;
}

export class ShopCustomerQueueStatusService implements IShopCustomerQueueStatusService {
  constructor(
    private readonly getCustomerQueueStatusUseCase: IUseCase<
      { shopId: string; queueNumber?: string },
      CustomerQueueStatusDTO | null
    >,
    private readonly getQueueProgressUseCase: IUseCase<
      { shopId: string },
      QueueProgressDTO
    >,
    private readonly cancelCustomerQueueUseCase: IUseCase<
      { shopId: string; queueNumber: string },
      boolean
    >,
    private readonly shopService: ShopService,
    private readonly logger: Logger
  ) {}

  async getCustomerQueueStatusViewModel(
    shopId: string,
    queueNumber?: string
  ): Promise<CustomerQueueStatusViewModelDTO> {
    try {
      this.logger.info("Getting customer queue status view model", {
        shopId,
        queueNumber,
      });

      const customerQueue = queueNumber
        ? await this.getCustomerQueueStatusUseCase.execute({ shopId, queueNumber })
        : null;
      
      const queueProgress = await this.getQueueProgressUseCase.execute({ shopId });
      
      const shop = await this.shopService.getShopById(shopId);

      return {
        customerQueue,
        queueProgress,
        shopName: shop?.name || "",
        isFound: !!customerQueue,
        canCancel:
          customerQueue?.status === "waiting" ||
          customerQueue?.status === "confirmed",
      };
    } catch (error) {
      this.logger.error("Error getting customer queue status view model", {
        error,
        shopId,
        queueNumber,
      });
      throw error;
    }
  }

  async getCustomerQueueStatus(
    shopId: string,
    queueNumber: string
  ): Promise<CustomerQueueStatusDTO | null> {
    try {
      this.logger.info("Getting customer queue status", { shopId, queueNumber });

      const result = await this.getCustomerQueueStatusUseCase.execute({
        shopId,
        queueNumber,
      });
      return result;
    } catch (error) {
      this.logger.error("Error getting customer queue status", {
        error,
        shopId,
        queueNumber,
      });
      throw error;
    }
  }

  async getQueueProgress(shopId: string): Promise<QueueProgressDTO> {
    try {
      this.logger.info("Getting queue progress", { shopId });

      const result = await this.getQueueProgressUseCase.execute({ shopId });
      return result;
    } catch (error) {
      this.logger.error("Error getting queue progress", { error, shopId });
      throw error;
    }
  }

  async cancelCustomerQueue(
    shopId: string,
    queueNumber: string
  ): Promise<boolean> {
    try {
      this.logger.info("Cancelling customer queue", { shopId, queueNumber });

      const result = await this.cancelCustomerQueueUseCase.execute({
        shopId,
        queueNumber,
      });
      return result;
    } catch (error) {
      this.logger.error("Error cancelling customer queue", {
        error,
        shopId,
        queueNumber,
      });
      throw error;
    }
  }
}

export class ShopCustomerQueueStatusServiceFactory {
  static create(
    repository: CustomerQueueStatusRepository,
    shopService: ShopService,
    logger: Logger
  ): ShopCustomerQueueStatusService {
    const getCustomerQueueStatusUseCase = new GetCustomerQueueStatusUseCase(repository);
    const getQueueProgressUseCase = new GetQueueProgressUseCase(repository);
    const cancelCustomerQueueUseCase = new CancelCustomerQueueUseCase(repository);

    return new ShopCustomerQueueStatusService(
      getCustomerQueueStatusUseCase,
      getQueueProgressUseCase,
      cancelCustomerQueueUseCase,
      shopService,
      logger
    );
  }
}
