import { ShopService } from '@/src/application/services/shop/ShopService';
import { getClientContainer } from '@/src/di/client-container';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BaseShopPresenter } from '@/src/presentation/presenters/shop/BaseShopPresenter';

// Define interfaces for data structures
export interface CustomerQueue {
  id: string;
  queueNumber: string;
  status: 'waiting' | 'confirmed' | 'serving' | 'completed' | 'cancelled';
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
export interface QueueStatusViewModel {
  customerQueue: CustomerQueue | null;
  queueProgress: QueueProgress;
  shopName: string;
  isFound: boolean;
  canCancel: boolean;
}

// Main Presenter class
export class QueueStatusPresenter extends BaseShopPresenter {
  constructor(logger: Logger, shopService: ShopService) {
    super(logger, shopService);
  }

  async getViewModel(shopId: string, queueNumber?: string): Promise<QueueStatusViewModel> {
    try {
      this.logger.info('QueueStatusPresenter: Getting view model for shop', { shopId, queueNumber });

      // Mock data - replace with actual service calls
      const customerQueue = queueNumber ? this.getCustomerQueue(queueNumber) : null;
      const queueProgress = this.getQueueProgress();

      return {
        customerQueue,
        queueProgress,
        shopName: 'ร้านกาแฟดีใจ',
        isFound: !!customerQueue,
        canCancel: customerQueue?.status === 'waiting' || customerQueue?.status === 'confirmed',
      };
    } catch (error) {
      this.logger.error('QueueStatusPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Private methods for data preparation
  private getCustomerQueue(queueNumber: string): CustomerQueue | null {
    // Mock data - replace with actual service call
    if (queueNumber === 'A016') {
      return {
        id: '1',
        queueNumber: 'A016',
        status: 'confirmed',
        customerName: 'สมชาย ใจดี',
        customerPhone: '081-234-5678',
        services: ['กาแฟลาเต้', 'เค้กช็อกโกแลต'],
        totalPrice: 205,
        estimatedWaitTime: 15,
        position: 3,
        specialRequests: 'ไม่ใส่น้ำตาล',
        createdAt: '10:35',
        updatedAt: '10:37',
      };
    }
    return null;
  }

  private getQueueProgress(): QueueProgress {
    return {
      currentNumber: 'A014',
      totalAhead: 2,
      averageServiceTime: 8,
      estimatedCallTime: '11:05',
    };
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      'ติดตามสถานะคิว',
      'ติดตามสถานะคิวของคุณและรับการแจ้งเตือนเมื่อใกล้ถึงคิว'
    );
  }
}

// Factory class for server-side
export class QueueStatusPresenterFactory {
  static async create(): Promise<QueueStatusPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const shopService = serverContainer.resolve<ShopService>('ShopService');
    return new QueueStatusPresenter(logger, shopService);
  }
}

// Factory class for client-side
export class ClientQueueStatusPresenterFactory {
  static async create(): Promise<QueueStatusPresenter> {
    const clientContainer = await getClientContainer();
    const logger = clientContainer.resolve<Logger>('Logger');
    const shopService = clientContainer.resolve<ShopService>('ShopService');
    return new QueueStatusPresenter(logger, shopService);
  }
}
