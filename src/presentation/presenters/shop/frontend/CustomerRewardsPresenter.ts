import { ShopService } from "@/src/application/services/shop/ShopService";
import { ShopCustomerRewardService } from "@/src/application/services/shop/customer/ShopCustomerRewardService";
import { getServerContainer } from "@/src/di/server-container";
import { getClientContainer } from "@/src/di/client-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopPresenter } from "@/src/presentation/presenters/shop/BaseShopPresenter";
import type {
  AvailableRewardDTO,
  CustomerRewardDTO,
  RewardTransactionDTO,
  AvailableRewardsFiltersDTO,
  RedeemedRewardsFiltersDTO,
  RewardTransactionsFiltersDTO,
} from "@/src/application/dtos/shop/customer/customer-reward-dto";

// Define interfaces for data structures
export interface CustomerReward {
  id: string;
  name: string;
  description: string;
  type: "discount" | "free_item" | "cashback" | "points";
  value: number;
  pointsCost: number;
  category: string;
  imageUrl?: string;
  expiryDate?: string;
  termsAndConditions: string[];
  isAvailable: boolean;
  isRedeemed: boolean;
  redeemedAt?: string;
}

export interface CustomerPoints {
  currentPoints: number;
  totalEarned: number;
  totalRedeemed: number;
  pointsExpiring: number;
  expiryDate?: string;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  nextTierPoints: number;
  tierBenefits: string[];
}

export interface RewardTransaction {
  id: string;
  type: "earned" | "redeemed" | "expired";
  points: number;
  description: string;
  date: string;
  relatedOrderId?: string;
}

export interface AvailableReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  stock?: number;
}

// Filter interfaces
export interface RewardsFilters {
  type: RewardsFilterType;
  category: string;
  status: string;
  dateRange: "all" | "month" | "quarter" | "year" | "custom";
  startDate?: string;
  endDate?: string;
}

// type filter
export type RewardsFilterType =
  | "all"
  | "discount"
  | "free_item"
  | "cashback"
  | "points";

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
export interface CustomerRewardsViewModel {
  customerPoints: CustomerPoints;
  customerName: string;

  // ข้อมูลรางวัลที่ใช้ได้พร้อม pagination
  availableRewards: {
    data: AvailableReward[]; // ข้อมูลรางวัลที่ใช้ได้ (เฉพาะหน้าปัจจุบัน)
    pagination: Pagination;
  };

  // ข้อมูลรางวัลที่แลกไปแล้วพร้อม pagination
  redeemedRewards: {
    data: CustomerReward[]; // ข้อมูลรางวัลที่แลกไปแล้ว (เฉพาะหน้าปัจจุบัน)
    pagination: Pagination;
  };

  // ข้อมูลรายการแลกคะแนนพร้อม pagination
  rewardTransactions: {
    data: RewardTransaction[]; // ข้อมูลรายการแลกคะแนน (เฉพาะหน้าปัจจุบัน)
    pagination: Pagination;
  };
}

// Main Presenter class
export class CustomerRewardsPresenter extends BaseShopPresenter {
  constructor(
    logger: Logger, 
    shopService: ShopService,
    private readonly customerRewardService: ShopCustomerRewardService
  ) {
    super(logger, shopService);
  }

