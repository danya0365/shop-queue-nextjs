import { CreatePaymentEntity, PaginatedPaymentsEntity, PaymentEntity, PaymentMethodStatsEntity, PaymentStatsEntity } from "@/src/domain/entities/shop/backend/backend-payment.entity";
import { DatabaseDataSource, FilterOperator, QueryOptions, SortDirection } from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import { ShopBackendPaymentError, ShopBackendPaymentErrorType, ShopBackendPaymentRepository } from "@/src/domain/repositories/shop/backend/backend-payment-repository";
import { SupabaseShopBackendPaymentMapper } from "@/src/infrastructure/mappers/shop/backend/supabase-backend-payment.mapper";
import { PaymentMethodStatsSchema, PaymentSchema, PaymentStatsSchema } from "@/src/infrastructure/schemas/shop/backend/payment.schema";
import { StandardRepository } from "../../base/standard-repository";

// Schema types for database records
type QueueRecord = {
  id: string;
  queue_number: string;
  customer_id: string;
  shop_id: string;
  served_by_employee_id: string | null;
  [key: string]: unknown;
};

type CustomerRecord = {
  id: string;
  name: string;
  [key: string]: unknown;
};

type ShopRecord = {
  id: string;
  name: string;
  [key: string]: unknown;
};

type EmployeeRecord = {
  id: string;
  name: string;
  [key: string]: unknown;
};
type PaymentSchemaRecord = Record<string, unknown> & PaymentSchema;
type PaymentStatsSchemaRecord = Record<string, unknown> & PaymentStatsSchema;
type PaymentMethodStatsSchemaRecord = Record<string, unknown> & PaymentMethodStatsSchema;

