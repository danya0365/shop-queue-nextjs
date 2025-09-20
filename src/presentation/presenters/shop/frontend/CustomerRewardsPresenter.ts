import { ShopService } from "@/src/application/services/shop/ShopService";
import { getClientContainer } from "@/src/di/client-container";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { getPaginationConfig } from "@/src/infrastructure/config/PaginationConfig";
import { BaseShopPresenter } from "@/src/presentation/presenters/shop/BaseShopPresenter";

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
  constructor(logger: Logger, shopService: ShopService) {
    super(logger, shopService);
  }

  async getViewModel(
    shopId: string,
    currentPage: number = 1,
    perPage: number = getPaginationConfig().REWARDS_PER_PAGE || 10,
    filters: RewardsFilters = {
      type: "all",
      category: "all",
      status: "all",
      dateRange: "all",
    }
  ): Promise<CustomerRewardsViewModel> {
    try {
      // Mock data - replace with actual service calls
      const customerPoints = this.getCustomerPoints();
      const allAvailableRewards = this.getAvailableRewards();
      const allRedeemedRewards = this.getRedeemedRewards();
      const allRewardTransactions = this.getRewardTransactions();

      // Apply filters
      const filteredAvailableRewards = this.applyFilters(
        allAvailableRewards,
        filters
      ) as AvailableReward[];
      const filteredRedeemedRewards = this.applyFilters(
        allRedeemedRewards,
        filters
      ) as CustomerReward[];
      const filteredRewardTransactions = this.applyTransactionFilters(
        allRewardTransactions,
        filters
      );

      // Apply pagination for each data type separately
      const availableRewardsData = this.applyPagination(
        filteredAvailableRewards,
        currentPage,
        perPage
      ) as AvailableReward[];
      const redeemedRewardsData = this.applyPagination(
        filteredRedeemedRewards,
        currentPage,
        perPage
      ) as CustomerReward[];
      const rewardTransactionsData = this.applyPagination(
        filteredRewardTransactions,
        currentPage,
        perPage
      );

      // Calculate pagination info for each data type
      const availableRewardsPagination = this.calculatePagination(
        filteredAvailableRewards.length,
        currentPage,
        perPage
      );
      const redeemedRewardsPagination = this.calculatePagination(
        filteredRedeemedRewards.length,
        currentPage,
        perPage
      );
      const rewardTransactionsPagination = this.calculatePagination(
        filteredRewardTransactions.length,
        currentPage,
        perPage
      );

      return {
        customerPoints,
        customerName: "สมชาย ลูกค้าดี",
        availableRewards: {
          data: availableRewardsData,
          pagination: availableRewardsPagination,
        },
        redeemedRewards: {
          data: redeemedRewardsData,
          pagination: redeemedRewardsPagination,
        },
        rewardTransactions: {
          data: rewardTransactionsData,
          pagination: rewardTransactionsPagination,
        },
      };
    } catch (error) {
      this.logger.error(
        "CustomerRewardsPresenter: Error getting view model",
        error
      );
      throw error;
    }
  }

  // Private methods for data preparation
  private getCustomerPoints(): CustomerPoints {
    return {
      currentPoints: 1250,
      totalEarned: 3450,
      totalRedeemed: 2200,
      pointsExpiring: 150,
      expiryDate: "2024-03-15",
      tier: "Silver",
      nextTierPoints: 750,
      tierBenefits: [
        "ส่วนลด 5% ทุกการซื้อ",
        "แต้มสะสมเพิ่ม 1.5 เท่า",
        "ของรางวัลพิเศษ",
        "ข้ามคิวได้ 2 ครั้งต่อเดือน",
      ],
    };
  }

  private getAvailableRewards(): AvailableReward[] {
    return [
      {
        id: "1",
        name: "กาแฟฟรี 1 แก้ว",
        description: "กาแฟขนาดปกติ 1 แก้ว (ยกเว้นเมนูพิเศษ)",
        pointsCost: 500,
        category: "เครื่องดื่ม",
        imageUrl: "☕",
        isAvailable: true,
        stock: 50,
      },
      {
        id: "2",
        name: "ส่วนลด 10%",
        description: "ส่วนลด 10% สำหรับการซื้อครั้งถัดไป (สูงสุด 100 บาท)",
        pointsCost: 300,
        category: "ส่วนลด",
        imageUrl: "🎫",
        isAvailable: true,
      },
      {
        id: "3",
        name: "เค้กชิ้นโปรด",
        description: "เค้กชิ้นโปรด 1 ชิ้น (ยกเว้นเค้กพิเศษ)",
        pointsCost: 800,
        category: "ขนม",
        imageUrl: "🍰",
        isAvailable: true,
        stock: 20,
      },
      {
        id: "4",
        name: "ข้ามคิวพิเศษ",
        description: "สิทธิ์ข้ามคิว 1 ครั้ง (ใช้ได้ภายใน 30 วัน)",
        pointsCost: 200,
        category: "สิทธิพิเศษ",
        imageUrl: "⚡",
        isAvailable: true,
      },
      {
        id: "5",
        name: "เซ็ตอาหารเช้า",
        description: "เซ็ตอาหารเช้าพิเศษ (แซนด์วิช + กาแฟ)",
        pointsCost: 1200,
        category: "อาหาร",
        imageUrl: "🥪",
        isAvailable: false,
        stock: 0,
      },
      {
        id: "6",
        name: "คืนเงิน 50 บาท",
        description: "รับเงินคืน 50 บาท เข้าบัญชี",
        pointsCost: 1000,
        category: "เงินคืน",
        imageUrl: "💰",
        isAvailable: true,
      },
    ];
  }

  private getRedeemedRewards(): CustomerReward[] {
    return [
      {
        id: "1",
        name: "กาแฟฟรี 1 แก้ว",
        description: "กาแฟขนาดปกติ 1 แก้ว",
        type: "free_item",
        value: 65,
        pointsCost: 500,
        category: "เครื่องดื่ม",
        imageUrl: "☕",
        termsAndConditions: [
          "ใช้ได้ภายใน 30 วัน",
          "ไม่สามารถแลกเปลี่ยนเป็นเงินสดได้",
          "ใช้ได้เฉพาะสาขาที่แลก",
        ],
        isAvailable: true,
        isRedeemed: true,
        redeemedAt: "2024-01-10",
        expiryDate: "2024-02-10",
      },
      {
        id: "2",
        name: "ส่วนลด 10%",
        description: "ส่วนลด 10% สำหรับการซื้อครั้งถัดไป",
        type: "discount",
        value: 10,
        pointsCost: 300,
        category: "ส่วนลด",
        imageUrl: "🎫",
        termsAndConditions: [
          "ใช้ได้ภายใน 15 วัน",
          "ส่วนลดสูงสุด 100 บาท",
          "ใช้ได้ครั้งเดียว",
        ],
        isAvailable: false,
        isRedeemed: true,
        redeemedAt: "2024-01-05",
        expiryDate: "2024-01-20",
      },
    ];
  }

  private getRewardTransactions(): RewardTransaction[] {
    return [
      {
        id: "1",
        type: "earned",
        points: 85,
        description: "ซื้อกาแฟลาเต้ + เค้กช็อกโกแลต",
        date: "2024-01-15",
        relatedOrderId: "ORD-001",
      },
      {
        id: "2",
        type: "redeemed",
        points: -500,
        description: "แลกกาแฟฟรี 1 แก้ว",
        date: "2024-01-10",
      },
      {
        id: "3",
        type: "earned",
        points: 65,
        description: "ซื้อกาแฟอเมริกาโน่ 2 แก้ว",
        date: "2024-01-12",
        relatedOrderId: "ORD-002",
      },
      {
        id: "4",
        type: "redeemed",
        points: -300,
        description: "แลกส่วนลด 10%",
        date: "2024-01-05",
      },
      {
        id: "5",
        type: "earned",
        points: 120,
        description: "ซื้อเซ็ตอาหารเช้า + กาแฟคาปูชิโน่",
        date: "2024-01-08",
        relatedOrderId: "ORD-003",
      },
      {
        id: "6",
        type: "expired",
        points: -50,
        description: "แต้มหมดอายุ",
        date: "2024-01-01",
      },
    ];
  }

  // Action methods
  async redeemReward(shopId: string, rewardId: string): Promise<void> {
    try {
      this.logger.info("CustomerRewardsPresenter: Redeeming reward", {
        shopId,
        rewardId,
      });

      // Mock implementation - replace with actual service call
      // This would typically call a service to process the reward redemption
      console.log(`Redeeming reward ${rewardId} for shop ${shopId}`);

      // In a real implementation, this would:
      // 1. Validate the reward can be redeemed
      // 2. Check if user has enough points
      // 3. Process the redemption
      // 4. Update user's points balance
      // 5. Create a redemption record
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

      // Mock implementation - replace with actual service call
      const allRewards = [
        ...this.getAvailableRewards(),
        ...this.getRedeemedRewards(),
      ];
      const reward = allRewards.find((r) => r.id === rewardId);

      if (!reward) {
        throw new Error("Reward not found");
      }

      return reward;
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
    return new CustomerRewardsPresenter(logger, shopService);
  }
}

// Factory class for client-side
export class ClientCustomerRewardsPresenterFactory {
  static async create(): Promise<CustomerRewardsPresenter> {
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const shopService = clientContainer.resolve<ShopService>("ShopService");
    return new CustomerRewardsPresenter(logger, shopService);
  }
}
