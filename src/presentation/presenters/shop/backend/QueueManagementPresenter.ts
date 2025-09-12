import { SubscriptionLimits, UsageStatsDto } from '@/src/application/dtos/subscription-dto';
import { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import { IShopService } from '@/src/application/services/shop/ShopService';
import { ISubscriptionService } from '@/src/application/services/subscription/SubscriptionService';
import { getServerContainer } from '@/src/di/server-container';
import { Container } from '@/src/di/container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BaseShopBackendPresenter } from './BaseShopBackendPresenter';
import { getClientContainer } from '@/src/di/client-container';

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
  // ข้อมูลคิวพร้อม pagination
  queues: {
    data: QueueItem[];        // ข้อมูลคิว (เฉพาะหน้าปัจจุบัน)
    pagination: {              // ข้อมูล pagination
      currentPage: number;        // หน้าปัจจุบัน
      totalPages: number;         // จำนวนหน้าทั้งหมด
      perPage: number;           // จำนวนรายการต่อหน้า
      totalCount: number;        // จำนวนรายการทั้งหมด
      hasNext: boolean;          // มีหน้าถัดไปหรือไม่
      hasPrev: boolean;          // มีหน้าก่อนหน้าหรือไม่
    };
  };
  
  // ข้อมูลสถิติ (ยังคงเดิม)
  waitingCount: number;
  servingCount: number;
  completedToday: number;
  averageWaitTime: number;
  filters: QueueFilter;
  subscription: {
    limits: SubscriptionLimits;
    usage: UsageStatsDto;
    canCreateQueue: boolean;
    dailyLimitReached: boolean;
  };
}

// Main Presenter class
export class QueueManagementPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
  ) { super(logger, shopService, authService, profileService, subscriptionService); }

  async getViewModel(
    shopId: string,
    page: number = 1,
    perPage: number = 10,
    filters?: {
      status?: string;
      priority?: string;
      search?: string;
    }
  ): Promise<QueueManagementViewModel> {
    try {
      this.logger.info('QueueManagementPresenter: Getting view model', {
        shopId,
        page,
        perPage,
        filters,
      });

      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error("Profile not found");
      }

      const subscriptionPlan = await this.getSubscriptionPlan(profile.id, profile.role);
      const limits = this.mapSubscriptionPlanToLimits(subscriptionPlan);
      const usage = await this.getUsageStats(profile.id);

      // Mock data - replace with actual service calls
      const allQueues = this.getQueueData();
      const stats = this.calculateStats(allQueues);

      // Apply filters
      let filteredQueues = allQueues;
      if (filters) {
        if (filters.status && filters.status !== 'all') {
          filteredQueues = filteredQueues.filter(q => q.status === filters.status);
        }
        if (filters.priority && filters.priority !== 'all') {
          filteredQueues = filteredQueues.filter(q => q.priority === filters.priority);
        }
        if (filters.search) {
          filteredQueues = filteredQueues.filter(q => 
            q.customerName.toLowerCase().includes(filters.search!.toLowerCase()) ||
            q.queueNumber.toLowerCase().includes(filters.search!.toLowerCase())
          );
        }
      }

      // Apply pagination
      const totalCount = filteredQueues.length;
      const totalPages = Math.ceil(totalCount / perPage);
      const currentPage = Math.min(page, totalPages || 1);
      const startIndex = (currentPage - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedQueues = filteredQueues.slice(startIndex, endIndex);

      const dailyLimitReached = limits.maxQueuesPerDay !== null && usage.todayQueues >= limits.maxQueuesPerDay;
      const canCreateQueue = !dailyLimitReached;

      return {
        queues: {
          data: paginatedQueues,
          pagination: {
            currentPage,
            totalPages,
            perPage,
            totalCount,
            hasNext: currentPage < totalPages,
            hasPrev: currentPage > 1,
          },
        },
        waitingCount: stats.waiting,
        servingCount: stats.serving,
        completedToday: stats.completed,
        averageWaitTime: 15,
        filters: {
          status: filters?.status || 'all',
          priority: filters?.priority || 'all',
          search: filters?.search || '',
        },
        subscription: {
          limits,
          usage,
          canCreateQueue,
          dailyLimitReached
        }
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
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      'จัดการคิว',
      'ระบบจัดการคิวลูกค้าและติดตามสถานะการให้บริการ',
    );
  }
}

// Base Factory class for reducing code duplication
abstract class BaseQueueManagementPresenterFactory {
  protected static async createPresenter(
    getContainer: () => Promise<Container> | Container
  ): Promise<QueueManagementPresenter> {
    try {
      const container = await getContainer();
      const logger = container.resolve<Logger>('Logger');
      const shopService = container.resolve<IShopService>('ShopService');
      const authService = container.resolve<IAuthService>('AuthService');
      const profileService = container.resolve<IProfileService>('ProfileService');
      const subscriptionService = container.resolve<ISubscriptionService>('SubscriptionService');
      
      return new QueueManagementPresenter(logger, shopService, authService, profileService, subscriptionService);
    } catch (error) {
      throw new Error(
        `Failed to create QueueManagementPresenter: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }
}

// Factory class for server-side
export class QueueManagementPresenterFactory extends BaseQueueManagementPresenterFactory {
  static async create(): Promise<QueueManagementPresenter> {
    return this.createPresenter(() => getServerContainer());
  }
}

// Factory class for client-side
export class ClientQueueManagementPresenterFactory extends BaseQueueManagementPresenterFactory {
  static async create(): Promise<QueueManagementPresenter> {
    return this.createPresenter(() => getClientContainer());
  }
}
