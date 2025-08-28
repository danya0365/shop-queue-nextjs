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
  subscription: {
    limits: SubscriptionLimits;
    usage: UsageStatsDto;
    hasDataRetentionLimit: boolean;
    dataRetentionDays: number;
    isFreeTier: boolean;
  };
}

// Main Presenter class
export class BackendDashboardPresenter extends BaseShopPresenter {
  constructor(
    logger: Logger,
    private readonly subscriptionService: ISubscriptionService,
    private readonly authService: IAuthService,
    private readonly profileService: IProfileService,
  ) { super(logger); }

  async getViewModel(shopId: string): Promise<BackendDashboardViewModel> {
    try {
      this.logger.info('BackendDashboardPresenter: Getting view model for shop', { shopId });

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
        subscription: {
          limits,
          usage,
          hasDataRetentionLimit: false,
          dataRetentionDays: 365,
          isFreeTier: false,
        },
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
    this.logger.info('BackendDashboardPresenter: Generating metadata for shop', { shopId });
    return this.generateShopMetadata(
      shopId,
      'แดชบอร์ดจัดการร้าน',
      'ระบบจัดการร้านค้าและติดตามสถิติการให้บริการแบบเรียลไทม์',
    );
  }
}

// Factory class
export class BackendDashboardPresenterFactory {
  static async create(): Promise<BackendDashboardPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const subscriptionService = serverContainer.resolve<ISubscriptionService>('SubscriptionService');
    const authService = serverContainer.resolve<IAuthService>('AuthService');
    const profileService = serverContainer.resolve<IProfileService>('ProfileService');
    return new BackendDashboardPresenter(logger, subscriptionService, authService, profileService);
  }
}
