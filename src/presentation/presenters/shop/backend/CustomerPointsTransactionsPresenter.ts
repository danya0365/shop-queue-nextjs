import type { CustomerPointsTransaction, CustomerPointsTransactionBackendService, CustomerPointsTransactionStats } from '@/src/application/services/shop/backend/customer-points-transactions-backend-service';
import { IShopService } from '@/src/application/services/shop/ShopService';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import { BaseShopPresenter } from '../BaseShopPresenter';

// Define ViewModel interface
export interface CustomerPointsTransactionsViewModel {
  transactions: CustomerPointsTransaction[];
  stats: CustomerPointsTransactionStats;
  transactionTypes: Array<{ value: string; label: string; count: number }>;
  monthlyTrends: Array<{ month: string; monthLabel: string; earned: number; redeemed: number; net: number }>;
}

// Main Presenter class
export class CustomerPointsTransactionsPresenter extends BaseShopPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    private readonly customerPointsTransactionBackendService: CustomerPointsTransactionBackendService,
  ) {
    super(logger, shopService);
  }

  async getViewModel(shopId: string): Promise<CustomerPointsTransactionsViewModel> {
    try {
      this.logger.info('CustomerPointsTransactionsPresenter: Getting view model', { shopId });

      // Get transactions data and stats
      const [transactions, stats] = await Promise.all([
        this.customerPointsTransactionBackendService.getTransactions(shopId),
        this.customerPointsTransactionBackendService.getTransactionStats(shopId)
      ]);

      // Prepare transaction types with labels and counts
      const transactionTypeLabels = {
        earned: 'ได้รับแต้ม',
        redeemed: 'ใช้แต้ม',
        expired: 'แต้มหมดอายุ',
        adjusted: 'ปรับแต้ม'
      };

      const transactionTypes = Object.entries(stats.transactionsByType).map(([type, count]) => ({
        value: type,
        label: transactionTypeLabels[type as keyof typeof transactionTypeLabels] || type,
        count
      }));

      // Prepare monthly trends with Thai month labels
      const monthLabels = {
        '01': 'ม.ค.', '02': 'ก.พ.', '03': 'มี.ค.', '04': 'เม.ย.',
        '05': 'พ.ค.', '06': 'มิ.ย.', '07': 'ก.ค.', '08': 'ส.ค.',
        '09': 'ก.ย.', '10': 'ต.ค.', '11': 'พ.ย.', '12': 'ธ.ค.'
      };

      const monthlyTrends = stats.transactionsByMonth.map(monthData => {
        const [year, month] = monthData.month.split('-');
        const monthLabel = `${monthLabels[month as keyof typeof monthLabels]} ${parseInt(year) + 543}`;
        const net = monthData.earned - monthData.redeemed;

        return {
          month: monthData.month,
          monthLabel,
          earned: monthData.earned,
          redeemed: monthData.redeemed,
          net
        };
      });

      return {
        transactions,
        stats,
        transactionTypes,
        monthlyTrends,
      };
    } catch (error) {
      this.logger.error('CustomerPointsTransactionsPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(shopId, 'ประวัติการใช้แต้ม', 'ดูประวัติการทำรายการแต้มลูกค้า การได้รับแต้ม การใช้แต้ม และสถิติการใช้งาน');
  }
}

// Factory class
export class CustomerPointsTransactionsPresenterFactory {
  static async create(): Promise<CustomerPointsTransactionsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const customerPointsTransactionBackendService = serverContainer.resolve<CustomerPointsTransactionBackendService>('CustomerPointsTransactionBackendService');
    const shopService = serverContainer.resolve<IShopService>('ShopService');
    return new CustomerPointsTransactionsPresenter(logger, shopService, customerPointsTransactionBackendService);
  }
}
