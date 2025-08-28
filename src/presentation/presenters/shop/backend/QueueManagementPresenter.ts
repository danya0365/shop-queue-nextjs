import { AuthUserDto } from '@/src/application/dtos/auth-dto';
import { ProfileDto } from '@/src/application/dtos/profile-dto';
import { SubscriptionLimits, UsageStatsDto } from '@/src/application/dtos/subscription-dto';
import { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import { ISubscriptionService } from '@/src/application/interfaces/subscription-service.interface';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BaseShopPresenter } from '../BaseShopPresenter';

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
  subscription: {
    limits: SubscriptionLimits;
    usage: UsageStatsDto;
    canCreateQueue: boolean;
    dailyLimitReached: boolean;
  };
}

// Main Presenter class
export class QueueManagementPresenter extends BaseShopPresenter {
  constructor(
    logger: Logger,
    private readonly subscriptionService: ISubscriptionService,
    private readonly authService: IAuthService,
    private readonly profileService: IProfileService,
  ) { super(logger); }

  async getViewModel(shopId: string): Promise<QueueManagementViewModel> {
    try {
      this.logger.info('QueueManagementPresenter: Getting view model for shop', { shopId });

      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error("Profile not found");
      }

      const tier = this.subscriptionService.getTierByRole(profile.role);
      const limits = await this.subscriptionService.getLimitsByTier(tier);
      const usage = await this.subscriptionService.getUsageStats(profile.id, shopId);

      // Mock data - replace with actual service calls
      const queues = this.getQueueData();
      const stats = this.calculateStats(queues);

      const dailyLimitReached = limits.maxQueuesPerDay !== null && usage.todayQueues >= limits.maxQueuesPerDay;
      const canCreateQueue = !dailyLimitReached;

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

  private async getUser(): Promise<AuthUserDto | null> {
    try {
      return await this.authService.getCurrentUser();
    } catch (err) {
      this.logger.error("Error accessing authentication:", err as Error);
      return null;
    }
  }

  /**
   * Get the current authenticated user
   */
  private async getActiveProfile(user: AuthUserDto): Promise<ProfileDto | null> {
    try {
      return await this.profileService.getActiveProfileByAuthId(user.id);
    } catch (err) {
      this.logger.error("Error accessing authentication:", err as Error);
      return null;
    }
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

// Factory class
export class QueueManagementPresenterFactory {
  static async create(): Promise<QueueManagementPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const subscriptionService = serverContainer.resolve<ISubscriptionService>('SubscriptionService');
    const authService = serverContainer.resolve<IAuthService>('AuthService');
    const profileService = serverContainer.resolve<IProfileService>('ProfileService');
    return new QueueManagementPresenter(logger, subscriptionService, authService, profileService);
  }
}
