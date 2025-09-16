import {
  CreateQueueEntity,
  PaginatedQueuesEntity,
  QueueEntity,
  QueueStatsEntity,
  UpdateQueueEntity,
} from "../../../domain/entities/backend/backend-queue.entity";
import {
  DatabaseDataSource,
  FilterOperator,
  QueryOptions,
  SortDirection,
} from "../../../domain/interfaces/datasources/database-datasource";
import { Logger } from "../../../domain/interfaces/logger";
import { PaginationParams } from "../../../domain/interfaces/pagination-types";
import {
  BackendQueueError,
  BackendQueueErrorType,
  BackendQueueRepository,
} from "../../../domain/repositories/backend/backend-queue-repository";
import { SupabaseBackendQueueMapper } from "../../mappers/backend/supabase-backend-queue.mapper";
import {
  QueueSchema,
  QueueServiceSchema,
  QueueStatsSchema,
  ServiceSchema,
} from "../../schemas/backend/queue.schema";
import { BackendRepository } from "../base/backend-repository";

// Extended types for joined data
type QueueWithCustomerAndShop = QueueSchema & {
  customers?: { name?: string; phone?: string };
  shops?: { name?: string };
  queue_services?: QueueServiceSchema[];
};
type QueueSchemaRecord = Record<string, unknown> & QueueSchema;
type QueueServiceSchemaRecord = Record<string, unknown> & QueueServiceSchema;
type QueueStatsSchemaRecord = Record<string, unknown> & QueueStatsSchema;

