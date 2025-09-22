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
   * @param queueIdentifier The queue ID or queue number (optional)
   * @returns Customer queue status view model
   */
  getCustomerQueueStatusViewModel(
    shopId: string,
    queueIdentifier?: string
  ): Promise<CustomerQueueStatusViewModelDTO>;

  /**
   * Get customer queue status
   * @param shopId The shop ID
   * @param queueIdentifier The queue ID or queue number
   * @returns Customer queue status DTO or null if not found
   */
  getCustomerQueueStatus(
    shopId: string,
    queueIdentifier: string
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
      { shopId: string; queueId?: string },
      CustomerQueueStatusDTO | null
    >,
    private readonly customerQueueStatusRepository: CustomerQueueStatusRepository,
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
    queueIdentifier?: string
  ): Promise<CustomerQueueStatusViewModelDTO> {
    try {
      this.logger.info("Getting customer queue status view model", {
        shopId,
        queueIdentifier,
      });

      let customerQueue = null;
      if (queueIdentifier) {
        // Try to get queue status by treating the identifier as queue ID first
        try {
          customerQueue = await this.getCustomerQueueStatusUseCase.execute({ shopId, queueId: queueIdentifier });
        } catch {
          // If that fails, try to convert queue number to queue ID
          this.logger.info("Attempting to convert queue number to queue ID", { queueIdentifier });
          const queueId = await this.customerQueueStatusRepository.getQueueIdByNumber(shopId, queueIdentifier);
          if (queueId) {
            customerQueue = await this.getCustomerQueueStatusUseCase.execute({ shopId, queueId });
          }
        }
      }
      
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
        queueIdentifier,
      });
      throw error;
    }
  }

  async getCustomerQueueStatus(
    shopId: string,
    queueIdentifier: string
  ): Promise<CustomerQueueStatusDTO | null> {
    try {
      this.logger.info("Getting customer queue status", { shopId, queueIdentifier });

      // Try to get queue status by treating the identifier as queue ID first
      try {
        const result = await this.getCustomerQueueStatusUseCase.execute({
          shopId,
          queueId: queueIdentifier,
        });
        return result;
      } catch (originalError) {
        // If that fails, try to convert queue number to queue ID
        this.logger.info("Attempting to convert queue number to queue ID", { queueIdentifier });
        const queueId = await this.customerQueueStatusRepository.getQueueIdByNumber(shopId, queueIdentifier);
        if (queueId) {
          const result = await this.getCustomerQueueStatusUseCase.execute({
            shopId,
            queueId,
          });
          return result;
        }
        throw originalError;
      }
    } catch (error) {
      this.logger.error("Error getting customer queue status", {
        error,
        shopId,
        queueIdentifier,
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
      repository,
      getQueueProgressUseCase,
      cancelCustomerQueueUseCase,
      shopService,
      logger
    );
  }
}
