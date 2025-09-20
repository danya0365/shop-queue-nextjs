import type { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type {
  CustomerRewardsDataDTO,
  CustomerPointsDTO,
  AvailableRewardDTO,
  CustomerRewardDTO,
  RewardTransactionDTO,
  CustomerRewardStatsDTO,
  CustomerInfoDTO,
  AvailableRewardsFiltersDTO,
  RedeemedRewardsFiltersDTO,
  RewardTransactionsFiltersDTO,
} from "@/src/application/dtos/shop/customer/customer-reward-dto";
import { GetCustomerPointsUseCase } from "@/src/application/usecases/shop/customer/reward/GetCustomerPointsUseCase";
import { GetAvailableRewardsUseCase } from "@/src/application/usecases/shop/customer/reward/GetAvailableRewardsUseCase";
import { GetRedeemedRewardsUseCase } from "@/src/application/usecases/shop/customer/reward/GetRedeemedRewardsUseCase";
import { GetRewardTransactionsUseCase } from "@/src/application/usecases/shop/customer/reward/GetRewardTransactionsUseCase";
import { RedeemRewardUseCase } from "@/src/application/usecases/shop/customer/reward/RedeemRewardUseCase";
import { GetRewardDetailsUseCase } from "@/src/application/usecases/shop/customer/reward/GetRewardDetailsUseCase";
import { GetCustomerRewardStatsUseCase } from "@/src/application/usecases/shop/customer/reward/GetCustomerRewardStatsUseCase";
import { GetCustomerInfoUseCase } from "@/src/application/usecases/shop/customer/reward/GetCustomerInfoUseCase";
import type { Logger } from "@/src/domain/interfaces/logger";
import type { ShopCustomerRewardRepository } from "@/src/domain/repositories/shop/customer/customer-reward-repository";

export interface IShopCustomerRewardService {
  /**
   * Get customer points information
   * @param shopId The shop ID
   * @param customerId The customer ID
   * @returns Customer points information
   */
  getCustomerPoints(shopId: string, customerId: string): Promise<CustomerPointsDTO>;

  /**
   * Get available rewards with pagination and filters
   * @param shopId The shop ID
   * @param customerId The customer ID (optional)
   * @param currentPage Current page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @param filters Available rewards filters (optional)
   * @returns Available rewards with pagination
   */
  getAvailableRewards(
    shopId: string,
    customerId?: string,
    currentPage?: number,
    perPage?: number,
    filters?: AvailableRewardsFiltersDTO
  ): Promise<{
    data: AvailableRewardDTO[];
    pagination: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>;

  /**
   * Get redeemed rewards with pagination and filters
   * @param shopId The shop ID
   * @param customerId The customer ID
   * @param currentPage Current page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @param filters Redeemed rewards filters (optional)
   * @returns Redeemed rewards with pagination
   */
  getRedeemedRewards(
    shopId: string,
    customerId: string,
    currentPage?: number,
    perPage?: number,
    filters?: RedeemedRewardsFiltersDTO
  ): Promise<{
    data: CustomerRewardDTO[];
    pagination: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>;

  /**
   * Get reward transactions with pagination and filters
   * @param shopId The shop ID
   * @param customerId The customer ID
   * @param currentPage Current page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @param filters Reward transactions filters (optional)
   * @returns Reward transactions with pagination
   */
  getRewardTransactions(
    shopId: string,
    customerId: string,
    currentPage?: number,
    perPage?: number,
    filters?: RewardTransactionsFiltersDTO
  ): Promise<{
    data: RewardTransactionDTO[];
    pagination: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>;

  /**
   * Redeem a reward for a customer
   * @param shopId The shop ID
   * @param customerId The customer ID
   * @param rewardId The reward ID
   * @returns Redeemed reward information
   */
  redeemReward(shopId: string, customerId: string, rewardId: string): Promise<CustomerRewardDTO>;

  /**
   * Get reward details by ID
   * @param shopId The shop ID
   * @param rewardId The reward ID
   * @param customerId The customer ID (optional)
   * @returns Reward details
   */
  getRewardDetails(shopId: string, rewardId: string, customerId?: string): Promise<CustomerRewardDTO | AvailableRewardDTO>;

  /**
   * Get customer reward statistics
   * @param shopId The shop ID
   * @param customerId The customer ID
   * @returns Customer reward statistics
   */
  getCustomerRewardStats(shopId: string, customerId: string): Promise<CustomerRewardStatsDTO>;

  /**
   * Get customer information
   * @param shopId The shop ID
   * @param customerId The customer ID
   * @returns Customer information
   */
  getCustomerInfo(shopId: string, customerId: string): Promise<CustomerInfoDTO>;

  /**
   * Get complete customer rewards data (for presenter)
   * @param shopId The shop ID
   * @param customerId The customer ID
   * @param currentPage Current page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @param availableRewardsFilters Available rewards filters (optional)
   * @param redeemedRewardsFilters Redeemed rewards filters (optional)
   * @param rewardTransactionsFilters Reward transactions filters (optional)
   * @returns Complete customer rewards data
   */
  getCustomerRewardsData(
    shopId: string,
    customerId: string,
    currentPage?: number,
    perPage?: number,
    availableRewardsFilters?: AvailableRewardsFiltersDTO,
    redeemedRewardsFilters?: RedeemedRewardsFiltersDTO,
    rewardTransactionsFilters?: RewardTransactionsFiltersDTO
  ): Promise<CustomerRewardsDataDTO>;
}

export class ShopCustomerRewardService implements IShopCustomerRewardService {
  constructor(
    private readonly getCustomerPointsUseCase: IUseCase<
      { shopId: string; customerId: string },
      CustomerPointsDTO
    >,
    private readonly getAvailableRewardsUseCase: IUseCase<
      {
        shopId: string;
        customerId?: string;
        currentPage?: number;
        perPage?: number;
        filters?: AvailableRewardsFiltersDTO;
      },
      {
        data: AvailableRewardDTO[];
        pagination: {
          currentPage: number;
          perPage: number;
          totalItems: number;
          totalPages: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
      }
    >,
    private readonly getRedeemedRewardsUseCase: IUseCase<
      {
        shopId: string;
        customerId: string;
        currentPage?: number;
        perPage?: number;
        filters?: RedeemedRewardsFiltersDTO;
      },
      {
        data: CustomerRewardDTO[];
        pagination: {
          currentPage: number;
          perPage: number;
          totalItems: number;
          totalPages: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
      }
    >,
    private readonly getRewardTransactionsUseCase: IUseCase<
      {
        shopId: string;
        customerId: string;
        currentPage?: number;
        perPage?: number;
        filters?: RewardTransactionsFiltersDTO;
      },
      {
        data: RewardTransactionDTO[];
        pagination: {
          currentPage: number;
          perPage: number;
          totalItems: number;
          totalPages: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
      }
    >,
    private readonly redeemRewardUseCase: IUseCase<
      { shopId: string; customerId: string; rewardId: string },
      CustomerRewardDTO
    >,
    private readonly getRewardDetailsUseCase: IUseCase<
      { shopId: string; rewardId: string; customerId?: string },
      CustomerRewardDTO | AvailableRewardDTO
    >,
    private readonly getCustomerRewardStatsUseCase: IUseCase<
      { shopId: string; customerId: string },
      CustomerRewardStatsDTO
    >,
    private readonly getCustomerInfoUseCase: IUseCase<
      { shopId: string; customerId: string },
      CustomerInfoDTO
    >,
    private readonly logger: Logger
  ) {}

  async getCustomerPoints(shopId: string, customerId: string): Promise<CustomerPointsDTO> {
    try {
      this.logger.info("Getting customer points", { shopId, customerId });

      const result = await this.getCustomerPointsUseCase.execute({ shopId, customerId });
      return result;
    } catch (error) {
      this.logger.error("Error getting customer points", { error, shopId, customerId });
      throw error;
    }
  }

  async getAvailableRewards(
    shopId: string,
    customerId?: string,
    currentPage: number = 1,
    perPage: number = 10,
    filters?: AvailableRewardsFiltersDTO
  ): Promise<{
    data: AvailableRewardDTO[];
    pagination: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      this.logger.info("Getting available rewards", { shopId, customerId, currentPage, perPage, filters });

      const result = await this.getAvailableRewardsUseCase.execute({
        shopId,
        customerId,
        currentPage,
        perPage,
        filters,
      });
      return result;
    } catch (error) {
      this.logger.error("Error getting available rewards", { error, shopId, customerId });
      throw error;
    }
  }

  async getRedeemedRewards(
    shopId: string,
    customerId: string,
    currentPage: number = 1,
    perPage: number = 10,
    filters?: RedeemedRewardsFiltersDTO
  ): Promise<{
    data: CustomerRewardDTO[];
    pagination: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      this.logger.info("Getting redeemed rewards", { shopId, customerId, currentPage, perPage, filters });

      const result = await this.getRedeemedRewardsUseCase.execute({
        shopId,
        customerId,
        currentPage,
        perPage,
        filters,
      });
      return result;
    } catch (error) {
      this.logger.error("Error getting redeemed rewards", { error, shopId, customerId });
      throw error;
    }
  }

  async getRewardTransactions(
    shopId: string,
    customerId: string,
    currentPage: number = 1,
    perPage: number = 10,
    filters?: RewardTransactionsFiltersDTO
  ): Promise<{
    data: RewardTransactionDTO[];
    pagination: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    try {
      this.logger.info("Getting reward transactions", { shopId, customerId, currentPage, perPage, filters });

      const result = await this.getRewardTransactionsUseCase.execute({
        shopId,
        customerId,
        currentPage,
        perPage,
        filters,
      });
      return result;
    } catch (error) {
      this.logger.error("Error getting reward transactions", { error, shopId, customerId });
      throw error;
    }
  }

  async redeemReward(shopId: string, customerId: string, rewardId: string): Promise<CustomerRewardDTO> {
    try {
      this.logger.info("Redeeming reward", { shopId, customerId, rewardId });

      const result = await this.redeemRewardUseCase.execute({ shopId, customerId, rewardId });
      return result;
    } catch (error) {
      this.logger.error("Error redeeming reward", { error, shopId, customerId, rewardId });
      throw error;
    }
  }

  async getRewardDetails(shopId: string, rewardId: string, customerId?: string): Promise<CustomerRewardDTO | AvailableRewardDTO> {
    try {
      this.logger.info("Getting reward details", { shopId, rewardId, customerId });

      const result = await this.getRewardDetailsUseCase.execute({ shopId, rewardId, customerId });
      return result;
    } catch (error) {
      this.logger.error("Error getting reward details", { error, shopId, rewardId, customerId });
      throw error;
    }
  }

  async getCustomerRewardStats(shopId: string, customerId: string): Promise<CustomerRewardStatsDTO> {
    try {
      this.logger.info("Getting customer reward statistics", { shopId, customerId });

      const result = await this.getCustomerRewardStatsUseCase.execute({ shopId, customerId });
      return result;
    } catch (error) {
      this.logger.error("Error getting customer reward statistics", { error, shopId, customerId });
      throw error;
    }
  }

  async getCustomerInfo(shopId: string, customerId: string): Promise<CustomerInfoDTO> {
    try {
      this.logger.info("Getting customer info", { shopId, customerId });

      const result = await this.getCustomerInfoUseCase.execute({ shopId, customerId });
      return result;
    } catch (error) {
      this.logger.error("Error getting customer info", { error, shopId, customerId });
      throw error;
    }
  }

  async getCustomerRewardsData(
    shopId: string,
    customerId: string,
    currentPage: number = 1,
    perPage: number = 10,
    availableRewardsFilters?: AvailableRewardsFiltersDTO,
    redeemedRewardsFilters?: RedeemedRewardsFiltersDTO,
    rewardTransactionsFilters?: RewardTransactionsFiltersDTO
  ): Promise<CustomerRewardsDataDTO> {
    try {
      this.logger.info("Getting customer rewards data", { 
        shopId, 
        customerId, 
        currentPage, 
        perPage,
        availableRewardsFilters,
        redeemedRewardsFilters,
        rewardTransactionsFilters
      });

      // Execute all operations in parallel for better performance
      const [
        customerPoints,
        customerInfo,
        availableRewards,
        redeemedRewards,
        rewardTransactions,
        customerStats
      ] = await Promise.all([
        this.getCustomerPoints(shopId, customerId),
        this.getCustomerInfo(shopId, customerId),
        this.getAvailableRewards(shopId, customerId, currentPage, perPage, availableRewardsFilters),
        this.getRedeemedRewards(shopId, customerId, currentPage, perPage, redeemedRewardsFilters),
        this.getRewardTransactions(shopId, customerId, currentPage, perPage, rewardTransactionsFilters),
        this.getCustomerRewardStats(shopId, customerId)
      ]);

      return {
        customerPoints,
        customerInfo,
        availableRewards,
        redeemedRewards,
        rewardTransactions,
        customerStats,
      };
    } catch (error) {
      this.logger.error("Error getting customer rewards data", { error, shopId, customerId });
      throw error;
    }
  }
}

export class ShopCustomerRewardServiceFactory {
  static create(repository: ShopCustomerRewardRepository, logger: Logger): ShopCustomerRewardService {
    const getCustomerPointsUseCase = new GetCustomerPointsUseCase(repository);
    const getAvailableRewardsUseCase = new GetAvailableRewardsUseCase(repository);
    const getRedeemedRewardsUseCase = new GetRedeemedRewardsUseCase(repository);
    const getRewardTransactionsUseCase = new GetRewardTransactionsUseCase(repository);
    const redeemRewardUseCase = new RedeemRewardUseCase(repository);
    const getRewardDetailsUseCase = new GetRewardDetailsUseCase(repository);
    const getCustomerRewardStatsUseCase = new GetCustomerRewardStatsUseCase(repository);
    const getCustomerInfoUseCase = new GetCustomerInfoUseCase(repository);
    
    return new ShopCustomerRewardService(
      getCustomerPointsUseCase,
      getAvailableRewardsUseCase,
      getRedeemedRewardsUseCase,
      getRewardTransactionsUseCase,
      redeemRewardUseCase,
      getRewardDetailsUseCase,
      getCustomerRewardStatsUseCase,
      getCustomerInfoUseCase,
      logger
    );
  }
}
