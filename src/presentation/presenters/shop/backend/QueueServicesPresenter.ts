import { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import type { QueueService, QueueServiceBackendService, QueueServiceStats } from '@/src/application/services/shop/backend/queue-services-backend-service';
import { IShopService } from '@/src/application/services/shop/ShopService';
import { ISubscriptionService } from '@/src/application/services/subscription/SubscriptionService';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { Metadata } from 'next';
import { BaseShopBackendPresenter } from './BaseShopBackendPresenter';

// Define ViewModel interface
export interface QueueServicesViewModel {
  queueServices: QueueService[];
  stats: QueueServiceStats;
  departments: Array<{ id: string; name: string; serviceCount: number }>;
  busyDepartments: string[];
  availableDepartments: string[];
}

// Main Presenter class
export class QueueServicesPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly queueServiceBackendService: QueueServiceBackendService,
  ) {
    super(logger, shopService, authService, profileService, subscriptionService);
  }

  async getViewModel(shopId: string): Promise<QueueServicesViewModel> {
    try {
      this.logger.info('QueueServicesPresenter: Getting view model', { shopId });

      // Get queue services data and stats
      const [queueServices, stats] = await Promise.all([
        this.queueServiceBackendService.getQueueServices(shopId),
        this.queueServiceBackendService.getQueueServiceStats(shopId)
      ]);

      // Calculate department statistics
      const departmentMap = new Map<string, { id: string; name: string; services: QueueService[] }>();

      queueServices.forEach(service => {
        if (!departmentMap.has(service.departmentId)) {
          departmentMap.set(service.departmentId, {
            id: service.departmentId,
            name: service.departmentName,
            services: []
          });
        }
        departmentMap.get(service.departmentId)!.services.push(service);
      });

      const departments = Array.from(departmentMap.values()).map(dept => ({
        id: dept.id,
        name: dept.name,
        serviceCount: dept.services.length
      }));

      // Identify busy and available departments
      const busyDepartments: string[] = [];
      const availableDepartments: string[] = [];

      departmentMap.forEach((dept) => {
        const totalQueue = dept.services.reduce((sum, service) => sum + service.currentQueue, 0);
        const totalCapacity = dept.services.reduce((sum, service) => sum + service.maxCapacity, 0);
        const activeServices = dept.services.filter(service => service.isActive).length;

        if (activeServices === 0) {
          // Department has no active services
          return;
        }

        const utilizationRate = totalCapacity > 0 ? totalQueue / totalCapacity : 0;

        if (utilizationRate > 0.7) {
          busyDepartments.push(dept.name);
        } else if (utilizationRate < 0.3) {
          availableDepartments.push(dept.name);
        }
      });

      return {
        queueServices,
        stats,
        departments,
        busyDepartments,
        availableDepartments,
      };
    } catch (error) {
      this.logger.error('QueueServicesPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Metadata generation
  async generateMetadata(shopId: string): Promise<Metadata> {
    return this.generateShopMetadata(
      shopId,
      'จัดการคิวบริการ',
      'จัดการคิวบริการของร้าน ตั้งค่าความจุ เวลารอ และสถานะบริการต่างๆ',
    );
  }
}

// Factory class
export class QueueServicesPresenterFactory {
  static async create(): Promise<QueueServicesPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const queueServiceBackendService = serverContainer.resolve<QueueServiceBackendService>('QueueServiceBackendService');
    const shopService = serverContainer.resolve<IShopService>('ShopService');
    const authService = serverContainer.resolve<IAuthService>('AuthService');
    const profileService = serverContainer.resolve<IProfileService>('ProfileService');
    const subscriptionService = serverContainer.resolve<ISubscriptionService>('SubscriptionService');
    return new QueueServicesPresenter(logger, shopService, authService, profileService, subscriptionService, queueServiceBackendService);
  }
}
