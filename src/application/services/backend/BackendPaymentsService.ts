import type { PaymentsDataDTO } from '@/src/application/dtos/backend/payments-dto';
import type { IGetPaymentsUseCase } from '@/src/application/usecases/backend/payments/GetPaymentsUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IBackendPaymentsService {
  getPaymentsData(): Promise<PaymentsDataDTO>;
}

export class BackendPaymentsService implements IBackendPaymentsService {
  constructor(
    private readonly getPaymentsUseCase: IGetPaymentsUseCase,
    private readonly logger: Logger
  ) { }

  async getPaymentsData(): Promise<PaymentsDataDTO> {
    try {
      this.logger.info('BackendPaymentsService: Getting payments data');

      const paymentsData = await this.getPaymentsUseCase.execute();

      this.logger.info('BackendPaymentsService: Successfully retrieved payments data');
      return paymentsData;
    } catch (error) {
      this.logger.error('BackendPaymentsService: Error getting payments data', error);
      throw error;
    }
  }
}
