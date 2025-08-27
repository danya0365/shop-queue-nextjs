import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define interfaces for data structures
export interface ServingQueue {
  id: string;
  queueNumber: string;
  customerName: string;
  customerPhone: string;
  services: ServiceItem[];
  totalPrice: number;
  startTime: string;
  estimatedDuration: number;
  specialRequests?: string;
  priority: 'normal' | 'high' | 'vip';
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  estimatedTime: number;
}

export interface ServeAction {
  id: string;
  label: string;
  icon: string;
  color: string;
}

// Define ViewModel interface
export interface EmployeeServeViewModel {
  currentQueue: ServingQueue | null;
  serviceActions: ServeAction[];
  employeeName: string;
  stationNumber: number;
  isOnDuty: boolean;
}

// Main Presenter class
export class EmployeeServePresenter {
  constructor(private readonly logger: Logger) {}

  async getViewModel(shopId: string): Promise<EmployeeServeViewModel> {
    try {
      this.logger.info('EmployeeServePresenter: Getting view model for shop', { shopId });
      
      // Mock data - replace with actual service calls
      const currentQueue = this.getCurrentQueue();
      const serviceActions = this.getServiceActions();
      
      return {
        currentQueue,
        serviceActions,
        employeeName: 'สมชาย ใจดี',
        stationNumber: 1,
        isOnDuty: true,
      };
    } catch (error) {
      this.logger.error('EmployeeServePresenter: Error getting view model', error);
      throw error;
    }
  }

  // Private methods for data preparation
  private getCurrentQueue(): ServingQueue | null {
    return {
      id: '1',
      queueNumber: 'A016',
      customerName: 'สมหญิง รักดี',
      customerPhone: '082-345-6789',
      services: [
        {
          id: '1',
          name: 'กาแฟลาเต้',
          price: 85,
          quantity: 1,
          status: 'preparing',
          estimatedTime: 7,
        },
        {
          id: '2',
          name: 'เค้กช็อกโกแลต',
          price: 120,
          quantity: 1,
          status: 'pending',
          estimatedTime: 3,
        },
      ],
      totalPrice: 205,
      startTime: '10:35',
      estimatedDuration: 15,
      specialRequests: 'ไม่ใส่น้ำตาล, เพิ่มน้ำแข็ง',
      priority: 'normal',
    };
  }

  private getServiceActions(): ServeAction[] {
    return [
      {
        id: 'start_service',
        label: 'เริ่มเตรียม',
        icon: '▶️',
        color: 'bg-green-500',
      },
      {
        id: 'mark_ready',
        label: 'พร้อมเสิร์ฟ',
        icon: '✅',
        color: 'bg-blue-500',
      },
      {
        id: 'complete_service',
        label: 'เสร็จสิ้น',
        icon: '🎉',
        color: 'bg-purple-500',
      },
      {
        id: 'need_help',
        label: 'ขอความช่วยเหลือ',
        icon: '🆘',
        color: 'bg-red-500',
      },
      {
        id: 'add_note',
        label: 'เพิ่มหมายเหตุ',
        icon: '📝',
        color: 'bg-gray-500',
      },
    ];
  }

  // Metadata generation
  generateMetadata() {
    return {
      title: 'ให้บริการ - พนักงาน | Shop Queue',
      description: 'หน้าจอการให้บริการและติดตามความคืบหน้าของคิว',
    };
  }
}

// Factory class
export class EmployeeServePresenterFactory {
  static async create(): Promise<EmployeeServePresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    return new EmployeeServePresenter(logger);
  }
}
