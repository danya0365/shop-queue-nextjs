import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define interfaces for data structures
export interface QueueItem {
  id: string;
  queueNumber: string;
  customerName: string;
  customerPhone: string;
  status: 'waiting' | 'confirmed' | 'serving' | 'completed' | 'cancelled';
  priority: 'normal' | 'high' | 'vip';
  estimatedTime: number;
  createdAt: string;
  notes?: string;
  services: string[];
}

export interface QueueFilter {
  status: string;
  priority: string;
  search: string;
}

// Define ViewModel interface
export interface QueueManagementViewModel {
  queues: QueueItem[];
  totalQueues: number;
  waitingCount: number;
  servingCount: number;
  completedToday: number;
  averageWaitTime: number;
  filters: QueueFilter;
}

// Main Presenter class
export class QueueManagementPresenter {
  constructor(private readonly logger: Logger) {}

  async getViewModel(shopId: string): Promise<QueueManagementViewModel> {
    try {
      this.logger.info('QueueManagementPresenter: Getting view model for shop', { shopId });
      
      // Mock data - replace with actual service calls
      const queues = this.getQueueData();
      const stats = this.calculateStats(queues);
      
      return {
        queues,
        totalQueues: queues.length,
        waitingCount: stats.waiting,
        servingCount: stats.serving,
        completedToday: stats.completed,
        averageWaitTime: 15,
        filters: {
          status: 'all',
          priority: 'all',
          search: '',
        },
      };
    } catch (error) {
      this.logger.error('QueueManagementPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Private methods for data preparation
  private getQueueData(): QueueItem[] {
    return [
      {
        id: '1',
        queueNumber: 'A015',
        customerName: 'สมชาย ใจดี',
        customerPhone: '081-234-5678',
        status: 'waiting',
        priority: 'normal',
        estimatedTime: 10,
        createdAt: '10:30',
        services: ['กาแฟ', 'ขนมปัง'],
      },
      {
        id: '2',
        queueNumber: 'A016',
        customerName: 'สมหญิง รักดี',
        customerPhone: '082-345-6789',
        status: 'serving',
        priority: 'high',
        estimatedTime: 5,
        createdAt: '10:35',
        services: ['กาแฟพิเศษ', 'เค้ก'],
        notes: 'ลูกค้า VIP',
      },
      {
        id: '3',
        queueNumber: 'A017',
        customerName: 'สมศรี มีสุข',
        customerPhone: '083-456-7890',
        status: 'waiting',
        priority: 'vip',
        estimatedTime: 15,
        createdAt: '10:40',
        services: ['เซ็ตอาหารเช้า'],
      },
      {
        id: '4',
        queueNumber: 'A014',
        customerName: 'สมปอง ดีใจ',
        customerPhone: '084-567-8901',
        status: 'completed',
        priority: 'normal',
        estimatedTime: 0,
        createdAt: '10:15',
        services: ['กาแฟ'],
      },
    ];
  }

  private calculateStats(queues: QueueItem[]) {
    return {
      waiting: queues.filter(q => q.status === 'waiting').length,
      serving: queues.filter(q => q.status === 'serving').length,
      completed: queues.filter(q => q.status === 'completed').length,
    };
  }

  // Metadata generation
  generateMetadata() {
    return {
      title: 'จัดการคิว | Shop Queue',
      description: 'ระบบจัดการคิวลูกค้าและติดตามสถานะการให้บริการ',
    };
  }
}

// Factory class
export class QueueManagementPresenterFactory {
  static async create(): Promise<QueueManagementPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    return new QueueManagementPresenter(logger);
  }
}
