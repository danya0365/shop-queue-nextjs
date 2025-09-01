import type { PaymentsDataDTO } from '@/src/application/dtos/backend/payments-dto';
import type { IBackendPaymentsService } from '@/src/application/services/backend/BackendPaymentsService';
import { getBackendContainer } from '@/src/di/backend-container';
import type { Logger } from '@/src/domain/interfaces/logger';

// Define ViewModel interface
export interface PaymentsViewModel {
  paymentsData: PaymentsDataDTO;
}

// Main Presenter class
export class PaymentsPresenter {
  constructor(
    private readonly backendPaymentsService: IBackendPaymentsService,
    private readonly logger: Logger
  ) { }

  async getViewModel(): Promise<PaymentsViewModel> {
    try {
      this.logger.info('PaymentsPresenter: Getting view model');

      const paymentsData = await this.backendPaymentsService.getPaymentsData();

      return {
        paymentsData
      };
    } catch (error) {
      this.logger.error('PaymentsPresenter: Error getting view model', error);
      throw error;
    }
  }

  getMetadata() {
    return {
      title: 'จัดการการชำระเงิน | Shop Queue Admin',
      description: 'ระบบจัดการการชำระเงินและติดตามสถานะการจ่ายเงินสำหรับผู้ดูแลระบบ Shop Queue',
      keywords: 'shop queue, การชำระเงิน, จัดการการชำระเงิน, admin, backend, payment',
    };
  }
}

// Factory class
export class PaymentsPresenterFactory {
  static async create(): Promise<PaymentsPresenter> {
    const serverContainer = await getBackendContainer();
    const logger = serverContainer.resolve<Logger>('Logger');
    const backendPaymentsService = serverContainer.resolve<IBackendPaymentsService>('BackendPaymentsService');
    return new PaymentsPresenter(backendPaymentsService, logger);
  }
}
