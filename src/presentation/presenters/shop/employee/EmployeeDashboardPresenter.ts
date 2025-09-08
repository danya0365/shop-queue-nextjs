import { IShopService } from '@/src/application/services/shop/ShopService';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BaseShopPresenter } from '@/src/presentation/presenters/shop/BaseShopPresenter';

// Define interfaces for data structures
export interface CurrentQueue {
  id: string;
  queueNumber: string;
  customerName: string;
  customerPhone: string;
  services: string[];
  startTime: string;
  estimatedDuration: number;
}

export interface NextQueue {
  id: string;
  queueNumber: string;
  customerName: string;
  services: string[];
  waitTime: number;
}

export interface EmployeeStats {
  servedToday: number;
  averageServiceTime: number;
  customerSatisfaction: number;
  totalRevenue: number;
}

// Define ViewModel interface
export interface EmployeeDashboardViewModel {
  employeeName: string;
  currentQueue: CurrentQueue | null;
  nextQueues: NextQueue[];
  stats: EmployeeStats;
  isOnDuty: boolean;
  shiftStartTime: string;
  totalWaitingQueues: number;
}

// Main Presenter class
export class EmployeeDashboardPresenter extends BaseShopPresenter {
  constructor(logger: Logger, shopService: IShopService) {
    super(logger, shopService);
  }

  async getViewModel(shopId: string): Promise<EmployeeDashboardViewModel> {
    try {
      this.logger.info('EmployeeDashboardPresenter: Getting view model for shop', { shopId });

      // Mock data - replace with actual service calls
      const currentQueue = this.getCurrentQueue();
      const nextQueues = this.getNextQueues();
      const stats = this.getEmployeeStats();

      return {
        employeeName: 'สมชาย ใจดี',
        currentQueue,
        nextQueues,
        stats,
        isOnDuty: true,
        shiftStartTime: '08:00',
        totalWaitingQueues: 8,
      };
    } catch (error) {
      this.logger.error('EmployeeDashboardPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Private methods for data preparation
  private getCurrentQueue(): CurrentQueue | null {
    return {
      id: '1',
      queueNumber: 'A016',
      customerName: 'สมหญิง รักดี',
      customerPhone: '082-345-6789',
      services: ['กาแฟพิเศษ', 'เค้ก'],
      startTime: '10:35',
      estimatedDuration: 15,
    };
  }

  private getNextQueues(): NextQueue[] {
    return [
      {
        id: '2',
        queueNumber: 'A017',
        customerName: 'สมศรี มีสุข',
        services: ['เซ็ตอาหารเช้า'],
        waitTime: 5,
      },
      {
        id: '3',
        queueNumber: 'A018',
        customerName: 'สมปอง ดีใจ',
        services: ['กาแฟ', 'ขนมปัง'],
        waitTime: 12,
      },
      {
        id: '4',
        queueNumber: 'A019',
        customerName: 'สมใส ยิ้มแย้ม',
        services: ['น้ำผลไม้'],
        waitTime: 18,
      },
    ];
  }

  private getEmployeeStats(): EmployeeStats {
    return {
      servedToday: 23,
      averageServiceTime: 12,
      customerSatisfaction: 4.8,
      totalRevenue: 8450,
    };
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      'หน้าหลักพนักงาน',
      'ระบบจัดการคิวสำหรับพนักงานและติดตามการให้บริการ'
    );
  }
}

// Factory class
export class EmployeeDashboardPresenterFactory {
  static async create(): Promise<EmployeeDashboardPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const shopService = serverContainer.resolve<IShopService>('ShopService');
    return new EmployeeDashboardPresenter(logger, shopService);
  }
}