/**
 * Supabase implementation of the queue repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseBackendQueueRepository
  extends BackendRepository
  implements BackendQueueRepository
{
  constructor(dataSource: DatabaseDataSource, logger: Logger) {
    super(dataSource, logger, "BackendQueue");
  }

  /**
   * Get paginated queues data from database
   * @param params Pagination parameters
   * @returns Paginated queues data
   */
  async getPaginatedQueues(
    params: PaginationParams
  ): Promise<PaginatedQueuesEntity> {
    try {
      const { page, limit } = params;
      const offset = (page - 1) * limit;

      // Use getAdvanced with proper QueryOptions format
      const queryOptions: QueryOptions = {
        select: ["*"],
        joins: [
          {
            table: "customers",
            on: { fromField: "customer_id", toField: "id" },
          },
          { table: "shops", on: { fromField: "shop_id", toField: "id" } },
        ],
        sort: [{ field: "created_at", direction: SortDirection.DESC }],
        pagination: {
          limit,
          offset,
        },
      };

      // Use extended type that satisfies Record<string, unknown> constraint
      const queues = await this.dataSource.getAdvanced<QueueSchemaRecord>(
        "queues",
        queryOptions
      );

      // Get queue services for each queue
      const queueIds = queues.map((queue) => queue.id);
      const queueServicesOptions: QueryOptions = {
        select: ["*"],
        joins: [
          { table: "services", on: { fromField: "service_id", toField: "id" } },
        ],
        filters: [
          { field: "queue_id", operator: FilterOperator.IN, value: queueIds },
        ],
      };

      // Get all queue services in a single query
      const queueServices = await this.dataSource.getAdvanced<
        QueueServiceSchemaRecord & { services: ServiceSchema }
      >("queue_services", queueServicesOptions);

      // Group queue services by queue_id
      const servicesByQueueId = queueServices.reduce((acc, queueService) => {
        const queueId = queueService.queue_id as string;
        if (!acc[queueId]) {
          acc[queueId] = [];
        }
        acc[queueId].push(queueService);
        return acc;
      }, {} as Record<string, QueueServiceSchemaRecord[]>);

      // Count total items
      const totalItems = await this.dataSource.count("queues");

      // Map database results to domain entities
      const mappedQueues = queues.map((queue) => {
        // Handle joined data from customers and shops tables using our QueueWithCustomerAndShop type
        const queueWithJoinedData = queue as QueueWithCustomerAndShop;

        // Get services for this queue
        const services = servicesByQueueId[queue.id] || [];

        const queueWithRelations = {
          ...queue,
          customer_name: queueWithJoinedData.customers?.name,
          customer_phone: queueWithJoinedData.customers?.phone,
          shop_name: queueWithJoinedData.shops?.name,
          queue_services: services,
        };
        return SupabaseBackendQueueMapper.toDomain(queueWithRelations);
      });

      // Create pagination metadata
      const pagination = SupabaseBackendQueueMapper.createPaginationMeta(
        page,
        limit,
        totalItems
      );

      return {
        data: mappedQueues,
        pagination,
      };
    } catch (error) {
      if (error instanceof BackendQueueError) {
        throw error;
      }

      this.logger.error("Error in getPaginatedQueues", { error });
      throw new BackendQueueError(
        BackendQueueErrorType.UNKNOWN,
        "An unexpected error occurred while fetching queues",
        "getPaginatedQueues",
        {},
        error
      );
    }
  }

  /**
   * Get queue statistics from database
   * @returns Queue statistics
   */
  async getQueueStats(): Promise<QueueStatsEntity> {
    try {
      // Use getAdvanced to fetch statistics data
      const queryOptions: QueryOptions = {
        select: ["*"],
        // No joins needed for stats view
        // No pagination needed, we want all stats
      };

      // Assuming a view exists for queue statistics
      // Use extended type that satisfies Record<string, unknown> constraint
      const statsData =
        await this.dataSource.getAdvanced<QueueStatsSchemaRecord>(
          "queue_stats_summary_view",
          queryOptions
        );

      if (!statsData || statsData.length === 0) {
        // If no stats are found, return default values
        return {
          // Today's statistics
          totalQueueToday: 0,
          waitingQueueToday: 0,
          confirmedQueueToday: 0,
          servingQueueToday: 0,
          inProgressQueueToday: 0,
          totalCompletedToday: 0,
          totalCancelledToday: 0,

          // All-time statistics
          allQueueTotal: 0,
          allWaitingQueue: 0,
          allConfirmedQueue: 0,
          allServingQueue: 0,
          allInProgressQueue: 0,
          allCompletedTotal: 0,
          allCancelledTotal: 0,

          // Performance metrics
          avgWaitTimeMinutes: 0,
        };
      }

      // Map database results to domain entity
      // Assuming the first record contains all stats
      return SupabaseBackendQueueMapper.statsToEntity(statsData[0]);
    } catch (error) {
      if (error instanceof BackendQueueError) {
        throw error;
      }

      this.logger.error("Error in getQueueStats", { error });
      throw new BackendQueueError(
        BackendQueueErrorType.UNKNOWN,
        "An unexpected error occurred while fetching queue statistics",
        "getQueueStats",
        {},
        error
      );
    }
  }

  /**
   * Get queue by ID
   * @param id Queue ID
   * @returns Queue entity or null if not found
   */
  async getQueueById(id: string): Promise<QueueEntity | null> {
    try {
      // Use getById which is designed for fetching by ID
      // Use extended type that satisfies Record<string, unknown> constraint
      const queue = await this.dataSource.getById<QueueSchemaRecord>(
        "queues",
        id,
        {
          select: ["*"],
          joins: [
            {
              table: "customers",
              on: { fromField: "customer_id", toField: "id" },
            },
            { table: "shops", on: { fromField: "shop_id", toField: "id" } },
          ],
        }
      );

      if (!queue) {
        return null;
      }

      // Get queue services
      const queueServicesOptions: QueryOptions = {
        select: ["*"],
        joins: [
          { table: "services", on: { fromField: "service_id", toField: "id" } },
        ],
        filters: [
          { field: "queue_id", operator: FilterOperator.EQ, value: id },
        ],
      };

      const services =
        await this.dataSource.getAdvanced<QueueServiceSchemaRecord>(
          "queue_services",
          queueServicesOptions
        );

      // Handle joined data from customers and shops tables using our QueueWithCustomerAndShop type
      const queueWithJoinedData = queue as QueueWithCustomerAndShop;

      const queueWithRelations = {
        ...queue,
        customer_name: queueWithJoinedData.customers?.name,
        customer_phone: queueWithJoinedData.customers?.phone,
        shop_name: queueWithJoinedData.shops?.name,
        queue_services: services,
      };

      // Map database result to domain entity
      return SupabaseBackendQueueMapper.toDomain(queueWithRelations);
    } catch (error) {
      if (error instanceof BackendQueueError) {
        throw error;
      }

      this.logger.error("Error in getQueueById", { error, id });
      throw new BackendQueueError(
        BackendQueueErrorType.UNKNOWN,
        "An unexpected error occurred while fetching queue",
        "getQueueById",
        { id },
        error
      );
    }
  }

  /**
   * Create a new queue
   * @param queue Queue entity to create
   * @returns Created queue entity
   */
  async createQueue(
    queue: Omit<CreateQueueEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<QueueEntity> {
    try {
      // Convert domain entity to database schema
      const queueSchema = {
        customer_id: queue.customerId,
        shop_id: queue.shopId,
        queue_number: queue.queueNumber.toString(),
        status: queue.status,
        priority: queue.priority,
        estimated_duration: queue.estimatedWaitTime,
        note: queue.notes || null,
      };

      // Insert queue in database
      const createdQueue = await this.dataSource.insert<QueueSchemaRecord>(
        "queues",
        queueSchema
      );

      if (!createdQueue) {
        throw new BackendQueueError(
          BackendQueueErrorType.OPERATION_FAILED,
          "Failed to create queue",
          "createQueue",
          { queue }
        );
      }

      // Create queue services
      const queueServices = queue.queueServices.map((service) => ({
        queue_id: createdQueue.id,
        service_id: service.serviceId,
        quantity: service.quantity,
        price: service.price,
      }));

      // Create queue services in database - one by one since createMany doesn't exist
      if (queueServices.length > 0) {
        for (const service of queueServices) {
          await this.dataSource.insert<QueueServiceSchemaRecord>(
            "queue_services",
            service
          );
        }
      }

      // Get the created queue with all relations
      return this.getQueueById(createdQueue.id) as Promise<QueueEntity>;
    } catch (error) {
      if (error instanceof BackendQueueError) {
        throw error;
      }

      this.logger.error("Error in createQueue", { error, queue });
      throw new BackendQueueError(
        BackendQueueErrorType.UNKNOWN,
        "An unexpected error occurred while creating queue",
        "createQueue",
        { queue },
        error
      );
    }
  }

  /**
   * Update an existing queue
   * @param id Queue ID
   * @param queue Queue data to update
   * @returns Updated queue entity
   */
  async updateQueue(
    id: string,
    queue: Partial<UpdateQueueEntity>
  ): Promise<QueueEntity> {
    try {
      // Check if queue exists
      const existingQueue = await this.getQueueById(id);
      if (!existingQueue) {
        throw new BackendQueueError(
          BackendQueueErrorType.NOT_FOUND,
          `Queue with ID ${id} not found`,
          "updateQueue",
          { id, queue }
        );
      }

      // Convert domain entity to database schema
      const queueSchema: Partial<QueueSchema> = {};

      if (queue.status !== undefined) queueSchema.status = queue.status;
      if (queue.priority !== undefined) queueSchema.priority = queue.priority;
      if (queue.estimatedWaitTime !== undefined)
        queueSchema.estimated_duration = queue.estimatedWaitTime;
      if (queue.notes !== undefined) queueSchema.note = queue.notes || null;

      // Update queue in database
      await this.dataSource.update<QueueSchemaRecord>(
        "queues",
        id,
        queueSchema
      );

      // Update queue services if provided
      if (queue.queueServices && queue.queueServices.length > 0) {
        // Delete existing queue services
        const existingServices =
          await this.dataSource.getAdvanced<QueueServiceSchemaRecord>(
            "queue_services",
            {
              filters: [
                { field: "queue_id", operator: FilterOperator.EQ, value: id },
              ],
              select: ["id"],
            }
          );

        for (const service of existingServices) {
          await this.dataSource.delete("queue_services", service.id as string);
        }

        // Create new queue services one by one
        const queueServices = queue.queueServices.map((service) => ({
          queue_id: id,
          service_id: service.serviceId,
          quantity: service.quantity,
          price: service.price,
        }));

        for (const service of queueServices) {
          await this.dataSource.insert<QueueServiceSchemaRecord>(
            "queue_services",
            service
          );
        }
      }

      // Get the updated queue with all relations
      return this.getQueueById(id) as Promise<QueueEntity>;
    } catch (error) {
      if (error instanceof BackendQueueError) {
        throw error;
      }

      this.logger.error("Error in updateQueue", { error, id, queue });
      throw new BackendQueueError(
        BackendQueueErrorType.UNKNOWN,
        "An unexpected error occurred while updating queue",
        "updateQueue",
        { id, queue },
        error
      );
    }
  }

  /**
   * Delete a queue
   * @param id Queue ID
   * @returns true if deleted, false if not found
   */
  async deleteQueue(id: string): Promise<boolean> {
    try {
      // Check if queue exists
      const existingQueue = await this.getQueueById(id);
      if (!existingQueue) {
        return false;
      }

      // Delete queue services first (cascade delete should handle this, but just to be safe)
      // First get all queue services for this queue
      const existingServices =
        await this.dataSource.getAdvanced<QueueServiceSchemaRecord>(
          "queue_services",
          {
            filters: [
              { field: "queue_id", operator: FilterOperator.EQ, value: id },
            ],
            select: ["id"],
          }
        );

      // Delete each service individually
      for (const service of existingServices) {
        await this.dataSource.delete("queue_services", service.id as string);
      }

      // Delete queue
      await this.dataSource.delete("queues", id);

      return true;
    } catch (error) {
      if (error instanceof BackendQueueError) {
        throw error;
      }

      this.logger.error("Error in deleteQueue", { error, id });
      throw new BackendQueueError(
        BackendQueueErrorType.UNKNOWN,
        "An unexpected error occurred while deleting queue",
        "deleteQueue",
        { id },
        error
      );
    }
  }
}
