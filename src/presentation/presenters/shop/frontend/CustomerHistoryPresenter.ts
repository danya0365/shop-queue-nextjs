import { ShopService } from "@/src/application/services/shop/ShopService";
import { getServerContainer } from "@/src/di/server-container";
import { getClientContainer } from "@/src/di/client-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopPresenter } from "@/src/presentation/presenters/shop/BaseShopPresenter";
import { getPaginationConfig } from "@/src/infrastructure/config/PaginationConfig";

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
  constructor(logger: Logger, shopService: ShopService) {
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

      // Mock data - replace with actual service calls
      const allQueueHistory = this.getQueueHistory();
      const filteredHistory = this.applyFilters(allQueueHistory, filters);
      
      // Apply pagination
      const startIndex = (currentPage - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedHistory = filteredHistory.slice(startIndex, endIndex);
      
      const customerStats = this.getCustomerStats(allQueueHistory);
      
      // Create pagination object
      const pagination: Pagination = {
        currentPage,
        perPage,
        totalItems: filteredHistory.length,
        totalPages: Math.ceil(filteredHistory.length / perPage),
        hasNext: endIndex < filteredHistory.length,
        hasPrev: currentPage > 1,
      };

      return {
        queueHistory: paginatedHistory,
        customerStats,
        filters,
        customerName: "สมชาย ลูกค้าดี",
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

  // Private methods for data preparation
  private getQueueHistory(): CustomerQueueHistory[] {
    return [
      {
        id: "1",
        queueNumber: "A015",
        shopName: "ร้านกาแฟสุขใจ",
        services: [
          { id: "1", name: "กาแฟลาเต้", price: 85, quantity: 1 },
          { id: "2", name: "เค้กช็อกโกแลต", price: 120, quantity: 1 },
        ],
        totalAmount: 219.35,
        status: "completed",
        queueDate: "2024-01-15",
        queueTime: "10:30",
        completedAt: "10:45",
        waitTime: 8,
        serviceTime: 7,
        rating: 5,
        feedback: "บริการดีมาก กาแฟอร่อย เค้กหวานกำลังดี",
        employeeName: "สมชาย ใจดี",
        paymentMethod: "qr",
      },
      {
        id: "2",
        queueNumber: "A012",
        shopName: "ร้านกาแฟสุขใจ",
        services: [{ id: "3", name: "กาแฟอเมริกาโน่", price: 65, quantity: 2 }],
        totalAmount: 139.1,
        status: "completed",
        queueDate: "2024-01-12",
        queueTime: "14:15",
        completedAt: "14:28",
        waitTime: 5,
        serviceTime: 8,
        rating: 4,
        feedback: "กาแฟดี แต่รอนานหน่อย",
        employeeName: "สมหญิง รักงาน",
        paymentMethod: "cash",
      },
      {
        id: "3",
        queueNumber: "A008",
        shopName: "ร้านกาแฟสุขใจ",
        services: [
          { id: "4", name: "เซ็ตอาหารเช้า", price: 150, quantity: 1 },
          { id: "5", name: "กาแฟคาปูชิโน่", price: 75, quantity: 1 },
        ],
        totalAmount: 244.45,
        status: "completed",
        queueDate: "2024-01-08",
        queueTime: "08:45",
        completedAt: "09:05",
        waitTime: 12,
        serviceTime: 8,
        rating: 5,
        feedback: "อาหารเช้าอร่อย กาแฟหอม บรรยากาศดี",
        employeeName: "สมศรี ขยันทำงาน",
        paymentMethod: "card",
      },
      {
        id: "4",
        queueNumber: "A005",
        shopName: "ร้านกาแฟสุขใจ",
        services: [{ id: "6", name: "สมูทตี้ผลไม้", price: 85, quantity: 1 }],
        totalAmount: 91.8,
        status: "cancelled",
        queueDate: "2024-01-05",
        queueTime: "16:20",
        waitTime: 0,
        paymentMethod: undefined,
      },
      {
        id: "5",
        queueNumber: "A003",
        shopName: "ร้านกาแฟสุขใจ",
        services: [
          { id: "7", name: "กาแฟเอสเปรสโซ่", price: 55, quantity: 1 },
          { id: "8", name: "คุกกี้", price: 45, quantity: 2 },
        ],
        totalAmount: 155.35,
        status: "completed",
        queueDate: "2024-01-03",
        queueTime: "11:10",
        completedAt: "11:22",
        waitTime: 7,
        serviceTime: 5,
        rating: 4,
        employeeName: "สมชาย ใจดี",
        paymentMethod: "qr",
      },
      {
        id: "6",
        queueNumber: "A020",
        shopName: "ร้านตัดผมสวยงาม",
        services: [
          { id: "9", name: "ตัดผมชาย", price: 150, quantity: 1 },
          { id: "10", name: "สระผม", price: 100, quantity: 1 },
        ],
        totalAmount: 275.0,
        status: "completed",
        queueDate: "2024-01-20",
        queueTime: "15:30",
        completedAt: "16:15",
        waitTime: 15,
        serviceTime: 30,
        rating: 5,
        feedback: "ตัดผมเก่งมาก บริการดี",
        employeeName: "สมศรี ขยันทำงาน",
        paymentMethod: "cash",
      },
      {
        id: "7",
        queueNumber: "A018",
        shopName: "ร้านตัดผมสวยงาม",
        services: [{ id: "11", name: "ย้อมสีผม", price: 300, quantity: 1 }],
        totalAmount: 330.0,
        status: "completed",
        queueDate: "2024-01-18",
        queueTime: "13:00",
        completedAt: "14:45",
        waitTime: 20,
        serviceTime: 75,
        rating: 4,
        feedback: "ย้อมสีสวย แต่รอนานไปหน่อย",
        employeeName: "สมชาย ใจดี",
        paymentMethod: "card",
      },
      {
        id: "8",
        queueNumber: "A025",
        shopName: "ร้านอาหารไทยรสเด็ด",
        services: [
          { id: "12", name: "ข้าวผัด", price: 60, quantity: 1 },
          { id: "13", name: "ต้มยำกุ้ง", price: 120, quantity: 1 },
        ],
        totalAmount: 193.2,
        status: "completed",
        queueDate: "2024-01-25",
        queueTime: "12:00",
        completedAt: "12:30",
        waitTime: 10,
        serviceTime: 20,
        rating: 5,
        feedback: "อาหารอร่อยมาก รสชาติดี",
        employeeName: "สมหญิง รักงาน",
        paymentMethod: "qr",
      },
      {
        id: "9",
        queueNumber: "A022",
        shopName: "ร้านอาหารไทยรสเด็ด",
        services: [{ id: "14", name: "ส้มตำ", price: 50, quantity: 1 }],
        totalAmount: 55.0,
        status: "no_show",
        queueDate: "2024-01-22",
        queueTime: "18:00",
        waitTime: 0,
        paymentMethod: undefined,
      },
      {
        id: "10",
        queueNumber: "A030",
        shopName: "ร้านกาแฟสุขใจ",
        services: [
          { id: "15", name: "กาแฟมอคค่า", price: 70, quantity: 1 },
          { id: "16", name: "ขนมปัง", price: 35, quantity: 2 },
        ],
        totalAmount: 148.4,
        status: "completed",
        queueDate: "2024-01-30",
        queueTime: "16:45",
        completedAt: "17:00",
        waitTime: 3,
        serviceTime: 12,
        rating: 4,
        feedback: "กาแฟดี บริการรวดเร็ว",
        employeeName: "สมศรี ขยันทำงาน",
        paymentMethod: "cash",
      },
    ];
  }

  private applyFilters(history: CustomerQueueHistory[], filters: HistoryFilters): CustomerQueueHistory[] {
    let filtered = [...history];
    
    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(queue => queue.status === filters.status);
    }
    
    // Shop filter
    if (filters.shop !== "all") {
      filtered = filtered.filter(queue => queue.shopName === filters.shop);
    }
    
    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      let startDate: Date;
      
      switch (filters.dateRange) {
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "quarter":
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(0); // Beginning of time
      }
      
      filtered = filtered.filter(queue => {
        const queueDate = new Date(queue.queueDate);
        return queueDate >= startDate;
      });
    }
    
    // Custom date range filter
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999); // End of the day
      
      filtered = filtered.filter(queue => {
        const queueDate = new Date(queue.queueDate);
        return queueDate >= start && queueDate <= end;
      });
    } else if (filters.startDate) {
      const start = new Date(filters.startDate);
      filtered = filtered.filter(queue => {
        const queueDate = new Date(queue.queueDate);
        return queueDate >= start;
      });
    } else if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999); // End of the day
      filtered = filtered.filter(queue => {
        const queueDate = new Date(queue.queueDate);
        return queueDate <= end;
      });
    }
    
    return filtered;
  }

  private getCustomerStats(history: CustomerQueueHistory[]): CustomerStats {
    const completedQueues = history.filter((q) => q.status === "completed");
    const cancelledQueues = history.filter((q) => q.status === "cancelled");

    const totalSpent = completedQueues.reduce(
      (sum, q) => sum + q.totalAmount,
      0
    );
    const ratingsWithValues = completedQueues.filter((q) => q.rating);
    const averageRating =
      ratingsWithValues.length > 0
        ? ratingsWithValues.reduce((sum, q) => sum + (q.rating || 0), 0) /
          ratingsWithValues.length
        : 0;

    // Calculate favorite service
    const serviceCount: { [key: string]: number } = {};
    completedQueues.forEach((queue) => {
      queue.services.forEach((service) => {
        serviceCount[service.name] =
          (serviceCount[service.name] || 0) + service.quantity;
      });
    });

    const favoriteService =
      Object.entries(serviceCount).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "ไม่มีข้อมูล";

    return {
      totalQueues: history.length,
      completedQueues: completedQueues.length,
      cancelledQueues: cancelledQueues.length,
      totalSpent,
      averageRating,
      favoriteService,
      memberSince: "2023-12-01",
    };
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
    return new CustomerHistoryPresenter(logger, shopService);
  }
}

// Factory class for client-side
export class ClientCustomerHistoryPresenterFactory {
  static async create(): Promise<CustomerHistoryPresenter> {
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>("Logger");
    const shopService = clientContainer.resolve<ShopService>("ShopService");
    return new CustomerHistoryPresenter(logger, shopService);
  }
}
