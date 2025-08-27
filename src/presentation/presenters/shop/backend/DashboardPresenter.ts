import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define interfaces for data structures
export interface QueueStats {
  waiting: number;
  serving: number;
  completed: number;
  cancelled: number;
}

export interface RevenueStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  growth: number;
}

export interface EmployeeStats {
  total: number;
  online: number;
  serving: number;
}

export interface RecentActivity {
  id: string;
  type: 'queue_created' | 'queue_served' | 'payment_completed' | 'employee_login';
  message: string;
  timestamp: string;
  icon: string;
}

// Define ViewModel interface
export interface BackendDashboardViewModel {
  queueStats: QueueStats;
  revenueStats: RevenueStats;
  employeeStats: EmployeeStats;
  recentActivities: RecentActivity[];
  shopName: string;
  currentTime: string;
}

// Main Presenter class
export class BackendDashboardPresenter {
  constructor(private readonly logger: Logger) {}

  async getViewModel(shopId: string): Promise<BackendDashboardViewModel> {
    try {
      this.logger.info('BackendDashboardPresenter: Getting view model for shop', { shopId });
      
      // Mock data - replace with actual service calls
      const queueStats = this.getQueueStats();
      const revenueStats = this.getRevenueStats();
      const employeeStats = this.getEmployeeStats();
      const recentActivities = this.getRecentActivities();
      
      return {
        queueStats,
        revenueStats,
        employeeStats,
        recentActivities,
        shopName: 'ร้านกาแฟดีใจ',
        currentTime: new Date().toLocaleString('th-TH'),
      };
    } catch (error) {
      this.logger.error('BackendDashboardPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Private methods for data preparation
  private getQueueStats(): QueueStats {
    return {
      waiting: 12,
      serving: 3,
      completed: 45,
      cancelled: 2,
    };
  }

  private getRevenueStats(): RevenueStats {
    return {
      today: 15420,
      thisWeek: 89350,
      thisMonth: 342150,
      growth: 12.5,
    };
  }

  private getEmployeeStats(): EmployeeStats {
    return {
      total: 8,
      online: 5,
      serving: 3,
    };
  }

  private getRecentActivities(): RecentActivity[] {
    return [
      {
        id: '1',
        type: 'queue_created',
        message: 'ลูกค้าใหม่เข้าคิว - คิวที่ A015',
        timestamp: '2 นาทีที่แล้ว',
        icon: '📝',
      },
      {
        id: '2',
        type: 'payment_completed',
        message: 'ชำระเงินเรียบร้อย - คิวที่ A012 (฿350)',
        timestamp: '5 นาทีที่แล้ว',
        icon: '💳',
      },
      {
        id: '3',
        type: 'queue_served',
        message: 'ให้บริการเสร็จสิ้น - คิวที่ A011',
        timestamp: '8 นาทีที่แล้ว',
        icon: '✅',
      },
      {
        id: '4',
        type: 'employee_login',
        message: 'พนักงาน สมชาย เข้าสู่ระบบ',
        timestamp: '15 นาทีที่แล้ว',
        icon: '👤',
      },
    ];
  }

  // Metadata generation
  generateMetadata() {
    return {
      title: 'แดชบอร์ดจัดการร้าน | Shop Queue',
      description: 'ระบบจัดการร้านค้าและติดตามสถิติการให้บริการแบบเรียลไทม์',
    };
  }
}

// Factory class
export class BackendDashboardPresenterFactory {
  static async create(): Promise<BackendDashboardPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    return new BackendDashboardPresenter(logger);
  }
}
