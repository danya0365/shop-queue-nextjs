import type { PaymentItem, PaymentItemsBackendService } from '@/src/application/services/shop/backend/payment-items-backend-service';
import { getServerContainer } from '@/src/di/server-container';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { Metadata } from 'next';
import { BaseShopPresenter } from '../BaseShopPresenter';

// Define ViewModel interface
export interface PaymentItemsViewModel {
  paymentItems: PaymentItem[];
  totalItems: number;
  totalRevenue: number;
  averageItemValue: number;
  topSellingItems: PaymentItem[];
  itemsByCategory: Record<string, number>;
  revenueByCategory: Record<string, number>;
}

// Main Presenter class
export class PaymentItemsPresenter extends BaseShopPresenter {
  constructor(
    logger: Logger,
    private readonly paymentItemsBackendService: PaymentItemsBackendService,
  ) {
    super(logger);
  }

  async getViewModel(shopId: string): Promise<PaymentItemsViewModel> {
    try {
      this.logger.info('PaymentItemsPresenter: Getting view model', { shopId });

      // Get payment items data
      const paymentItems = await this.paymentItemsBackendService.getPaymentItems(shopId);
      const stats = await this.paymentItemsBackendService.getPaymentItemsStats(shopId);

      // Calculate items by category
      const itemsByCategory: Record<string, number> = {};
      const revenueByCategory: Record<string, number> = {};

      paymentItems.forEach(item => {
        const category = item.serviceCategory || 'อื่นๆ';
        itemsByCategory[category] = (itemsByCategory[category] || 0) + item.quantity;
        revenueByCategory[category] = (revenueByCategory[category] || 0) + item.total;
      });

      return {
        paymentItems,
        totalItems: stats.totalItems,
        totalRevenue: stats.totalRevenue,
        averageItemValue: stats.averageItemValue,
        topSellingItems: stats.topSellingItems,
        itemsByCategory,
        revenueByCategory,
      };
    } catch (error) {
      this.logger.error('PaymentItemsPresenter: Error getting view model', error);
      throw error;
    }
  }

  // Metadata generation
  async generateMetadata(shopId: string): Promise<Metadata> {
    return this.generateShopMetadata(shopId, 'จัดการรายการชำระเงิน', 'จัดการรายการบริการที่ชำระเงิน ดูสถิติการขาย และรายได้');
  }
}

// Factory class
export class PaymentItemsPresenterFactory {
  static async create(): Promise<PaymentItemsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const paymentItemsBackendService = serverContainer.resolve<PaymentItemsBackendService>('PaymentItemsBackendService');
    return new PaymentItemsPresenter(logger, paymentItemsBackendService);
  }
}
