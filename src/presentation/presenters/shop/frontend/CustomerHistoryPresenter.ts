import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define interfaces for data structures
export interface CustomerQueueHistory {
  id: string;
  queueNumber: string;
  shopName: string;
  services: HistoryService[];
  totalAmount: number;
  status: 'completed' | 'cancelled' | 'no_show';
  queueDate: string;
  queueTime: string;
  completedAt?: string;
  waitTime?: number; // in minutes
  serviceTime?: number; // in minutes
  rating?: number;
  feedback?: string;
  employeeName?: string;
  paymentMethod?: 'cash' | 'card' | 'qr' | 'transfer';
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
  status: 'all' | 'completed' | 'cancelled' | 'no_show';
  dateRange: 'all' | 'month' | 'quarter' | 'year';
  shop: string;
}

// Define ViewModel interface
export interface CustomerHistoryViewModel {
  queueHistory: CustomerQueueHistory[];
  customerStats: CustomerStats;
  filters: HistoryFilters;
  customerName: string;
}

// Main Presenter class
export class CustomerHistoryPresenter {
  constructor(private readonly logger: Logger) {}

  async getViewModel(shopId: string): Promise<CustomerHistoryViewModel> {
    try {
      this.logger.info('CustomerHistoryPresenter: Getting view model for shop', { shopId });
      
      // Mock data - replace with actual service calls
      const queueHistory = this.getQueueHistory();
      const customerStats = this.getCustomerStats(queueHistory);
      
      return {
        queueHistory,
        customerStats,
        filters: {
          status: 'all',
          dateRange: 'all',
          shop: 'all',
        },
        customerName: 'สมชาย ลูกค้าดี',
      };
    } catch (error) {
      this.logger.error('CustomerHistoryPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Private methods for data preparation
  private getQueueHistory(): CustomerQueueHistory[] {
    return [
      {
        id: '1',
        queueNumber: 'A015',
        shopName: 'ร้านกาแฟสุขใจ',
        services: [
          { id: '1', name: 'กาแฟลาเต้', price: 85, quantity: 1 },
          { id: '2', name: 'เค้กช็อกโกแลต', price: 120, quantity: 1 },
        ],
        totalAmount: 219.35,
        status: 'completed',
        queueDate: '2024-01-15',
        queueTime: '10:30',
        completedAt: '10:45',
        waitTime: 8,
        serviceTime: 7,
        rating: 5,
        feedback: 'บริการดีมาก กาแฟอร่อย เค้กหวานกำลังดี',
        employeeName: 'สมชาย ใจดี',
        paymentMethod: 'qr',
      },
      {
        id: '2',
        queueNumber: 'A012',
        shopName: 'ร้านกาแฟสุขใจ',
        services: [
          { id: '3', name: 'กาแฟอเมริกาโน่', price: 65, quantity: 2 },
        ],
        totalAmount: 139.10,
        status: 'completed',
        queueDate: '2024-01-12',
        queueTime: '14:15',
        completedAt: '14:28',
        waitTime: 5,
        serviceTime: 8,
        rating: 4,
        feedback: 'กาแฟดี แต่รอนานหน่อย',
        employeeName: 'สมหญิง รักงาน',
        paymentMethod: 'cash',
      },
      {
        id: '3',
        queueNumber: 'A008',
        shopName: 'ร้านกาแฟสุขใจ',
        services: [
          { id: '4', name: 'เซ็ตอาหารเช้า', price: 150, quantity: 1 },
          { id: '5', name: 'กาแฟคาปูชิโน่', price: 75, quantity: 1 },
        ],
        totalAmount: 244.45,
        status: 'completed',
        queueDate: '2024-01-08',
        queueTime: '08:45',
        completedAt: '09:05',
        waitTime: 12,
        serviceTime: 8,
        rating: 5,
        feedback: 'อาหารเช้าอร่อย กาแฟหอม บรรยากาศดี',
        employeeName: 'สมศรี ขยันทำงาน',
        paymentMethod: 'card',
      },
      {
        id: '4',
        queueNumber: 'A005',
        shopName: 'ร้านกาแฟสุขใจ',
        services: [
          { id: '6', name: 'สมูทตี้ผลไม้', price: 85, quantity: 1 },
        ],
        totalAmount: 91.80,
        status: 'cancelled',
        queueDate: '2024-01-05',
        queueTime: '16:20',
        waitTime: 0,
        paymentMethod: undefined,
      },
      {
        id: '5',
        queueNumber: 'A003',
        shopName: 'ร้านกาแฟสุขใจ',
        services: [
          { id: '7', name: 'กาแฟเอสเปรสโซ่', price: 55, quantity: 1 },
          { id: '8', name: 'คุกกี้', price: 45, quantity: 2 },
        ],
        totalAmount: 155.35,
        status: 'completed',
        queueDate: '2024-01-03',
        queueTime: '11:10',
        completedAt: '11:22',
        waitTime: 7,
        serviceTime: 5,
        rating: 4,
        employeeName: 'สมชาย ใจดี',
        paymentMethod: 'qr',
      },
    ];
  }

  private getCustomerStats(history: CustomerQueueHistory[]): CustomerStats {
    const completedQueues = history.filter(q => q.status === 'completed');
    const cancelledQueues = history.filter(q => q.status === 'cancelled');
    
    const totalSpent = completedQueues.reduce((sum, q) => sum + q.totalAmount, 0);
    const ratingsWithValues = completedQueues.filter(q => q.rating);
    const averageRating = ratingsWithValues.length > 0 
      ? ratingsWithValues.reduce((sum, q) => sum + (q.rating || 0), 0) / ratingsWithValues.length 
      : 0;

    // Calculate favorite service
    const serviceCount: { [key: string]: number } = {};
    completedQueues.forEach(queue => {
      queue.services.forEach(service => {
        serviceCount[service.name] = (serviceCount[service.name] || 0) + service.quantity;
      });
    });
    
    const favoriteService = Object.entries(serviceCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'ไม่มีข้อมูล';

    return {
      totalQueues: history.length,
      completedQueues: completedQueues.length,
      cancelledQueues: cancelledQueues.length,
      totalSpent,
      averageRating,
      favoriteService,
      memberSince: '2023-12-01',
    };
  }

  // Metadata generation
  generateMetadata() {
    return {
      title: 'ประวัติการใช้บริการ - ลูกค้า | Shop Queue',
      description: 'ดูประวัติการจองคิวและการใช้บริการของคุณ',
    };
  }
}

// Factory class
export class CustomerHistoryPresenterFactory {
  static async create(): Promise<CustomerHistoryPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    return new CustomerHistoryPresenter(logger);
  }
}
