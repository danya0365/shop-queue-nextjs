import type { Logger } from '@/src/domain/interfaces/logger';
import type {
  CustomerPointTransactionEntity,
  CustomerPointTransactionFilters,
  CustomerPointTransactionType,
  CustomerPointsEntity,
  PaginatedCustomerPointTransactionsEntity,
} from '@/src/domain/entities/backend/backend-customer-points.entity';
import {
  CustomerPointsRepository,
  CustomerPointsRepositoryError,
  CustomerPointsRepositoryErrorType,
} from '@/src/domain/repositories/backend/backend-customer-points-repository';
import type { PaginationMeta, PaginationParams } from '@/src/domain/interfaces/pagination-types';

export interface CustomerPointsTransaction {
  id: string;
  shopId: string;
  customerId: string;
  type: CustomerPointTransactionType;
  points: number;
  description: string | null;
  relatedQueueId?: string | null;
  transactionDate: Date;
  createdAt: Date;
}

export interface CustomerPointsTransactionStats {
  totalTransactions: number;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  totalPointsExpired: number;
  transactionsByType: Record<CustomerPointTransactionType, number>;
  transactionsByMonth: Array<{ month: string; earned: number; redeemed: number; count: number }>;
  recentTransactions: CustomerPointsTransaction[];
}

export type CustomerPointsTransactionFiltersInput = CustomerPointTransactionFilters;

export interface CustomerPointsTransactionListResult {
  data: CustomerPointsTransaction[];
  pagination: PaginationMeta;
}

export interface ICustomerPointsTransactionBackendService {
  getTransactions(
    shopId: string,
    pagination: PaginationParams,
    filters?: CustomerPointsTransactionFiltersInput,
  ): Promise<CustomerPointsTransactionListResult>;
  getTransactionById(shopId: string, transactionId: string): Promise<CustomerPointsTransaction | null>;
  getCustomerPointsAfterCancel(shopId: string, transactionId: string, reason?: string): Promise<CustomerPointsEntity>;
  getTransactionStats(shopId: string, limit?: number): Promise<CustomerPointsTransactionStats>;
  getTransactionsByCustomer(
    shopId: string,
    customerId: string,
    pagination: PaginationParams,
    filters?: CustomerPointsTransactionFiltersInput,
  ): Promise<CustomerPointsTransactionListResult>;
}

export class CustomerPointsTransactionBackendService implements ICustomerPointsTransactionBackendService {
  private static readonly PAGE_SIZE = 100;

  constructor(
    private readonly repository: CustomerPointsRepository,
    private readonly logger: Logger,
  ) { }

  async getTransactions(
    shopId: string,
    pagination: PaginationParams,
    filters?: CustomerPointsTransactionFiltersInput,
  ): Promise<CustomerPointsTransactionListResult> {
    try {
      this.logger.info('CustomerPointsTransactionBackendService: Fetching transactions', { shopId, pagination, filters });
      const result = await this.fetchTransactions(shopId, pagination, filters);
      return this.mapListResult(result);
    } catch (error) {
      this.handleError(error, 'getTransactions', { shopId, pagination, filters });
    }
  }

  async getTransactionById(shopId: string, transactionId: string): Promise<CustomerPointsTransaction | null> {
    try {
      this.logger.info('CustomerPointsTransactionBackendService: Fetching transaction by ID', { shopId, transactionId });
      const transaction = await this.repository.getTransactionById(shopId, transactionId);
      return transaction ? this.mapToServiceModel(transaction) : null;
    } catch (error) {
      this.handleError(error, 'getTransactionById', { shopId, transactionId });
    }
  }

  async getCustomerPointsAfterCancel(shopId: string, transactionId: string, reason?: string): Promise<CustomerPointsEntity> {
    try {
      this.logger.info('CustomerPointsTransactionBackendService: Cancelling transaction', { shopId, transactionId, reason });
      return await this.repository.cancelTransaction(shopId, transactionId, reason);
    } catch (error) {
      this.handleError(error, 'getCustomerPointsAfterCancel', { shopId, transactionId, reason });
    }
  }

  async getTransactionStats(shopId: string, limit = 10): Promise<CustomerPointsTransactionStats> {
    try {
      this.logger.info('CustomerPointsTransactionBackendService: Fetching transaction stats', { shopId, limit });
      const recentTransactions = await this.repository.getRecentTransactions(shopId, limit);
      const grouped = await this.fetchTransactions(shopId, { page: 1, limit });

      const transactions = grouped.data;
      const totals = this.calculateTotals(transactions);
      const byType = this.countByType(transactions);
      const byMonth = this.calculateMonthlyTrends(transactions);

      return {
        totalTransactions: totals.totalTransactions,
        totalPointsEarned: totals.totalPointsEarned,
        totalPointsRedeemed: totals.totalPointsRedeemed,
        totalPointsExpired: totals.totalPointsExpired,
        transactionsByType: byType,
        transactionsByMonth: byMonth,
        recentTransactions: recentTransactions.map(transaction => this.mapToServiceModel(transaction)),
      };
    } catch (error) {
      this.handleError(error, 'getTransactionStats', { shopId, limit });
    }
  }

