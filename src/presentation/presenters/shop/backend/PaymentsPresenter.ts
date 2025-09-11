import type { IAuthService } from "@/src/application/interfaces/auth-service.interface";
import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { IShopBackendPaymentsService } from "@/src/application/services/shop/backend/BackendPaymentsService";
import { IShopService } from "@/src/application/services/shop/ShopService";
import { ISubscriptionService } from "@/src/application/services/subscription/SubscriptionService";
import { getServerContainer } from "@/src/di/server-container";
import type { Logger } from "@/src/domain/interfaces/logger";
import { BaseShopBackendPresenter } from "./BaseShopBackendPresenter";

// Define interfaces for data structures
export interface PaymentItem {
  id: string;
  queueNumber: string;
  customerName: string;
  totalAmount: number;
  paidAmount: number | null;
  paymentMethod: string | null;
  paymentStatus: string;
  paymentDate: string | null;
  processedByEmployeeName: string | null;
  createdAt: string;
}

export interface PaymentStats {
  totalPayments: number;
  totalRevenue: number;
  paidPayments: number;
  unpaidPayments: number;
  partialPayments: number;
  todayRevenue: number;
  averagePaymentAmount: number;
  mostUsedPaymentMethod: string;
}

export interface PaymentMethodStats {
  cash: {
    count: number;
    percentage: number;
    totalAmount: number;
  };
  card: {
    count: number;
    percentage: number;
    totalAmount: number;
  };
  qr: {
    count: number;
    percentage: number;
    totalAmount: number;
  };
  transfer: {
    count: number;
    percentage: number;
    totalAmount: number;
  };
  totalTransactions: number;
}

// Define ViewModel interface
export interface PaymentsViewModel {
  shopId: string;
  payments: PaymentItem[];
  stats: PaymentStats;
  methodStats: PaymentMethodStats;
  totalCount: number;
  currentPage: number;
  perPage: number;
}

// Main Presenter class
export class PaymentsPresenter extends BaseShopBackendPresenter {
  constructor(
    logger: Logger,
    shopService: IShopService,
    authService: IAuthService,
    profileService: IProfileService,
    subscriptionService: ISubscriptionService,
    private readonly paymentsService: IShopBackendPaymentsService
  ) {
    super(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService
    );
  }

  async getViewModel(
    shopId: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<PaymentsViewModel> {
    try {
      this.logger.info("PaymentsPresenter: Getting view model for shop", {
        shopId,
        page,
        perPage,
      });

      const user = await this.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const profile = await this.getActiveProfile(user);
      if (!profile) {
        throw new Error("Profile not found");
      }

      // Get payments data and method stats in parallel
      const [paymentsData, methodStats] = await Promise.all([
        this.paymentsService.getPaymentsData(page, perPage),
        this.paymentsService.getPaymentMethodStats(),
      ]);

      // Transform payments data
      const payments: PaymentItem[] = paymentsData.payments.map((payment) => ({
        id: payment.id,
        queueNumber: payment.queueNumber,
        customerName: payment.customerName,
        totalAmount: payment.totalAmount,
        paidAmount: payment.paidAmount,
        paymentMethod: payment.paymentMethod,
        paymentStatus: payment.paymentStatus,
        paymentDate: payment.paymentDate,
        processedByEmployeeName: payment.processedByEmployeeName,
        createdAt: payment.createdAt,
      }));

      // Transform stats
      const stats: PaymentStats = {
        totalPayments: paymentsData.stats.totalPayments,
        totalRevenue: paymentsData.stats.totalRevenue,
        paidPayments: paymentsData.stats.paidPayments,
        unpaidPayments: paymentsData.stats.unpaidPayments,
        partialPayments: paymentsData.stats.partialPayments,
        todayRevenue: paymentsData.stats.todayRevenue,
        averagePaymentAmount: paymentsData.stats.averagePaymentAmount,
        mostUsedPaymentMethod: paymentsData.stats.mostUsedPaymentMethod,
      };

      return {
        shopId,
        payments,
        stats,
        methodStats,
        totalCount: paymentsData.totalCount,
        currentPage: paymentsData.currentPage,
        perPage: paymentsData.perPage,
      };
    } catch (error) {
      this.logger.error("PaymentsPresenter: Error getting view model", error);
      throw error;
    }
  }

  // Metadata generation
  async generateMetadata(shopId: string) {
    return this.generateShopMetadata(
      shopId,
      "จัดการการชำระเงิน",
      "ระบบจัดการการชำระเงินและติดตามสถานะการชำระเงินของลูกค้า"
    );
  }
}

// Factory class
export class PaymentsPresenterFactory {
  static async create(): Promise<PaymentsPresenter> {
    const serverContainer = await getServerContainer();
    const logger = serverContainer.resolve<Logger>("Logger");
    const subscriptionService = serverContainer.resolve<ISubscriptionService>(
      "SubscriptionService"
    );
    const authService = serverContainer.resolve<IAuthService>("AuthService");
    const profileService =
      serverContainer.resolve<IProfileService>("ProfileService");
    const shopService = serverContainer.resolve<IShopService>("ShopService");
    const paymentsService =
      serverContainer.resolve<IShopBackendPaymentsService>(
        "ShopBackendPaymentsService"
      );
    return new PaymentsPresenter(
      logger,
      shopService,
      authService,
      profileService,
      subscriptionService,
      paymentsService
    );
  }
}