  async getViewModel(
    shopId: string,
    currentPage: number,
    perPage: number,
    filters: RewardsFilters
  ): Promise<CustomerRewardsViewModel> {
    try {
      this.logger.info("CustomerRewardsPresenter: Getting view model", {
        shopId,
        currentPage,
        perPage,
        filters,
      });

      // Convert filters to DTO format
      const availableRewardsFilters: AvailableRewardsFiltersDTO = {
        type: filters.type !== "all" ? filters.type : undefined,
        category: filters.category !== "all" ? filters.category : undefined,
        isAvailable: filters.status === "available" ? true : filters.status === "unavailable" ? false : undefined,
      };

      const redeemedRewardsFilters: RedeemedRewardsFiltersDTO = {
        type: filters.type !== "all" ? filters.type : undefined,
        dateRange: filters.dateRange !== "all" ? filters.dateRange : undefined,
        startDate: filters.startDate,
        endDate: filters.endDate,
      };

      const rewardTransactionsFilters: RewardTransactionsFiltersDTO = {
        type: filters.type !== "all" ? filters.type as "earned" | "redeemed" | "expired" : undefined,
        dateRange: filters.dateRange !== "all" ? filters.dateRange : undefined,
        startDate: filters.startDate,
        endDate: filters.endDate,
      };

      // Get customer rewards data from service
      const customerRewardsData = await this.customerRewardService.getCustomerRewardsData(
        shopId,
        "customer-id", // customerId - will be determined from auth context
        currentPage,
        perPage,
        availableRewardsFilters,
        redeemedRewardsFilters,
        rewardTransactionsFilters
      );

      // Convert DTOs to ViewModel format
      const customerPoints: CustomerPoints = {
        currentPoints: customerRewardsData.customerPoints.currentPoints,
        totalEarned: customerRewardsData.customerPoints.totalEarned,
        totalRedeemed: customerRewardsData.customerPoints.totalRedeemed,
        pointsExpiring: customerRewardsData.customerPoints.pointsExpiring,
        expiryDate: customerRewardsData.customerPoints.expiryDate,
        tier: customerRewardsData.customerPoints.tier,
        nextTierPoints: customerRewardsData.customerPoints.nextTierPoints,
        tierBenefits: customerRewardsData.customerPoints.tierBenefits,
      };

      const availableRewards = customerRewardsData.availableRewards.data.map((reward: AvailableRewardDTO) => ({
        id: reward.id,
        name: reward.name,
        description: reward.description,
        type: "discount", // Default type for available rewards
        value: 0, // Default value for available rewards
        pointsCost: reward.pointsCost,
        category: reward.category,
        imageUrl: reward.imageUrl,
        termsAndConditions: [], // Default empty array
        isAvailable: reward.isAvailable,
        expiryDate: undefined, // Not available in AvailableRewardDTO
      }));

      const redeemedRewards = customerRewardsData.redeemedRewards.data.map((reward: CustomerRewardDTO) => ({
        id: reward.id,
        name: reward.name,
        description: reward.description,
        type: reward.type,
        value: reward.value,
        pointsCost: reward.pointsCost,
        category: reward.category,
        imageUrl: reward.imageUrl,
        termsAndConditions: reward.termsAndConditions,
        isAvailable: reward.isAvailable,
        isRedeemed: reward.isRedeemed,
        redeemedAt: reward.redeemedAt,
        expiryDate: reward.expiryDate,
      }));

      const rewardTransactions = customerRewardsData.rewardTransactions.data.map((transaction: RewardTransactionDTO) => ({
        id: transaction.id,
        type: transaction.type,
        points: transaction.points,
        description: transaction.description,
        date: transaction.date,
        relatedOrderId: transaction.relatedOrderId,
      }));

      const availableRewardsPagination: Pagination = {
        currentPage: customerRewardsData.availableRewards.pagination.currentPage,
        perPage: customerRewardsData.availableRewards.pagination.perPage,
        totalItems: customerRewardsData.availableRewards.pagination.totalItems,
        totalPages: customerRewardsData.availableRewards.pagination.totalPages,
        hasNext: customerRewardsData.availableRewards.pagination.hasNext,
        hasPrev: customerRewardsData.availableRewards.pagination.hasPrev,
      };

      const redeemedRewardsPagination: Pagination = {
        currentPage: customerRewardsData.redeemedRewards.pagination.currentPage,
        perPage: customerRewardsData.redeemedRewards.pagination.perPage,
        totalItems: customerRewardsData.redeemedRewards.pagination.totalItems,
        totalPages: customerRewardsData.redeemedRewards.pagination.totalPages,
        hasNext: customerRewardsData.redeemedRewards.pagination.hasNext,
        hasPrev: customerRewardsData.redeemedRewards.pagination.hasPrev,
      };

      const rewardTransactionsPagination: Pagination = {
        currentPage: customerRewardsData.rewardTransactions.pagination.currentPage,
        perPage: customerRewardsData.rewardTransactions.pagination.perPage,
        totalItems: customerRewardsData.rewardTransactions.pagination.totalItems,
        totalPages: customerRewardsData.rewardTransactions.pagination.totalPages,
        hasNext: customerRewardsData.rewardTransactions.pagination.hasNext,
        hasPrev: customerRewardsData.rewardTransactions.pagination.hasPrev,
      };

      return {
        customerPoints,
        customerName: customerRewardsData.customerInfo.customerName,
        availableRewards: {
          data: availableRewards,
          pagination: availableRewardsPagination,
        },
        redeemedRewards: {
          data: redeemedRewards,
          pagination: redeemedRewardsPagination,
        },
        rewardTransactions: {
          data: rewardTransactions,
          pagination: rewardTransactionsPagination,
        },
      };
    } catch (error) {
      this.logger.error("CustomerRewardsPresenter: Error getting view model", error);
      throw error;
    }
  }

  // Action methods
  async redeemReward(shopId: string, rewardId: string): Promise<void> {
    try {
      this.logger.info("CustomerRewardsPresenter: Redeeming reward", {
        shopId,
        rewardId,
      });

      // Call service to redeem reward
      await this.customerRewardService.redeemReward(
        shopId,
        "customer-id", // customerId - will be determined from auth context
        rewardId
      );
    } catch (error) {
      this.logger.error(
        "CustomerRewardsPresenter: Error redeeming reward",
        error
      );
      throw error;
    }
  }

