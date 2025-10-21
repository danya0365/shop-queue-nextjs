import type {
  CustomerPointExpiryEntity,
  CustomerPointTransactionEntity,
  CustomerPointTransactionFilters,
  CustomerPointsEntity,
  CustomerPointsStatsEntity,
  CustomerPointsWithCustomerEntity,
  PaginatedCustomerPointTransactionsEntity,
} from "@/src/domain/entities/backend/backend-customer-points.entity";
import type {
  DatabaseDataSource,
  QueryFilter,
  QueryOptions,
} from "@/src/domain/interfaces/datasources/database-datasource";
import {
  FilterOperator,
  SortDirection,
} from "@/src/domain/interfaces/datasources/database-datasource";
import type { Logger } from "@/src/domain/interfaces/logger";
import type { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import type {
  CustomerPointsListFilters,
  CustomerPointsRepository,
} from "@/src/domain/repositories/backend/backend-customer-points-repository";
import {
  CustomerPointsRepositoryError,
  CustomerPointsRepositoryErrorType,
} from "@/src/domain/repositories/backend/backend-customer-points-repository";
import { SupabaseBackendCustomerPointsMapper } from "@/src/infrastructure/mappers/backend/supabase-backend-customer-points.mapper";
import { BaseRepository } from "@/src/infrastructure/repositories/base/base-repository";
import type {
  CustomerPointExpirySchema,
  CustomerPointTransactionWithCustomerSchema,
  CustomerPointsSchema,
  CustomerPointsStatsSchema,
  CustomerPointsWithCustomerSchema,
} from "@/src/infrastructure/schemas/backend/customer-points.schema";

type CustomerPointTransactionRow = CustomerPointTransactionWithCustomerSchema & Record<string, unknown>;
type CustomerPointsRow = CustomerPointsSchema & Record<string, unknown>;
type CustomerPointsStatsRow = CustomerPointsStatsSchema & Record<string, unknown>;
type CustomerPointExpiryRow = CustomerPointExpirySchema & Record<string, unknown>;

interface CustomerPointsWithMeta extends CustomerPointsWithCustomerSchema {
  transaction_count?: number;
}

type CustomerPointsWithMetaRow =
  (CustomerPointsWithMeta & {
    customers?: CustomerPointsWithMeta["customers"];
  }) &
  Record<string, unknown>;

export class SupabaseBackendCustomerPointsRepository
  extends BaseRepository
  implements CustomerPointsRepository
{
  constructor(dataSource: DatabaseDataSource, logger: Logger) {
    super(dataSource, logger, "BackendCustomerPoints");
  }

  async getCustomerPointsByCustomerId(
    shopId: string,
    customerId: string
  ): Promise<CustomerPointsEntity | null> {
    try {
      const queryOptions: QueryOptions = {
        select: ["*"],
        filters: [
          { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
          {
            field: "customer_id",
            operator: FilterOperator.EQ,
            value: customerId,
          },
        ],
        limit: 1,
      } as QueryOptions;

      const rows = await this.dataSource.getAdvanced<CustomerPointsRow>(
        "customer_points",
        queryOptions
      );

      const record = rows[0];
      if (!record) {
        return null;
      }
      return SupabaseBackendCustomerPointsMapper.toDomain(record);
    } catch (error) {
      this.logger.error("Failed to get customer points", {
        operation: "getCustomerPointsByCustomerId",
        shopId,
        customerId,
        error,
      });
      throw new CustomerPointsRepositoryError(
        CustomerPointsRepositoryErrorType.OPERATION_FAILED,
        "ไม่สามารถโหลดข้อมูลแต้มลูกค้าได้",
        "getCustomerPointsByCustomerId",
        { shopId, customerId },
        error
      );
    }
  }

  async getCustomerPointsList(
    shopId: string,
    pagination: PaginationParams,
    filters?: CustomerPointsListFilters
  ): Promise<{
    data: CustomerPointsWithCustomerEntity[];
    pagination: PaginationParams;
  }> {
    try {
      const { page, limit } = pagination;
      const offset = (page - 1) * limit;

      const queryFilters: QueryFilter[] = [
        { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
      ];

      if (filters?.membershipTier) {
        queryFilters.push({
          field: "membership_tier",
          operator: FilterOperator.EQ,
          value: filters.membershipTier,
        });
      }

      if (filters?.minCurrentPoints !== undefined) {
        queryFilters.push({
          field: "current_points",
          operator: FilterOperator.GTE,
          value: filters.minCurrentPoints,
        });
      }

      if (filters?.maxCurrentPoints !== undefined) {
        queryFilters.push({
          field: "current_points",
          operator: FilterOperator.LTE,
          value: filters.maxCurrentPoints,
        });
      }

      if (filters?.minTotalEarned !== undefined) {
        queryFilters.push({
          field: "total_earned",
          operator: FilterOperator.GTE,
          value: filters.minTotalEarned,
        });
      }

      if (filters?.maxTotalEarned !== undefined) {
        queryFilters.push({
          field: "total_earned",
          operator: FilterOperator.LTE,
          value: filters.maxTotalEarned,
        });
      }

      const queryOptions: QueryOptions = {
        select: ["*"],
        joins: [
          {
            table: "customers",
            on: { fromField: "customer_id", toField: "id" },
            select: ["name", "phone", "email", "updated_at"],
          },
        ],
        filters: queryFilters,
        sort: [{ field: "updated_at", direction: SortDirection.DESC }],
        pagination: {
          limit,
          offset,
        },
      };

      const rows = await this.dataSource.getAdvanced<CustomerPointsWithMetaRow>(
        "customer_points",
        queryOptions
      );

      const data = rows.map((row) =>
        SupabaseBackendCustomerPointsMapper.toDomainWithCustomer(row)
      );

      return {
        data,
        pagination: {
          page,
          limit,
        },
      };
    } catch (error) {
      this.logger.error("Failed to list customer points", {
        operation: "getCustomerPointsList",
        shopId,
        error,
      });
      throw new CustomerPointsRepositoryError(
        CustomerPointsRepositoryErrorType.OPERATION_FAILED,
        "ไม่สามารถโหลดรายชื่อแต้มลูกค้าได้",
        "getCustomerPointsList",
        { shopId, pagination, filters },
        error
      );
    }
  }

  async getCustomerPointsStats(
    shopId: string
  ): Promise<CustomerPointsStatsEntity> {
    try {
      const rows = await this.dataSource.getAdvanced<CustomerPointsStatsRow>(
        "customer_points_stats_view",
        {
          select: ["*"],
          filters: [
            { field: "shop_id", operator: FilterOperator.EQ, value: shopId },
          ],
          limit: 1,
        } as QueryOptions
      );

      const stats = rows[0];
      if (!stats) {
        return {
          totalCustomers: 0,
          totalPointsIssued: 0,
          totalPointsRedeemed: 0,
          totalPointsExpired: 0,
          averagePointsPerCustomer: 0,
          tierDistribution: {},
        };
      }

      return SupabaseBackendCustomerPointsMapper.statsToDomain(stats);
    } catch (error) {
      this.logger.error("Failed to load customer points stats", {
        operation: "getCustomerPointsStats",
        shopId,
        error,
      });
      throw new CustomerPointsRepositoryError(
        CustomerPointsRepositoryErrorType.OPERATION_FAILED,
        "ไม่สามารถโหลดสถิติแต้มลูกค้าได้",
        "getCustomerPointsStats",
        { shopId },
        error
      );
    }
  }

  async addPoints(
    shopId: string,
    customerId: string,
    points: number,
    description: string,
    options?: {
      queueId?: string | null;
      metadata?: Record<string, unknown> | null;
    }
  ): Promise<CustomerPointsEntity> {
    try {
      await this.dataSource.callRpc("add_customer_points", {
        p_customer_id: customerId,
        p_points: points,
        p_description: description,
        p_queue_id: options?.queueId ?? null,
        p_metadata: options?.metadata ?? null,
      });

      const updated = await this.getCustomerPointsByCustomerId(
        shopId,
        customerId
      );
      if (!updated) {
        throw new CustomerPointsRepositoryError(
          CustomerPointsRepositoryErrorType.NOT_FOUND,
          "ไม่พบข้อมูลแต้มลูกค้าหลังเพิ่มแต้ม",
          "addPoints",
          { shopId, customerId }
        );
      }
      return updated;
    } catch (error) {
      this.logger.error("Failed to add points", {
        operation: "addPoints",
        shopId,
        customerId,
        points,
        error,
      });
      if (error instanceof CustomerPointsRepositoryError) {
        throw error;
      }
      throw new CustomerPointsRepositoryError(
        CustomerPointsRepositoryErrorType.OPERATION_FAILED,
        "ไม่สามารถเพิ่มแต้มให้ลูกค้าได้",
        "addPoints",
        { shopId, customerId, points },
        error
      );
    }
  }

  async redeemPoints(
    shopId: string,
    customerId: string,
    points: number,
    description: string,
    options?: {
      rewardId?: string | null;
      metadata?: Record<string, unknown> | null;
    }
  ): Promise<CustomerPointsEntity> {
    try {
      await this.dataSource.callRpc("redeem_customer_points", {
        p_customer_id: customerId,
        p_points: points,
        p_description: description,
        p_reward_id: options?.rewardId ?? null,
      });

      const updated = await this.getCustomerPointsByCustomerId(
        shopId,
        customerId
      );
      if (!updated) {
        throw new CustomerPointsRepositoryError(
          CustomerPointsRepositoryErrorType.NOT_FOUND,
          "ไม่พบข้อมูลแต้มลูกค้าหลังแลกแต้ม",
          "redeemPoints",
          { shopId, customerId }
        );
      }
      return updated;
    } catch (error) {
      this.logger.error("Failed to redeem points", {
        operation: "redeemPoints",
        shopId,
        customerId,
        points,
        error,
      });
      if (error instanceof CustomerPointsRepositoryError) {
        throw error;
      }
      throw new CustomerPointsRepositoryError(
        CustomerPointsRepositoryErrorType.OPERATION_FAILED,
        "ไม่สามารถแลกแต้มลูกค้าได้",
        "redeemPoints",
        { shopId, customerId, points },
        error
      );
    }
  }

  async adjustPoints(
    shopId: string,
    customerId: string,
    adjustment: number,
    description: string,
    metadata?: Record<string, unknown> | null
  ): Promise<CustomerPointsEntity> {
    if (adjustment === 0) {
      throw new CustomerPointsRepositoryError(
        CustomerPointsRepositoryErrorType.VALIDATION_ERROR,
        "Adjustment must not be zero",
        "adjustPoints",
        { adjustment }
      );
    }

    if (adjustment > 0) {
      return this.addPoints(shopId, customerId, adjustment, description, {
        metadata,
      });
    }

    return this.redeemPoints(
      shopId,
      customerId,
      Math.abs(adjustment),
      description,
      {
        metadata,
      }
    );
  }

  async getCustomerPointTransactions(
    shopId: string,
    customerId: string | null,
    pagination: PaginationParams,
    filters?: CustomerPointTransactionFilters
  ): Promise<PaginatedCustomerPointTransactionsEntity> {
    try {
      const { page, limit } = pagination;
      const offset = (page - 1) * limit;

      const queryFilters = [
        {
          field: "customer_points.shop_id",
          operator: FilterOperator.EQ,
          value: shopId,
        },
      ];

      if (customerId) {
        queryFilters.push({
          field: "customer_points.customer_id",
          operator: FilterOperator.EQ,
          value: customerId,
        });
      }

      if (filters?.type) {
        queryFilters.push({
          field: "type",
          operator: FilterOperator.EQ,
          value: filters.type,
        });
      }

      if (filters?.startDate) {
        queryFilters.push({
          field: "transaction_date",
          operator: FilterOperator.GTE,
          value: filters.startDate,
        });
      }

      if (filters?.endDate) {
        queryFilters.push({
          field: "transaction_date",
          operator: FilterOperator.LTE,
          value: filters.endDate,
        });
      }

      const queryOptions: QueryOptions = {
        select: ["*"],
        joins: [
          {
            table: "customer_points",
            on: { fromField: "customer_point_id", toField: "id" },
            select: ["customer_id", "shop_id"],
          },
        ],
        filters: queryFilters,
        sort: [
          { field: "transaction_date", direction: SortDirection.DESC },
          { field: "created_at", direction: SortDirection.DESC },
        ],
        pagination: {
          limit,
          offset,
        },
      };

      const rows = await this.dataSource.getAdvanced<CustomerPointTransactionRow>(
        "customer_point_transactions",
        queryOptions
      );

      const totalItems = await this.dataSource.count(
        "customer_point_transactions",
        {
          filters: queryFilters,
        }
      );

      const transactions = rows.map((row) =>
        SupabaseBackendCustomerPointsMapper.transactionToDomain(row)
      );

      return {
        data: transactions,
        pagination: SupabaseBackendCustomerPointsMapper.createPaginationMeta(
          page,
          limit,
          totalItems
        ),
      };
    } catch (error) {
      this.logger.error("Failed to load customer point transactions", {
        operation: "getCustomerPointTransactions",
        shopId,
        customerId,
        error,
      });
      throw new CustomerPointsRepositoryError(
        CustomerPointsRepositoryErrorType.OPERATION_FAILED,
        "ไม่สามารถโหลดประวัติแต้มลูกค้าได้",
        "getCustomerPointTransactions",
        { shopId, customerId, pagination, filters },
        error
      );
    }
  }

  async getRecentTransactions(
    shopId: string,
    limit = 10
  ): Promise<CustomerPointTransactionEntity[]> {
    try {
      const queryOptions: QueryOptions = {
        select: ["*"],
        joins: [
          {
            table: "customer_points",
            on: { fromField: "customer_point_id", toField: "id" },
            select: ["customer_id", "shop_id"],
          },
        ],
        filters: [
          {
            field: "customer_points.shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
        ],
        sort: [
          { field: "transaction_date", direction: SortDirection.DESC },
          { field: "created_at", direction: SortDirection.DESC },
        ],
        pagination: {
          limit,
          offset: 0,
        },
      };

      const rows = await this.dataSource.getAdvanced<CustomerPointTransactionRow>(
        "customer_point_transactions",
        queryOptions
      );

      return rows.map((row) =>
        SupabaseBackendCustomerPointsMapper.transactionToDomain(row)
      );
    } catch (error) {
      this.logger.error("Failed to load recent customer point transactions", {
        operation: "getRecentTransactions",
        shopId,
        error,
      });
      throw new CustomerPointsRepositoryError(
        CustomerPointsRepositoryErrorType.OPERATION_FAILED,
        "ไม่สามารถโหลดประวัติแต้มล่าสุดได้",
        "getRecentTransactions",
        { shopId, limit },
        error
      );
    }
  }

  async getTransactionById(
    shopId: string,
    transactionId: string
  ): Promise<CustomerPointTransactionEntity | null> {
    try {
      const queryOptions: QueryOptions = {
        select: ["*"],
        joins: [
          {
            table: "customer_points",
            on: { fromField: "customer_point_id", toField: "id" },
            select: ["customer_id", "shop_id"],
          },
        ],
        filters: [
          { field: "id", operator: FilterOperator.EQ, value: transactionId },
          {
            field: "customer_points.shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
        ],
        pagination: {
          limit: 1,
          offset: 0,
        },
      };

      const rows = await this.dataSource.getAdvanced<CustomerPointTransactionRow>(
        "customer_point_transactions",
        queryOptions
      );

      const transaction = rows[0];
      if (!transaction) {
        return null;
      }
      return SupabaseBackendCustomerPointsMapper.transactionToDomain(
        transaction
      );
    } catch (error) {
      this.logger.error("Failed to load customer point transaction", {
        operation: "getTransactionById",
        shopId,
        transactionId,
        error,
      });
      throw new CustomerPointsRepositoryError(
        CustomerPointsRepositoryErrorType.OPERATION_FAILED,
        "ไม่พบข้อมูลประวัติแต้ม",
        "getTransactionById",
        { shopId, transactionId },
        error
      );
    }
  }

  async getExpirySchedule(
    shopId: string,
    customerId: string
  ): Promise<CustomerPointExpiryEntity[]> {
    try {
      const queryOptions: QueryOptions = {
        select: ["*"],
        joins: [
          {
            table: "customer_point_transactions",
            on: { fromField: "customer_point_transaction_id", toField: "id" },
            select: ["customer_point_id"],
          },
          {
            table: "customer_points",
            on: {
              fromField: "customer_point_transactions.customer_point_id",
              toField: "id",
            },
            select: ["customer_id", "shop_id"],
          },
        ],
        filters: [
          {
            field: "customer_points.shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
          {
            field: "customer_points.customer_id",
            operator: FilterOperator.EQ,
            value: customerId,
          },
        ],
        sort: [{ field: "expiry_date", direction: SortDirection.ASC }],
      };

      const rows = await this.dataSource.getAdvanced<
        CustomerPointExpiryRow & {
          customer_point_transactions?: {
            customer_point_id: string;
          } | null;
          customer_points?: {
            customer_id: string;
            shop_id: string;
          } | null;
        }
      >("customer_point_expiry", queryOptions);

      return rows.map((row) =>
        SupabaseBackendCustomerPointsMapper.expiryToDomain(row)
      );
    } catch (error) {
      this.logger.error("Failed to load customer point expiry schedule", {
        operation: "getExpirySchedule",
        shopId,
        customerId,
        error,
      });
      throw new CustomerPointsRepositoryError(
        CustomerPointsRepositoryErrorType.OPERATION_FAILED,
        "ไม่สามารถโหลดกำหนดหมดอายุของแต้มได้",
        "getExpirySchedule",
        { shopId, customerId },
        error
      );
    }
  }

  async cancelTransaction(
    shopId: string,
    transactionId: string,
    reason?: string
  ): Promise<CustomerPointsEntity> {
    try {
      await this.dataSource.callRpc("cancel_customer_point_transaction", {
        p_transaction_id: transactionId,
        p_reason: reason ?? null,
      });

      const transaction = await this.getTransactionById(shopId, transactionId);
      if (!transaction) {
        throw new CustomerPointsRepositoryError(
          CustomerPointsRepositoryErrorType.NOT_FOUND,
          "ไม่พบธุรกรรมแต้มหลังยกเลิก",
          "cancelTransaction",
          { shopId, transactionId }
        );
      }

      const points = await this.getCustomerPointsByCustomerId(
        shopId,
        transaction.customerId
      );
      if (!points) {
        throw new CustomerPointsRepositoryError(
          CustomerPointsRepositoryErrorType.NOT_FOUND,
          "ไม่พบข้อมูลแต้มลูกค้าหลังยกเลิกธุรกรรม",
          "cancelTransaction",
          { shopId, transactionId }
        );
      }

      return points;
    } catch (error) {
      this.logger.error("Failed to cancel customer point transaction", {
        operation: "cancelTransaction",
        shopId,
        transactionId,
        error,
      });
      if (error instanceof CustomerPointsRepositoryError) {
        throw error;
      }
      throw new CustomerPointsRepositoryError(
        CustomerPointsRepositoryErrorType.OPERATION_FAILED,
        "ไม่สามารถยกเลิกธุรกรรมแต้มได้",
        "cancelTransaction",
        { shopId, transactionId },
        error
      );
    }
  }
}
