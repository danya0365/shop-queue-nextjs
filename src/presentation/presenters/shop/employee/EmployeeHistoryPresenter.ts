import { IShopService } from '@/src/application/services/shop/ShopService';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BaseShopPresenter } from '@/src/presentation/presenters/shop/BaseShopPresenter';

// Define interfaces for data structures
export interface HistoryQueue {
  id: string;
  queueNumber: string;
  customerName: string;
  customerPhone: string;
  services: HistoryService[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'qr' | 'transfer';
  status: 'completed' | 'cancelled' | 'no_show';
  servedAt: string;
  completedAt: string;
  duration: number; // in minutes
  rating?: number;
  feedback?: string;
}

export interface HistoryService {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface DailyStats {
  date: string;
  totalQueues: number;
  completedQueues: number;
  cancelledQueues: number;
  totalRevenue: number;
  averageServiceTime: number;
  averageRating: number;
}

export interface FilterOptions {
  dateRange: 'today' | 'week' | 'month' | 'custom';
  status: 'all' | 'completed' | 'cancelled' | 'no_show';
  startDate?: string;
  endDate?: string;
}

// Define ViewModel interface
export interface EmployeeHistoryViewModel {
  historyQueues: HistoryQueue[];
  dailyStats: DailyStats[];
  currentStats: DailyStats;
  filterOptions: FilterOptions;
  employeeName: string;
}

// Main Presenter class
export class EmployeeHistoryPresenter extends BaseShopPresenter {
  constructor(logger: Logger, shopService: IShopService) {
    super(logger, shopService);
  }

  async getViewModel(shopId: string): Promise<EmployeeHistoryViewModel> {
    try {
      this.logger.info('EmployeeHistoryPresenter: Getting view model for shop', { shopId });

      // Mock data - replace with actual service calls
      const historyQueues = this.getHistoryQueues();
      const dailyStats = this.getDailyStats();
      const currentStats = this.getCurrentStats();

      return {
        historyQueues,
        dailyStats,
        currentStats,
        filterOptions: {
          dateRange: 'today',
          status: 'all',
        },
        employeeName: 'สมชาย ใจดี',
      };
    } catch (error) {
      this.logger.error('EmployeeHistoryPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Private methods for data preparation
  private getHistoryQueues(): HistoryQueue[] {
    return [
      {
        id: '1',
        queueNumber: 'A014',
        customerName: 'สมปอง ดีใจ',
        customerPhone: '084-567-8901',
        services: [
          { id: '1', name: 'กาแฟอเมริกาโน่', price: 65, quantity: 2 },
        ],
        total: 139.10,
        paymentMethod: 'cash',
        status: 'completed',
        servedAt: '10:15',
        completedAt: '10:25',
        duration: 10,
        rating: 5,
        feedback: 'บริการดีมาก กาแฟอร่อย',
      },
      {
        id: '2',
        queueNumber: 'A013',
        customerName: 'สมใจ รักงาน',
        customerPhone: '085-678-9012',
        services: [
          { id: '2', name: 'เซ็ตอาหารเช้า', price: 150, quantity: 1 },
          { id: '3', name: 'กาแฟลาเต้', price: 85, quantity: 1 },
        ],
        total: 244.45,
        paymentMethod: 'qr',
        status: 'completed',
        servedAt: '09:45',
        completedAt: '10:05',
        duration: 20,
        rating: 4,
      },
      {
        id: '3',
        queueNumber: 'A012',
        customerName: 'สมศรี มีสุข',
        customerPhone: '086-789-0123',
        services: [
          { id: '4', name: 'กาแฟคาปูชิโน่', price: 75, quantity: 1 },
        ],
        total: 82.25,
        paymentMethod: 'card',
        status: 'cancelled',
        servedAt: '09:30',
        completedAt: '09:32',
        duration: 2,
      },
      {
        id: '4',
        queueNumber: 'A011',
        customerName: 'สมหวัง ปรารถนา',
        customerPhone: '087-890-1234',
        services: [
          { id: '5', name: 'เค้กช็อกโกแลต', price: 120, quantity: 1 },
        ],
        total: 132.40,
        paymentMethod: 'cash',
        status: 'no_show',
        servedAt: '09:15',
        completedAt: '09:20',
        duration: 5,
      },
    ];
  }

  private getDailyStats(): DailyStats[] {
    return [
      {
        date: '2024-01-15',
        totalQueues: 25,
        completedQueues: 22,
        cancelledQueues: 2,
        totalRevenue: 3250,
        averageServiceTime: 12,
        averageRating: 4.5,
      },
      {
        date: '2024-01-14',
        totalQueues: 28,
        completedQueues: 25,
        cancelledQueues: 3,
        totalRevenue: 3680,
        averageServiceTime: 14,
        averageRating: 4.3,
      },
      {
        date: '2024-01-13',
        totalQueues: 23,
        completedQueues: 21,
        cancelledQueues: 1,
        totalRevenue: 2890,
        averageServiceTime: 11,
        averageRating: 4.7,
      },
    ];
  }

  private getCurrentStats(): DailyStats {
    return {
      date: '2024-01-15',
      totalQueues: 4,
      completedQueues: 2,
      cancelledQueues: 1,
      totalRevenue: 598.20,
      averageServiceTime: 13,
      averageRating: 4.5,
    };
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      'ประวัติการให้บริการ - พนักงาน',
      'ดูประวัติการให้บริการและสถิติการทำงานของพนักงาน'
    );
  }
}

// Factory class
export class EmployeeHistoryPresenterFactory {
  static async create(): Promise<EmployeeHistoryPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const shopService = serverContainer.resolve<IShopService>('ShopService');
    return new EmployeeHistoryPresenter(logger, shopService);
  }
}
