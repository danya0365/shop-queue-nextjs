import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BaseShopPresenter } from '@/src/presentation/presenters/shop/BaseShopPresenter';

// Define interfaces for data structures
export interface EmployeeQueueItem {
  id: string;
  queueNumber: string;
  customerName: string;
  customerPhone: string;
  status: 'waiting' | 'confirmed' | 'serving' | 'completed';
  services: string[];
  totalPrice: number;
  estimatedTime: number;
  createdAt: string;
  priority: 'normal' | 'high' | 'vip';
  notes?: string;
}

// Define ViewModel interface
export interface EmployeeQueueViewModel {
  myQueues: EmployeeQueueItem[];
  waitingQueues: EmployeeQueueItem[];
  totalQueues: number;
  employeeName: string;
  isOnDuty: boolean;
}

// Main Presenter class
export class EmployeeQueuePresenter extends BaseShopPresenter {
  constructor(logger: Logger) {
    super(logger);
  }

  async getViewModel(shopId: string): Promise<EmployeeQueueViewModel> {
    try {
      this.logger.info('EmployeeQueuePresenter: Getting view model for shop', { shopId });
      
      // Mock data - replace with actual service calls
      const myQueues = this.getMyQueues();
      const waitingQueues = this.getWaitingQueues();
      
      return {
        myQueues,
        waitingQueues,
        totalQueues: myQueues.length + waitingQueues.length,
        employeeName: 'สมชาย ใจดี',
        isOnDuty: true,
      };
    } catch (error) {
      this.logger.error('EmployeeQueuePresenter: Error getting view model', error);
      throw error;
    }
  }

  // Private methods for data preparation
  private getMyQueues(): EmployeeQueueItem[] {
    return [
      {
        id: '1',
        queueNumber: 'A016',
        customerName: 'สมหญิง รักดี',
        customerPhone: '082-345-6789',
        status: 'serving',
        services: ['กาแฟลาเต้', 'เค้กช็อกโกแลต'],
        totalPrice: 205,
        estimatedTime: 12,
        createdAt: '10:35',
        priority: 'normal',
      },
    ];
  }

  private getWaitingQueues(): EmployeeQueueItem[] {
    return [
      {
        id: '2',
        queueNumber: 'A017',
        customerName: 'สมศรี มีสุข',
        customerPhone: '083-456-7890',
        status: 'waiting',
        services: ['เซ็ตอาหารเช้า'],
        totalPrice: 150,
        estimatedTime: 15,
        createdAt: '10:40',
        priority: 'vip',
        notes: 'ลูกค้า VIP',
      },
      {
        id: '3',
        queueNumber: 'A018',
        customerName: 'สมปอง ดีใจ',
        customerPhone: '084-567-8901',
        status: 'waiting',
        services: ['กาแฟอเมริกาโน่', 'ขนมปัง'],
        totalPrice: 95,
        estimatedTime: 8,
        createdAt: '10:42',
        priority: 'normal',
      },
      {
        id: '4',
        queueNumber: 'A019',
        customerName: 'สมใส ยิ้มแย้ม',
        customerPhone: '085-678-9012',
        status: 'confirmed',
        services: ['น้ำผลไม้'],
        totalPrice: 60,
        estimatedTime: 5,
        createdAt: '10:45',
        priority: 'high',
      },
    ];
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      'จัดการคิว - พนักงาน',
      'จัดการคิวที่รับผิดชอบและติดตามการให้บริการ'
    );
  }
}

// Factory class
export class EmployeeQueuePresenterFactory {
  static async create(): Promise<EmployeeQueuePresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    return new EmployeeQueuePresenter(logger);
  }
}
