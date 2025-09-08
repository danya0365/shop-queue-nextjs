import type { CreatePaymentParams, PaginatedPaymentsDTO, PaymentDTO, PaymentMethodStatsDTO, PaymentsDataDTO, PaymentStatsDTO, UpdatePaymentParams } from '@/src/application/dtos/shop/backend/payments-dto';
import { GetPaymentsPaginatedInput } from '@/src/application/dtos/shop/backend/payments-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IShopBackendPaymentsService {
  getPaymentsData(page?: number, perPage?: number): Promise<PaymentsDataDTO>;
  getPaymentStats(): Promise<PaymentStatsDTO>;
  getPaymentMethodStats(): Promise<PaymentMethodStatsDTO>;
  getPaymentById(id: string): Promise<PaymentDTO>;
  createPayment(params: CreatePaymentParams): Promise<PaymentDTO>;
  updatePayment(id: string, params: UpdatePaymentParams): Promise<PaymentDTO>;
  deletePayment(id: string): Promise<boolean>;
}

export class ShopBackendPaymentsService implements IShopBackendPaymentsService {
  constructor(
    private readonly getPaymentsPaginatedUseCase: IUseCase<GetPaymentsPaginatedInput, PaginatedPaymentsDTO>,
    private readonly getPaymentStatsUseCase: IUseCase<void, PaymentStatsDTO>,
    private readonly getPaymentMethodStatsUseCase: IUseCase<void, PaymentMethodStatsDTO>,
    private readonly getPaymentByIdUseCase: IUseCase<string, PaymentDTO>,
    private readonly createPaymentUseCase: IUseCase<CreatePaymentParams, PaymentDTO>,
    private readonly updatePaymentUseCase: IUseCase<UpdatePaymentParams, PaymentDTO>,
    private readonly deletePaymentUseCase: IUseCase<string, boolean>,
    private readonly logger: Logger
  ) { }

  /**
   * Get payments data including paginated payments and statistics
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @returns Payments data DTO
   */
  async getPaymentsData(page: number = 1, perPage: number = 10): Promise<PaymentsDataDTO> {
    try {
      this.logger.info('Getting payments data', { page, perPage });

      // Get payments and stats in parallel
      const [paymentsResult, stats] = await Promise.all([
        this.getPaymentsPaginatedUseCase.execute({ page, limit: perPage }),
        this.getPaymentStatsUseCase.execute()
      ]);

      return {
        payments: paymentsResult.data,
        stats,
        totalCount: paymentsResult.pagination.totalItems,
        currentPage: paymentsResult.pagination.currentPage,
        perPage: paymentsResult.pagination.itemsPerPage
      };
    } catch (error) {
      this.logger.error('Error getting payments data', { error, page, perPage });
      throw error;
    }
  }

  /**
   * Get payment statistics
   * @returns Payment stats DTO
   */
  async getPaymentStats(): Promise<PaymentStatsDTO> {
    try {
      this.logger.info('Getting payment stats');

      const stats = await this.getPaymentStatsUseCase.execute();
      return stats;
    } catch (error) {
      this.logger.error('Error getting payment stats', { error });
      throw error;
    }
  }

  /**
   * Get payment method statistics
   * @returns Payment method stats DTO
   */
  async getPaymentMethodStats(): Promise<PaymentMethodStatsDTO> {
    try {
      this.logger.info('Getting payment method stats');

      const stats = await this.getPaymentMethodStatsUseCase.execute();
      return stats;
    } catch (error) {
      this.logger.error('Error getting payment method stats', { error });
      throw error;
    }
  }

  /**
   * Get a payment by ID
   * @param id Payment ID
   * @returns Payment DTO
   */
  async getPaymentById(id: string): Promise<PaymentDTO> {
    try {
      this.logger.info('Getting payment by ID', { id });

      const result = await this.getPaymentByIdUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error getting payment by ID', { error, id });
      throw error;
    }
  }

  /**
   * Create a new payment
   * @param params Payment creation parameters
   * @returns Created payment DTO
   */
  async createPayment(params: CreatePaymentParams): Promise<PaymentDTO> {
    try {
      this.logger.info('Creating payment', { params });

      const result = await this.createPaymentUseCase.execute(params);
      return result;
    } catch (error) {
      this.logger.error('Error creating payment', { error, params });
      throw error;
    }
  }

  /**
   * Update an existing payment
   * @param id Payment ID
   * @param params Payment update parameters
   * @returns Updated payment DTO
   */
  async updatePayment(id: string, params: UpdatePaymentParams): Promise<PaymentDTO> {
    try {
      this.logger.info('Updating payment', { id, params });

      const updateData = { ...params, id };
      const result = await this.updatePaymentUseCase.execute(updateData);
      return result;
    } catch (error) {
      this.logger.error('Error updating payment', { error, id, params });
      throw error;
    }
  }

  /**
   * Delete a payment
   * @param id Payment ID
   * @returns Success flag
   */
  async deletePayment(id: string): Promise<boolean> {
    try {
      this.logger.info('Deleting payment', { id });

      const result = await this.deletePaymentUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error deleting payment', { error, id });
      throw error;
    }
  }
}