  async getRewardDetails(
    shopId: string,
    rewardId: string
  ): Promise<CustomerReward | AvailableReward> {
    try {
      this.logger.info("CustomerRewardsPresenter: Getting reward details", {
        shopId,
        rewardId,
      });

      // Call service to get reward details
      const rewardData = await this.customerRewardService.getRewardDetails(
        shopId,
        rewardId,
        "customer-id" // customerId - will be determined from auth context
      );

      // Convert DTO to ViewModel format
      if ('isRedeemed' in rewardData) {
        const customerReward = rewardData as CustomerRewardDTO;
        return {
          id: customerReward.id,
          name: customerReward.name,
          description: customerReward.description,
          type: customerReward.type,
          value: customerReward.value,
          pointsCost: customerReward.pointsCost,
          category: customerReward.category,
          imageUrl: customerReward.imageUrl,
          termsAndConditions: customerReward.termsAndConditions,
          isAvailable: customerReward.isAvailable,
          isRedeemed: customerReward.isRedeemed,
          redeemedAt: customerReward.redeemedAt,
          expiryDate: customerReward.expiryDate,
        };
      } else {
        const availableReward = rewardData as AvailableRewardDTO;
        return {
          id: availableReward.id,
          name: availableReward.name,
          description: availableReward.description,
          type: "discount", // Default type for available rewards
          value: 0, // Default value for available rewards
          pointsCost: availableReward.pointsCost,
          category: availableReward.category,
          imageUrl: availableReward.imageUrl,
          termsAndConditions: [], // Default empty array
          isAvailable: availableReward.isAvailable,
          expiryDate: undefined, // Not available in AvailableRewardDTO
        };
      }
    } catch (error) {
      this.logger.error(
        "CustomerRewardsPresenter: Error getting reward details",
        error
      );
      throw error;
    }
  }

  // Private helper methods
  private applyFilters(
    rewards: (AvailableReward | CustomerReward)[],
    filters: RewardsFilters
  ): (AvailableReward | CustomerReward)[] {
    return rewards.filter((reward) => {
      // Type filter
      if (
        filters.type !== "all" &&
        "type" in reward &&
        reward.type !== filters.type
      ) {
        return false;
      }

      // Category filter
      if (filters.category !== "all" && reward.category !== filters.category) {
        return false;
      }

      // Status filter (for available rewards)
      if (filters.status !== "all" && "isAvailable" in reward) {
        if (filters.status === "available" && !reward.isAvailable) return false;
        if (filters.status === "unavailable" && reward.isAvailable)
          return false;
      }

      // Status filter (for redeemed rewards)
      if (filters.status !== "all" && "isRedeemed" in reward) {
        if (filters.status === "redeemed" && !reward.isRedeemed) return false;
        if (filters.status === "not_redeemed" && reward.isRedeemed)
          return false;
      }

      return true;
    });
  }

  private applyTransactionFilters(
    transactions: RewardTransaction[],
    filters: RewardsFilters
  ): RewardTransaction[] {
    return transactions.filter((transaction) => {
      // Date range filter
      if (filters.dateRange !== "all") {
        const transactionDate = new Date(transaction.date);
        const now = new Date();

        switch (filters.dateRange) {
          case "month":
            if (
              transactionDate < new Date(now.getFullYear(), now.getMonth(), 1)
            )
              return false;
            break;
          case "quarter":
            const quarterStart = new Date(
              now.getFullYear(),
              Math.floor(now.getMonth() / 3) * 3,
              1
            );
            if (transactionDate < quarterStart) return false;
            break;
          case "year":
            if (transactionDate < new Date(now.getFullYear(), 0, 1))
              return false;
            break;
          case "custom":
            if (
              filters.startDate &&
              transactionDate < new Date(filters.startDate)
            )
              return false;
            if (filters.endDate && transactionDate > new Date(filters.endDate))
              return false;
            break;
        }
      }

      return true;
    });
  }

  private applyPagination<T>(
    items: T[],
    currentPage: number,
    perPage: number
  ): T[] {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return items.slice(startIndex, endIndex);
  }

  private calculatePagination(
    totalItems: number,
    currentPage: number,
    perPage: number
  ): Pagination {
    const totalPages = Math.ceil(totalItems / perPage);

    return {
      currentPage,
      totalPages,
      perPage,
      totalItems,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    };
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      "รางวัลและแต้มสะสม - ลูกค้า",
      "ดูแต้มสะสม แลกของรางวัล และติดตามสิทธิประโยชน์ต่างๆ"
    );
  }
}

// Factory class for server-side
export class CustomerRewardsPresenterFactory {
  static async create(): Promise<CustomerRewardsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const shopService = serverContainer.resolve<ShopService>("ShopService");
    const customerRewardService = serverContainer.resolve<ShopCustomerRewardService>("ShopCustomerRewardService");
    return new CustomerRewardsPresenter(logger, shopService, customerRewardService);
  }
}

// Factory class for client-side
export class ClientCustomerRewardsPresenterFactory {
  static async create(): Promise<CustomerRewardsPresenter> {
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const shopService = clientContainer.resolve<ShopService>("ShopService");
    const customerRewardService = clientContainer.resolve<ShopCustomerRewardService>("ShopCustomerRewardService");
    return new CustomerRewardsPresenter(logger, shopService, customerRewardService);
  }
}