/**
 * Supabase implementation of the payment repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseShopBackendPaymentRepository extends StandardRepository implements ShopBackendPaymentRepository {
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger
  ) {
    super(dataSource, logger, "ShopBackendPayment");
  }

  /**
   * Get paginated payments with related data using separate queries for better performance
   * @param params Pagination parameters
   * @returns Paginated payments data
   */
  async getPaginatedPayments(params: PaginationParams): Promise<PaginatedPaymentsEntity> {
    try {
      const { page, limit } = params;
      const offset = (page - 1) * limit;

      // Step 1: Get payments with pagination
      const paymentsQuery: QueryOptions = {
        select: ['*'],
        sort: [{ field: 'created_at', direction: SortDirection.DESC }],
        pagination: {
          limit,
          offset
        }
      };

      const payments = await this.dataSource.getAdvanced<PaymentSchemaRecord>(
        'payments',
        paymentsQuery
      );

      if (payments.length === 0) {
        const totalItems = await this.dataSource.count('payments');
        const pagination = SupabaseShopBackendPaymentMapper.createPaginationMeta(page, limit, totalItems);
        return { data: [], pagination };
      }

      // Step 2: Get unique queue IDs from payments
      const queueIds = [...new Set(payments.map(p => p.queue_id))];

      // Step 3: Get queues with related data
      const queuesQuery: QueryOptions = {
        select: ['*'],
        filters: [{
          field: 'id',
          operator: FilterOperator.IN,
          value: queueIds
        }]
      };

      const queues = await this.dataSource.getAdvanced<QueueRecord>('queues', queuesQuery);

      // Step 4: Get related data (customers, shops, employees)
      const customerIds = [...new Set(queues.map(q => q.customer_id).filter(Boolean))];
      const shopIds = [...new Set(queues.map(q => q.shop_id).filter(Boolean))];
      const servedByEmployeeIds = [...new Set(queues.map(q => q.served_by_employee_id).filter(Boolean))];
      const processedByEmployeeIds = [...new Set(payments.map(p => p.processed_by_employee_id).filter(Boolean))];
      const allEmployeeIds = [...new Set([...servedByEmployeeIds, ...processedByEmployeeIds])];

      // Parallel queries for better performance
      const [customers, shops, employees] = await Promise.all([
        customerIds.length > 0 ? this.dataSource.getAdvanced<CustomerRecord>('customers', {
          select: ['id', 'name'],
          filters: [{ field: 'id', operator: FilterOperator.IN, value: customerIds }]
        }) : [],
        shopIds.length > 0 ? this.dataSource.getAdvanced<ShopRecord>('shops', {
          select: ['id', 'name'],
          filters: [{ field: 'id', operator: FilterOperator.IN, value: shopIds }]
        }) : [],
        allEmployeeIds.length > 0 ? this.dataSource.getAdvanced<EmployeeRecord>('employees', {
          select: ['id', 'name'],
          filters: [{ field: 'id', operator: FilterOperator.IN, value: allEmployeeIds }]
        }) : []
      ]);

      // Step 5: Create lookup maps for efficient data mapping
      const customerMap = new Map(customers.map(c => [c.id, c]));
      const shopMap = new Map(shops.map(s => [s.id, s]));
      const employeeMap = new Map(employees.map(e => [e.id, e]));
      const queueMap = new Map(queues.map(q => [q.id, q]));

      // Step 6: Map payments with related data
      const mappedPayments = payments.map(payment => {
        const queue = queueMap.get(payment.queue_id);
        const customer = queue ? customerMap.get(queue.customer_id) : null;
        const shop = queue ? shopMap.get(queue.shop_id) : null;
        const processedByEmployee = payment.processed_by_employee_id ? employeeMap.get(payment.processed_by_employee_id) : null;

        const paymentWithJoins: PaymentSchema = {
          ...payment,
          queue_number: queue?.queue_number || '',
          customer_name: customer?.name || '',
          shop_id: shop?.id || '',
          shop_name: shop?.name || '',
          processed_by_employee_name: processedByEmployee?.name || ''
        };

        return SupabaseShopBackendPaymentMapper.toDomain(paymentWithJoins);
      });

      // Get total count
      const totalItems = await this.dataSource.count('payments');
      const pagination = SupabaseShopBackendPaymentMapper.createPaginationMeta(page, limit, totalItems);

      return {
        data: mappedPayments,
        pagination
      };
    } catch (error) {
      if (error instanceof ShopBackendPaymentError) {
        throw error;
      }

      this.logger.error('Error in getPaginatedPayments', { error, params });
      throw new ShopBackendPaymentError(
        ShopBackendPaymentErrorType.OPERATION_FAILED,
        'Failed to get paginated payments',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * Get payment statistics from database
   * @returns Payment statistics
   */
  async getPaymentStats(): Promise<PaymentStatsEntity> {
    try {
      // Use getAdvanced to fetch statistics data
      const queryOptions: QueryOptions = {
        select: ['*'],
        // No joins needed for stats view
        // No pagination needed, we want all stats
      };

      // Assuming a view exists for payment statistics
      // Use extended type that satisfies Record<string, unknown> constraint
      const statsData = await this.dataSource.getAdvanced<PaymentStatsSchemaRecord>(
        'payment_stats_summary_view',
        queryOptions
      );

      if (!statsData || statsData.length === 0) {
        // If no stats are found, return default values
        return {
          totalPayments: 0,
          totalRevenue: 0,
          paidPayments: 0,
          unpaidPayments: 0,
          partialPayments: 0,
          todayRevenue: 0,
          averagePaymentAmount: 0,
          mostUsedPaymentMethod: 'cash'
        };
      }

      // Map database results to domain entity
      // Assuming the first record contains all stats
      return SupabaseShopBackendPaymentMapper.statsToEntity(statsData[0]);
    } catch (error) {
      if (error instanceof ShopBackendPaymentError) {
        throw error;
      }

      this.logger.error('Error in getPaymentStats', { error });
      throw new ShopBackendPaymentError(
        ShopBackendPaymentErrorType.UNKNOWN,
        'An unexpected error occurred while fetching payment statistics',
        'getPaymentStats',
        {},
        error
      );
    }
  }

  /**
   * Get payment method statistics from database
   * @returns Payment method statistics
   */
  async getPaymentMethodStats(): Promise<PaymentMethodStatsEntity> {
    try {
      // Use a custom query to calculate payment method stats
      const methodStatsData = await this.dataSource.getAdvanced<PaymentMethodStatsSchemaRecord>(
        'payment_method_stats_summary_view',
        {
          select: ['*'],
          // No joins needed for stats view
          // No pagination needed, we want all stats
        }
      );

      if (!methodStatsData || methodStatsData.length === 0) {
        // Return default values if no data found
        return {
          cash: { count: 0, percentage: 0, totalAmount: 0 },
          card: { count: 0, percentage: 0, totalAmount: 0 },
          qr: { count: 0, percentage: 0, totalAmount: 0 },
          transfer: { count: 0, percentage: 0, totalAmount: 0 },
          totalTransactions: 0
        };
      }

      // Transform array data to structured format
      const stats = {
        cash: { count: 0, percentage: 0, totalAmount: 0 },
        card: { count: 0, percentage: 0, totalAmount: 0 },
        qr: { count: 0, percentage: 0, totalAmount: 0 },
        transfer: { count: 0, percentage: 0, totalAmount: 0 },
        totalTransactions: 0
      };

      let totalTransactions = 0;

      // Calculate totals first
      methodStatsData.forEach(item => {
        totalTransactions += item.count;
      });

      // Map data to structured format
      methodStatsData.forEach(item => {
        const method = item.payment_method as keyof typeof stats;
        if (method && method !== 'totalTransactions') {
          stats[method] = {
            count: item.count,
            percentage: totalTransactions > 0 ? Math.round((item.count / totalTransactions) * 100) : 0,
            totalAmount: item.total_amount
          };
        }
      });

      stats.totalTransactions = totalTransactions;

      return SupabaseShopBackendPaymentMapper.methodStatsToEntity(stats);
    } catch (error) {
      this.logger.error('Error in getPaymentMethodStats', { error });
      throw new ShopBackendPaymentError(
        ShopBackendPaymentErrorType.OPERATION_FAILED,
        'Failed to get payment method statistics',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * Get a payment by ID with related data using separate queries for better performance
   * @param id Payment ID
   * @returns Payment entity or null if not found
   */
  async getPaymentById(id: string): Promise<PaymentEntity | null> {
    try {
      // Step 1: Get payment by ID
      const payment = await this.dataSource.getById<PaymentSchemaRecord>('payments', id);

      if (!payment) {
        return null;
      }

      // Step 2: Get queue data
      const queue = await this.dataSource.getById<QueueRecord>('queues', payment.queue_id);

      if (!queue) {
        // If queue not found, return payment with minimal data
        const paymentWithJoins: PaymentSchema = {
          ...payment,
          queue_number: '',
          customer_name: '',
          shop_id: '',
          shop_name: '',
          processed_by_employee_name: ''
        };
        return SupabaseShopBackendPaymentMapper.toDomain(paymentWithJoins);
      }

      // Step 3: Get related data in parallel
      const [customer, shop, processedByEmployee] = await Promise.all([
        queue.customer_id ? this.dataSource.getById<CustomerRecord>('customers', queue.customer_id) : null,
        queue.shop_id ? this.dataSource.getById<ShopRecord>('shops', queue.shop_id) : null,
        payment.processed_by_employee_id ? this.dataSource.getById<EmployeeRecord>('employees', payment.processed_by_employee_id) : null
      ]);

      // Step 4: Combine all data
      const paymentWithJoins: PaymentSchema = {
        ...payment,
        queue_number: queue.queue_number || '',
        customer_name: customer?.name || '',
        shop_id: shop?.id || '',
        shop_name: shop?.name || '',
        processed_by_employee_name: processedByEmployee?.name || ''
      };

      // Map database result to domain entity
      return SupabaseShopBackendPaymentMapper.toDomain(paymentWithJoins);
    } catch (error) {
      if (error instanceof ShopBackendPaymentError) {
        throw error;
      }

      this.logger.error('Error in getPaymentById', { error, id });
      throw new ShopBackendPaymentError(
        ShopBackendPaymentErrorType.OPERATION_FAILED,
        'Failed to get payment by ID',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * Create a new payment
   * @param payment Payment data to create
   * @returns Created payment entity
   */
  async createPayment(payment: Omit<CreatePaymentEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentEntity> {
    try {
      // Convert domain entity to database schema
      const paymentSchema = {
        queue_id: payment.queueId,
        queue_number: payment.queueNumber,
        customer_name: payment.customerName,
        total_amount: payment.totalAmount,
        paid_amount: payment.paidAmount,
        payment_method: payment.paymentMethod,
        payment_status: payment.paymentStatus,
        payment_date: payment.paymentDate,
        processed_by_employee_id: payment.processedByEmployeeId,
        shop_id: payment.shopId
      };

      // Create payment in database
      const createdPayment = await this.dataSource.insert<PaymentSchemaRecord>(
        'payments',
        paymentSchema
      );

      if (!createdPayment) {
        throw new ShopBackendPaymentError(
          ShopBackendPaymentErrorType.OPERATION_FAILED,
          'Failed to create payment',
          'createPayment',
          { payment }
        );
      }

      // Get the created payment with joined data
      return this.getPaymentById(createdPayment.id) as Promise<PaymentEntity>;
    } catch (error) {
      if (error instanceof ShopBackendPaymentError) {
        throw error;
      }

      this.logger.error('Error in createPayment', { error, payment });
      throw new ShopBackendPaymentError(
        ShopBackendPaymentErrorType.UNKNOWN,
        'An unexpected error occurred while creating payment',
        'createPayment',
        { payment },
        error
      );
    }
  }

  /**
   * Update an existing payment
   * @param id Payment ID
   * @param payment Payment data to update
   * @returns Updated payment entity
   */
  async updatePayment(id: string, payment: Partial<Omit<PaymentEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PaymentEntity> {
    try {
      // Check if payment exists
      const existingPayment = await this.getPaymentById(id);
      if (!existingPayment) {
        throw new ShopBackendPaymentError(
          ShopBackendPaymentErrorType.NOT_FOUND,
          `Payment with ID ${id} not found`,
          'updatePayment',
          { id, payment }
        );
      }

      // Convert domain entity to database schema
      const paymentSchema: Partial<PaymentSchema> = {};
      if (payment.queueId !== undefined) paymentSchema.queue_id = payment.queueId;
      if (payment.queueNumber !== undefined) paymentSchema.queue_number = payment.queueNumber;
      if (payment.customerName !== undefined) paymentSchema.customer_name = payment.customerName;
      if (payment.totalAmount !== undefined) paymentSchema.total_amount = payment.totalAmount;
      if (payment.paidAmount !== undefined) paymentSchema.paid_amount = payment.paidAmount;
      if (payment.paymentMethod !== undefined) paymentSchema.payment_method = payment.paymentMethod;
      if (payment.paymentStatus !== undefined) paymentSchema.payment_status = payment.paymentStatus;
      if (payment.paymentDate !== undefined) paymentSchema.payment_date = payment.paymentDate;
      if (payment.processedByEmployeeId !== undefined) paymentSchema.processed_by_employee_id = payment.processedByEmployeeId;
      if (payment.shopId !== undefined) paymentSchema.shop_id = payment.shopId;

      // Update payment in database
      const updatedPayment = await this.dataSource.update<PaymentSchemaRecord>(
        'payments',
        id,
        paymentSchema
      );

      if (!updatedPayment) {
        throw new ShopBackendPaymentError(
          ShopBackendPaymentErrorType.OPERATION_FAILED,
          'Failed to update payment',
          'updatePayment',
          { id, payment }
        );
      }

      // Get the updated payment with joined data
      return this.getPaymentById(id) as Promise<PaymentEntity>;
    } catch (error) {
      if (error instanceof ShopBackendPaymentError) {
        throw error;
      }

      this.logger.error('Error in updatePayment', { error, id, payment });
      throw new ShopBackendPaymentError(
        ShopBackendPaymentErrorType.UNKNOWN,
        'An unexpected error occurred while updating payment',
        'updatePayment',
        { id, payment },
        error
      );
    }
  }

  /**
   * Delete a payment
   * @param id Payment ID
   * @returns true if deleted successfully
   */
  async deletePayment(id: string): Promise<boolean> {
    try {
      // Check if payment exists
      const existingPayment = await this.getPaymentById(id);
      if (!existingPayment) {
        throw new ShopBackendPaymentError(
          ShopBackendPaymentErrorType.NOT_FOUND,
          `Payment with ID ${id} not found`,
          'deletePayment',
          { id }
        );
      }

      // Delete payment from database
      await this.dataSource.delete(
        'payments',
        id
      );

      // Since we've already checked if the payment exists, we can return true
      return true;
    } catch (error) {
      if (error instanceof ShopBackendPaymentError) {
        throw error;
      }

      this.logger.error('Error in deletePayment', { error, id });
      throw new ShopBackendPaymentError(
        ShopBackendPaymentErrorType.UNKNOWN,
        'An unexpected error occurred while deleting payment',
        'deletePayment',
        { id },
        error
      );
    }
  }
}