  async getTransactionsByCustomer(
    shopId: string,
    customerId: string,
    pagination: PaginationParams,
    filters?: CustomerPointsTransactionFiltersInput,
  ): Promise<CustomerPointsTransactionListResult> {
    try {
      this.logger.info('CustomerPointsTransactionBackendService: Fetching transactions by customer', { shopId, customerId, pagination, filters });
      const result = await this.fetchTransactions(shopId, pagination, filters, customerId);
      return this.mapListResult(result);
    } catch (error) {
      this.handleError(error, 'getTransactionsByCustomer', { shopId, customerId, pagination, filters });
    }
  }

  private mapToServiceModel(entity: CustomerPointTransactionEntity): CustomerPointsTransaction {
    return {
      id: entity.id,
      shopId: entity.shopId,
      customerId: entity.customerId,
      type: entity.type,
      points: entity.points,
      description: entity.description,
      relatedQueueId: entity.relatedQueueId,
      transactionDate: new Date(entity.transactionDate),
      createdAt: new Date(entity.createdAt),
    };
  }

  private calculateTotals(transactions: CustomerPointTransactionEntity[]) {
    return transactions.reduce(
      (acc, transaction) => {
        acc.totalTransactions += 1;
        if (transaction.type === 'earned') {
          acc.totalPointsEarned += transaction.points;
        } else if (transaction.type === 'redeemed') {
          acc.totalPointsRedeemed += Math.abs(transaction.points);
        } else if (transaction.type === 'expired') {
          acc.totalPointsExpired += Math.abs(transaction.points);
        }
        return acc;
      },
      {
        totalTransactions: 0,
        totalPointsEarned: 0,
        totalPointsRedeemed: 0,
        totalPointsExpired: 0,
      },
    );
  }

  private countByType(transactions: CustomerPointTransactionEntity[]): Record<CustomerPointTransactionType, number> {
    const base: Record<CustomerPointTransactionType, number> = {
      earned: 0,
      redeemed: 0,
      expired: 0,
    };

    return transactions.reduce<Record<CustomerPointTransactionType, number>>((acc, transaction) => {
      acc[transaction.type] = (acc[transaction.type] ?? 0) + 1;
      return acc;
    }, base);
  }

  private calculateMonthlyTrends(transactions: CustomerPointTransactionEntity[]) {
    const monthly = transactions.reduce<Map<string, { earned: number; redeemed: number; count: number }>>((acc, transaction) => {
      const dateSource = transaction.transactionDate ?? transaction.createdAt;
      const monthKey = dateSource.slice(0, 7);
      if (!acc.has(monthKey)) {
        acc.set(monthKey, { earned: 0, redeemed: 0, count: 0 });
      }
      const bucket = acc.get(monthKey)!;
      bucket.count += 1;
      if (transaction.type === 'earned') {
        bucket.earned += transaction.points;
      } else if (transaction.type === 'redeemed') {
        bucket.redeemed += Math.abs(transaction.points);
      }
      return acc;
    }, new Map());

    return Array.from(monthly.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => b.month.localeCompare(a.month));
  }

  private handleError(error: unknown, operation: string, context: Record<string, unknown>): never {
    this.logger.error('CustomerPointsTransactionBackendService: Operation failed', {
      operation,
      context,
      error,
    });

    if (error instanceof CustomerPointsRepositoryError) {
      throw error;
    }

    throw new CustomerPointsRepositoryError(
      CustomerPointsRepositoryErrorType.UNKNOWN,
      'เกิดข้อผิดพลาดในการจัดการประวัติแต้มลูกค้า',
      operation,
      context,
      error,
    );
  }

  private async fetchTransactions(
    shopId: string,
    pagination: PaginationParams,
    filters?: CustomerPointsTransactionFiltersInput,
    customerId?: string,
  ): Promise<PaginatedCustomerPointTransactionsEntity> {
    return this.repository.getCustomerPointTransactions(shopId, customerId ?? null, pagination, filters);
  }

  private mapListResult(
    result: PaginatedCustomerPointTransactionsEntity,
  ): CustomerPointsTransactionListResult {
    return {
      data: result.data.map(transaction => this.mapToServiceModel(transaction)),
      pagination: result.pagination,
    };
  }

  private async fetchAllTransactions(
    shopId: string,
    filters?: CustomerPointsTransactionFiltersInput,
  ): Promise<CustomerPointTransactionEntity[]> {
    const all: CustomerPointTransactionEntity[] = [];
    let page = 1;

    while (true) {
      const { data, pagination } = await this.fetchTransactions(
        shopId,
        { page, limit: CustomerPointsTransactionBackendService.PAGE_SIZE },
        filters,
      );
      all.push(...data);

      if (!pagination.hasNextPage) {
        break;
      }

      page += 1;
    }

    return all;
  }
}
