import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define interfaces for data structures
export interface CustomerQueue {
  id: string;
  queueNumber: string;
  status: 'waiting' | 'confirmed' | 'serving' | 'completed' | 'cancelled';
  customerName: string;
  services: string[];
  totalPrice: number;
  estimatedWaitTime: number;
  position: number;
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
export class QueueStatusPresenter {
  constructor(private readonly logger: Logger) {}

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
        services: ['กาแฟลาเต้', 'เค้กช็อกโกแลต'],
        totalPrice: 205,
        estimatedWaitTime: 15,
        position: 3,
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
  generateMetadata() {
    return {
      title: 'ติดตามสถานะคิว | Shop Queue',
      description: 'ติดตามสถานะคิวของคุณและรับการแจ้งเตือนเมื่อใกล้ถึงคิว',
    };
  }
}

// Factory class
export class QueueStatusPresenterFactory {
  static async create(): Promise<QueueStatusPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    return new QueueStatusPresenter(logger);
  }
}
