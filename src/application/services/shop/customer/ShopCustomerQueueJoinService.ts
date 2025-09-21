import type { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type {
  ServiceOptionDTO,
  ShopQueueInfoDTO,
  QueueJoinDataDTO,
  JoinQueueResultDTO,
  JoinQueueInputDTO,
} from "@/src/application/dtos/shop/customer/queue-join-dto";
import { GetAvailableServicesUseCase } from "@/src/application/usecases/shop/customer/queue-join/GetAvailableServicesUseCase";
import { GetShopQueueInfoUseCase } from "@/src/application/usecases/shop/customer/queue-join/GetShopQueueInfoUseCase";
import { JoinQueueUseCase } from "@/src/application/usecases/shop/customer/queue-join/JoinQueueUseCase";
import type { Logger } from "@/src/domain/interfaces/logger";
import type { ShopCustomerQueueJoinRepository } from "@/src/domain/repositories/shop/customer/queue-join-repository";

export interface IShopCustomerQueueJoinService {
  /**
   * Get available services for a shop
   * @param shopId The shop ID
   * @returns Array of available service options
   */
  getAvailableServices(shopId: string): Promise<ServiceOptionDTO[]>;

  /**
   * Get shop queue information
   * @param shopId The shop ID
   * @returns Shop queue information
   */
  getShopQueueInfo(shopId: string): Promise<ShopQueueInfoDTO>;

  /**
   * Get complete queue join data (services and shop info)
   * @param shopId The shop ID
   * @returns Complete queue join data
   */
  getQueueJoinData(shopId: string): Promise<QueueJoinDataDTO>;

  /**
   * Join a queue with selected services
   * @param input Queue join input data
   * @returns Result of the queue join operation
   */
  joinQueue(input: JoinQueueInputDTO): Promise<JoinQueueResultDTO>;
}

export class ShopCustomerQueueJoinService implements IShopCustomerQueueJoinService {
  constructor(
    private readonly getAvailableServicesUseCase: IUseCase<
      { shopId: string },
      ServiceOptionDTO[]
    >,
    private readonly getShopQueueInfoUseCase: IUseCase<
      { shopId: string },
      ShopQueueInfoDTO
    >,
    private readonly joinQueueUseCase: IUseCase<
      {
        shopId: string;
        customerName: string;
        customerPhone: string;
        services: {
          id: string;
          name: string;
          price: number;
          quantity: number;
          estimatedTime: number;
        }[];
        specialRequests?: string;
        priority: "normal" | "urgent";
      },
      JoinQueueResultDTO
    >,
    private readonly logger: Logger
  ) {}

  async getAvailableServices(shopId: string): Promise<ServiceOptionDTO[]> {
    try {
      this.logger.info("Getting available services", { shopId });

      const result = await this.getAvailableServicesUseCase.execute({ shopId });
      return result;
    } catch (error) {
      this.logger.error("Error getting available services", { error, shopId });
      throw error;
    }
  }

  async getShopQueueInfo(shopId: string): Promise<ShopQueueInfoDTO> {
    try {
      this.logger.info("Getting shop queue info", { shopId });

      const result = await this.getShopQueueInfoUseCase.execute({ shopId });
      return result;
    } catch (error) {
      this.logger.error("Error getting shop queue info", { error, shopId });
      throw error;
    }
  }

  async getQueueJoinData(shopId: string): Promise<QueueJoinDataDTO> {
    try {
      this.logger.info("Getting queue join data", { shopId });

      // Get services and shop info in parallel
      const [services, shopQueueInfo] = await Promise.all([
        this.getAvailableServices(shopId),
        this.getShopQueueInfo(shopId),
      ]);

      // Extract categories from services
      const categories = [...new Set(services.map(service => service.category))];

      return {
        services,
        categories,
        shopQueueInfo,
      };
    } catch (error) {
      this.logger.error("Error getting queue join data", { error, shopId });
      throw error;
    }
  }

  async joinQueue(input: JoinQueueInputDTO): Promise<JoinQueueResultDTO> {
    try {
      this.logger.info("Joining queue", { 
        shopId: input.shopId, 
        customerName: input.customerName,
        serviceCount: input.services.length 
      });

      const result = await this.joinQueueUseCase.execute({
        shopId: input.shopId,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        services: input.services,
        specialRequests: input.specialRequests,
        priority: input.priority,
      });

      return result;
    } catch (error) {
      this.logger.error("Error joining queue", { 
        error, 
        shopId: input.shopId,
        customerName: input.customerName 
      });
      throw error;
    }
  }
}

export class ShopCustomerQueueJoinServiceFactory {
  static create(repository: ShopCustomerQueueJoinRepository, logger: Logger): ShopCustomerQueueJoinService {
    const getAvailableServicesUseCase = new GetAvailableServicesUseCase(repository);
    const getShopQueueInfoUseCase = new GetShopQueueInfoUseCase(repository);
    const joinQueueUseCase = new JoinQueueUseCase(repository);
    
    return new ShopCustomerQueueJoinService(
      getAvailableServicesUseCase,
      getShopQueueInfoUseCase,
      joinQueueUseCase,
      logger
    );
  }
}
