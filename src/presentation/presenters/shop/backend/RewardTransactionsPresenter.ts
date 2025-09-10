import { IAuthService } from '@/src/application/interfaces/auth-service.interface';
import { IProfileService } from '@/src/application/interfaces/profile-service.interface';
import type { RewardTransaction, RewardTransactionBackendService, RewardTransactionFilters, RewardTransactionStats } from '@/src/application/services/shop/backend/reward-transactions-backend-service';
import { IShopService } from '@/src/application/services/shop/ShopService';
import { ISubscriptionService } from '@/src/application/services/subscription/SubscriptionService';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { Metadata } from 'next';
import { BaseShopBackendPresenter } from './BaseShopBackendPresenter';

export interface RewardTransactionsViewModel {
  transactions: RewardTransaction[];
  stats: RewardTransactionStats;
  statusOptions: StatusOption[];
  typeOptions: TypeOption[];
  filters: RewardTransactionFilters;
}

export interface StatusOption {
  value: string;
  label: string;
  color: string;
  description: string;
}

export interface TypeOption {
  value: string;
  label: string;
  icon: string;
  description: string;
}

export class RewardTransactionsPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly rewardTransactionService: RewardTransactionBackendService,
  ) {
    super(logger, shopService, authService, profileService, subscriptionService);
  }

  async getViewModel(shopId: string, filters?: RewardTransactionFilters): Promise<RewardTransactionsViewModel> {
    this.logger.info('RewardTransactionsPresenter: Getting view model', { shopId, filters });

    try {
      const [transactions, stats] = await Promise.all([
        this.rewardTransactionService.getRewardTransactions(shopId, filters),
        this.rewardTransactionService.getRewardTransactionStats(shopId, filters),
      ]);

      const statusOptions = this.getStatusOptions();
      const typeOptions = this.getTypeOptions();

      this.logger.info('RewardTransactionsPresenter: View model created', {
        shopId,
        transactionsCount: transactions.length,
        totalTransactions: stats.totalTransactions,
        totalPointsUsed: stats.totalPointsUsed,
      });

      return {
        transactions,
        stats,
        statusOptions,
        typeOptions,
        filters: filters || {},
      };
    } catch (error) {
      this.logger.error('RewardTransactionsPresenter: Error getting view model', {
        shopId,
        filters,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private getStatusOptions(): StatusOption[] {
    return [
      {
        value: 'pending',
        label: 'รอการอนุมัติ',
        color: 'yellow',
        description: 'รอการอนุมัติจากเจ้าหน้าที่',
      },
      {
        value: 'approved',
        label: 'อนุมัติแล้ว',
        color: 'blue',
        description: 'อนุมัติแล้ว รอลูกค้ามาใช้',
      },
      {
        value: 'redeemed',
        label: 'ใช้แล้ว',
        color: 'green',
        description: 'ลูกค้าใช้รางวัลแล้ว',
      },
      {
        value: 'expired',
        label: 'หมดอายุ',
        color: 'gray',
        description: 'หมดอายุแล้ว ไม่สามารถใช้ได้',
      },
      {
        value: 'cancelled',
        label: 'ยกเลิก',
        color: 'red',
        description: 'ยกเลิกการแลกรางวัล',
      },
    ];
  }

  private getTypeOptions(): TypeOption[] {
    return [
      {
        value: 'discount_percentage',
        label: 'ส่วนลดเปอร์เซ็นต์',
        icon: '📊',
        description: 'ส่วนลดตามเปอร์เซ็นต์ของราคาบริการ',
      },
      {
        value: 'discount_amount',
        label: 'ส่วนลดเงินสด',
        icon: '💰',
        description: 'ส่วนลดเป็นจำนวนเงินคงที่',
      },
      {
        value: 'free_service',
        label: 'บริการฟรี',
        icon: '🎁',
        description: 'รับบริการฟรีตามที่กำหนด',
      },
      {
        value: 'gift_item',
        label: 'ของขวัญ',
        icon: '🎀',
        description: 'รับของขวัญหรือผลิตภัณฑ์ฟรี',
      },
      {
        value: 'points_multiplier',
        label: 'คะแนนสะสมเพิ่ม',
        icon: '⭐',
        description: 'รับคะแนนสะสมเพิ่มเป็นหลายเท่า',
      },
    ];
  }

  async generateMetadata(shopId: string): Promise<Metadata> {
    return this.generateShopMetadata(
      shopId,
      'ประวัติการแลกรางวัล',
      'จัดการและติดตามประวัติการแลกรางวัลของลูกค้า ดูสถิติการใช้คะแนนและการให้ส่วนลด',
    );
  }
}

// Factory class
export class RewardTransactionsPresenterFactory {
  static async create(): Promise<RewardTransactionsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const rewardTransactionService = serverContainer.resolve<RewardTransactionBackendService>('RewardTransactionBackendService');
    const shopService = serverContainer.resolve<IShopService>('ShopService');
    const authService = serverContainer.resolve<IAuthService>('AuthService');
    const profileService = serverContainer.resolve<IProfileService>('ProfileService');
    const subscriptionService = serverContainer.resolve<ISubscriptionService>('SubscriptionService');
    return new RewardTransactionsPresenter(logger, shopService, authService, profileService, subscriptionService, rewardTransactionService);
  }
}

