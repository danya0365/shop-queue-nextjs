import {
  QueuePriority,
  QueueStatus,
} from "@/src/domain/entities/shop/backend/backend-queue.entity";
import { CustomerEntity } from "@/src/domain/entities/shop/customer/customer.entity";
import type {
  JoinQueueResultEntity,
  QueueJoinEntity,
  QueueServiceEntity,
  ServiceOptionEntity,
  ShopQueueInfoEntity,
} from "@/src/domain/entities/shop/customer/queue-join.entity";
import {
  ShopCustomerQueueJoinError,
  ShopCustomerQueueJoinErrorType,
  ShopCustomerQueueJoinRepository,
} from "@/src/domain/repositories/shop/customer/queue-join-repository";
import { CustomerMapper } from "@/src/infrastructure/mappers/shop/customer/customer.mapper";
import { SupabaseQueueJoinMapper } from "@/src/infrastructure/mappers/shop/customer/supabase-queue-join-mapper";
import type {
  JoinQueueResultSchema,
  PublicQueueInfoByCustomerIdSchema,
  PublicQueueInfoSchema,
  PublicShopInfoSchema,
  QueueComprehensiveStatsRpcSchema,
  ServiceOptionSchema,
  ShopQueueInfoSchema,
} from "@/src/infrastructure/schemas/shop/customer/queue-join.schema";
import type {
  GetCustomerByIdSchema,
  GetCustomerByProfileIdSchema,
  RegisterCustomerSchema,
  LinkCustomerToProfileSchema,
} from "@/src/infrastructure/schemas/shop/customer/customer.schema";
import { StandardRepository } from "../../base/standard-repository";
import type { DatabaseDataSource } from "@/src/domain/interfaces/datasources/database-datasource";
import type { Logger } from "@/src/domain/interfaces/logger";

// Extended types for database records
type ServiceOptionSchemaRecord = Record<string, unknown> & ServiceOptionSchema;

/**
 * Supabase implementation of the customer queue join repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseCustomerQueueJoinRepository
  extends StandardRepository
  implements ShopCustomerQueueJoinRepository
{
  constructor(dataSource: DatabaseDataSource, logger: Logger) {
    super(dataSource, logger, "CustomerQueueJoin");
  }

  /**
   * Get available services for a shop
   * @param shopId The shop ID
   * @returns Array of available service options
   */
  async getAvailableServices(shopId: string): Promise<ServiceOptionEntity[]> {
    try {
      // Use RPC call instead of direct table query for security
      const result = await this.dataSource.callRpc<ServiceOptionSchemaRecord>(
        "get_available_services",
        { p_shop_id: shopId }
      );

      if (!result || !Array.isArray(result) || result.length === 0) {
        // Return empty array instead of throwing error when no services found
        return [];
      }

      return SupabaseQueueJoinMapper.toServiceOptionEntities(result);
    } catch (error) {
      if (error instanceof ShopCustomerQueueJoinError) {
        throw error;
      }

      throw new ShopCustomerQueueJoinError(
        ShopCustomerQueueJoinErrorType.UNKNOWN,
        "Failed to get available services",
        "SupabaseCustomerQueueJoinRepository.getAvailableServices",
        {
          shopId,
          error: error instanceof Error ? error.message : String(error),
        },
        error
      );
    }
  }

  /**
   * Get shop queue information
   * @param shopId The shop ID
   * @returns Shop queue information
   */
  async getShopQueueInfo(shopId: string): Promise<ShopQueueInfoEntity> {
    try {
      // Use RPC call to get public shop info with shops and shop_settings left join
      const shopInfoResult =
        await this.dataSource.callRpc<PublicShopInfoSchema>(
          "get_public_shop_info",
          { p_shop_id: shopId }
        );

      if (
        !shopInfoResult ||
        !Array.isArray(shopInfoResult) ||
        shopInfoResult.length === 0
      ) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.UNKNOWN,
          "Shop not found",
          "SupabaseCustomerQueueJoinRepository.getShopQueueInfo",
          { shopId }
        );
      }

      const shopInfoData = shopInfoResult[0];

      // Get current queue statistics using RPC call
      const queueStatsResult = await this.dataSource.callRpc<
        QueueComprehensiveStatsRpcSchema[]
      >("get_public_queue_comprehensive_stats", { p_shop_id: shopId });

      // Calculate queue statistics from RPC result
      const queueStats = queueStatsResult[0];

      const currentQueueLength =
        (queueStats?.confirmed_queues || 0) + (queueStats?.serving_queues || 0);
      const estimatedWaitTime =
        queueStats?.current_wait_time_estimate ||
        queueStats?.average_wait_time_minutes ||
        currentQueueLength * 5;

      // Create queue info data from RPC result
      const queueInfoData: ShopQueueInfoSchema = {
        shop_id: String(shopInfoData.shop_id || ""),
        shop_name: String(shopInfoData.shop_name || ""),
        is_accepting_queues: Boolean(shopInfoData.settings_is_accepting_queues),
        max_queue_length: Number(
          shopInfoData.settings_max_queue_per_service ?? 50
        ),
        current_queue_length: currentQueueLength,
        estimated_wait_time: estimatedWaitTime,
      };

      return SupabaseQueueJoinMapper.toShopQueueInfoEntity(queueInfoData);
    } catch (error) {
      if (error instanceof ShopCustomerQueueJoinError) {
        throw error;
      }

      throw new ShopCustomerQueueJoinError(
        ShopCustomerQueueJoinErrorType.UNKNOWN,
        "Failed to get shop queue info",
        "SupabaseCustomerQueueJoinRepository.getShopQueueInfo",
        {
          shopId,
          error: error instanceof Error ? error.message : String(error),
        },
        error
      );
    }
  }

  /**
   * Join a queue
   * @param queueJoinData Queue join data
   * @returns Result of the queue join operation
   */
  async joinQueue(
    queueJoinData: Omit<
      QueueJoinEntity,
      "id" | "status" | "createdAt" | "updatedAt"
    >
  ): Promise<JoinQueueResultEntity> {
    try {
      this.logger.info("Joining queue", {
        shopId: queueJoinData.shopId,
        customerName: queueJoinData.customerName,
        serviceCount: queueJoinData.services.length,
      });

      // Create queue using RPC function
      const createdQueueId = await this.dataSource.callRpc<string>(
        "create_queue",
        {
          p_shop_id: queueJoinData.shopId,
          p_customer_name: queueJoinData.customerName,
          p_customer_phone: queueJoinData.customerPhone,
          p_customer_email: null,
          p_customer_id: queueJoinData.customerId || null,
          p_priority: queueJoinData.priority,
          p_note: queueJoinData.specialRequests || null,
          p_services: queueJoinData.services.map((service) => {
            return {
              service_id: service.id,
              quantity: service.quantity,
              price: service.price,
            };
          }),
        }
      );

      if (!createdQueueId) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.UNKNOWN,
          "Failed to create queue",
          "SupabaseCustomerQueueJoinRepository.joinQueue",
          { queueJoinData }
        );
      }

      // Get the complete queue data using the created queue ID
      const queueData = await this.getQueueById(createdQueueId);

      // Return success result with queue data
      const resultData: JoinQueueResultSchema = {
        success: true,
        queue_number: queueData.queueNumber || "",
        estimated_wait_time: 0, // This could be calculated from queue position and shop settings
        message: "Successfully joined the queue",
      };

      return SupabaseQueueJoinMapper.toJoinQueueResultEntity(resultData);
    } catch (error) {
      if (error instanceof ShopCustomerQueueJoinError) {
        throw error;
      }

      throw new ShopCustomerQueueJoinError(
        ShopCustomerQueueJoinErrorType.UNKNOWN,
        "Failed to join queue",
        "SupabaseCustomerQueueJoinRepository.joinQueue",
        {
          shopId: queueJoinData.shopId,
          customerName: queueJoinData.customerName,
          error: error instanceof Error ? error.message : String(error),
        },
        error
      );
    }
  }

  /**
   * Get customer queues with pagination and status filter
   * @param customerId Customer ID
   * @param page Page number (default: 1)
   * @param limit Items per page (default: 10)
   * @param status Optional status filter (default: all statuses)
   * @returns Paginated customer queues data
   */
  async getCustomerQueues(
    customerId: string,
    page: number = 1,
    limit: number = 10,
    status?: QueueStatus
  ): Promise<{
    queues: QueueJoinEntity[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      this.logger.info("Getting customer queues", {
        customerId,
        page,
        limit,
        status,
      });

      // Validate parameters
      if (!customerId) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.VALIDATION_ERROR,
          "Customer ID is required",
          "SupabaseCustomerQueueJoinRepository.getCustomerQueues"
        );
      }

      if (page < 1) page = 1;
      if (limit < 1 || limit > 100) limit = 10;

      // Call RPC function to get public queue info by customer ID
      const result = await this.dataSource.callRpc<
        PublicQueueInfoByCustomerIdSchema[]
      >("get_public_queue_info_by_customer_id", {
        p_customer_id: customerId,
        p_page: page,
        p_limit: limit,
        p_status: status,
      });

      if (!result || !Array.isArray(result)) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.NOT_FOUND,
          "No queues found for customer",
          "SupabaseCustomerQueueJoinRepository.getCustomerQueues",
          { customerId }
        );
      }

      // Transform RPC result to domain entities
      const queues: QueueJoinEntity[] = result.map((queueData) => {
        // Map services from RPC result (services is Json type, need to cast to array)
        const servicesData =
          (queueData.services as Array<{
            service_id: string;
            service_name: string;
            quantity: number;
            price: number;
          }>) || [];

        const services: QueueServiceEntity[] = servicesData.map((service) => ({
          id: service.service_id,
          name: service.service_name,
          price: service.price,
          quantity: service.quantity,
          estimatedTime: 0, // Not available in RPC result
        }));

        return {
          id: queueData.id,
          shopId: queueData.shop_id,
          customerName: queueData.customer_name,
          customerPhone: "", // Not available in public RPC
          customerId: customerId,
          services,
          specialRequests: queueData.note || undefined,
          priority: this.mapPriorityToEnum(queueData.priority),
          status: this.mapStatusToEnum(queueData.status),
          queueNumber: queueData.queue_number,
          createdAt: queueData.created_at,
          updatedAt: queueData.updated_at,
        };
      });

      // Calculate pagination info
      const totalCount = result.length > 0 ? result[0].total_count : 0;
      const totalPages = Math.ceil(totalCount / limit);

      return {
        queues,
        totalCount,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      if (error instanceof ShopCustomerQueueJoinError) {
        throw error;
      }

      throw new ShopCustomerQueueJoinError(
        ShopCustomerQueueJoinErrorType.UNKNOWN,
        "Failed to get customer queues",
        "SupabaseCustomerQueueJoinRepository.getCustomerQueues",
        {
          customerId,
          page,
          limit,
          status,
          error: error instanceof Error ? error.message : String(error),
        },
        error
      );
    }
  }

  /**
   * Get queue by ID
   * @param queueId Queue ID
   * @returns Queue data
   */
  async getQueueById(queueId: string): Promise<QueueJoinEntity> {
    try {
      // Validate parameters
      if (!queueId) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.VALIDATION_ERROR,
          "Queue ID is required",
          "SupabaseCustomerQueueJoinRepository.getQueueById"
        );
      }

      // Call RPC function to get public queue info by ID
      const result = await this.dataSource.callRpc<PublicQueueInfoSchema[]>(
        "get_public_queue_info_by_id",
        {
          p_queue_id: queueId,
        }
      );

      if (!result || result.length === 0) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.NOT_FOUND,
          "Queue not found",
          "SupabaseCustomerQueueJoinRepository.getQueueById",
          { queueId }
        );
      }

      const queueData = result[0];

      // Map services from RPC result (services is Json type, need to cast to array)
      const servicesData =
        (queueData.services as Array<{
          service_id: string;
          service_name: string;
          quantity: number;
          price: number;
        }>) || [];

      const services: QueueServiceEntity[] = servicesData.map((service) => ({
        id: service.service_id,
        name: service.service_name,
        price: service.price,
        quantity: service.quantity,
        estimatedTime: 0, // Not available in RPC result
      }));

      // Transform RPC result to domain entity
      const queue: QueueJoinEntity = {
        id: queueData.id,
        shopId: queueData.shop_id,
        customerName: queueData.customer_name,
        customerPhone: "", // Not available in public RPC
        customerId: "", // Not available in public RPC
        services,
        specialRequests: queueData.note || undefined,
        priority: this.mapPriorityToEnum(queueData.priority),
        status: this.mapStatusToEnum(queueData.status),
        queueNumber: queueData.queue_number,
        createdAt: queueData.created_at,
        updatedAt: queueData.updated_at,
      };

      return queue;
    } catch (error) {
      if (error instanceof ShopCustomerQueueJoinError) {
        throw error;
      }

      throw new ShopCustomerQueueJoinError(
        ShopCustomerQueueJoinErrorType.UNKNOWN,
        "Failed to get queue by ID",
        "SupabaseCustomerQueueJoinRepository.getQueueById",
        {
          queueId,
          error: error instanceof Error ? error.message : String(error),
        },
        error
      );
    }
  }

  /**
   * Map priority string to QueuePriority enum
   * @param priority Priority string from database
   * @returns QueuePriority enum value
   */
  private mapPriorityToEnum(priority: string): QueuePriority {
    switch (priority.toLowerCase()) {
      case "normal":
        return QueuePriority.NORMAL;
      case "high":
        return QueuePriority.HIGH;
      case "urgent":
        return QueuePriority.URGENT;
      default:
        return QueuePriority.NORMAL; // Default to normal if unknown
    }
  }

  /**
   * Map status string to QueueJoinEntity status type
   * @param status Status string from database
   * @returns Status value compatible with QueueJoinEntity
   */
  private mapStatusToEnum(status: string): QueueStatus {
    switch (status.toLowerCase()) {
      case "waiting":
        return QueueStatus.WAITING;
      case "serving":
        return QueueStatus.SERVING;
      case "completed":
        return QueueStatus.COMPLETED;
      case "cancelled":
        return QueueStatus.CANCELLED;
      case "confirmed":
        return QueueStatus.WAITING; // Map confirmed to waiting for customer view
      case "no_show":
        return QueueStatus.CANCELLED; // Map no_show to cancelled for customer view
      default:
        return QueueStatus.WAITING; // Default to waiting if unknown
    }
  }

  /**
   * Get customer by ID
   * @param customerId Customer ID
   * @returns Customer entity
   * @throws ShopCustomerQueueJoinError if the operation fails
   */
  async getCustomerById(customerId: string): Promise<CustomerEntity> {
    try {
      const result = await this.dataSource.callRpc<GetCustomerByIdSchema[]>(
        "get_customer_by_id",
        {
          shop_id_param: "", // This will be handled by the RPC function
          customer_id_param: customerId,
        }
      );

      if (!result || result.length === 0) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.NOT_FOUND,
          "Customer not found",
          "getCustomerById",
          { customerId }
        );
      }

      // Map schema to entity using the mapper
      return CustomerMapper.toEntity(result[0]);
    } catch (error) {
      this.logger.error("Error getting customer by ID", { error, customerId });
      throw new ShopCustomerQueueJoinError(
        ShopCustomerQueueJoinErrorType.OPERATION_FAILED,
        error instanceof Error
          ? error.message
          : "Unknown error getting customer by ID",
        "getCustomerById",
        { customerId },
        error
      );
    }
  }

  /**
   * Get customer by profile ID
   * @param profileId Profile ID
   * @param shopId Shop ID
   * @returns Customer entity or null if not found
   * @throws ShopCustomerQueueJoinError if the operation fails
   */
  async getCustomerByProfileId(
    profileId: string,
    shopId: string
  ): Promise<CustomerEntity | null> {
    try {
      const result = await this.dataSource.callRpc<
        GetCustomerByProfileIdSchema[]
      >("get_customer_by_profile_id", {
        profile_id_param: profileId,
        shop_id_param: shopId,
      });

      if (!result || result.length === 0) {
        return null;
      }

      // Map schema to entity using the mapper
      return CustomerMapper.toEntity(result[0]);
    } catch (error) {
      this.logger.error("Error getting customer by profile ID", {
        error,
        profileId,
        shopId,
      });
      throw new ShopCustomerQueueJoinError(
        ShopCustomerQueueJoinErrorType.OPERATION_FAILED,
        error instanceof Error
          ? error.message
          : "Unknown error getting customer by profile ID",
        "getCustomerByProfileId",
        { profileId, shopId },
        error
      );
    }
  }

  /**
   * Register a new customer
   * @param shopId Shop ID
   * @param name Customer name
   * @param phone Customer phone
   * @returns Customer registration result
   * @throws ShopCustomerQueueJoinError if the operation fails
   */
  async registerCustomer(
    shopId: string,
    name: string,
    phone: string
  ): Promise<{ customerId: string }> {
    try {
      const result = await this.dataSource.callRpc<RegisterCustomerSchema>(
        "register_customer_with_phone",
        {
          p_shop_id: shopId,
          p_name: name,
          p_phone: phone,
        }
      );

      if (!result) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.OPERATION_FAILED,
          "Failed to register customer",
          "registerCustomer",
          { shopId, name, phone }
        );
      }

      // Map schema to result entity using the mapper
      return CustomerMapper.toRegisterCustomerResultEntity(result);
    } catch (error) {
      this.logger.error("Error registering customer", {
        error,
        shopId,
        name,
        phone,
      });
      throw new ShopCustomerQueueJoinError(
        ShopCustomerQueueJoinErrorType.OPERATION_FAILED,
        error instanceof Error
          ? error.message
          : "Unknown error registering customer",
        "registerCustomer",
        { shopId, name, phone },
        error
      );
    }
  }

  /**
   * Link customer to profile
   * @param customerId Customer ID
   * @param phone Customer phone
   * @returns Link operation result
   * @throws ShopCustomerQueueJoinError if the operation fails
   */
  async linkCustomerToProfile(
    customerId: string,
    phone: string
  ): Promise<{ success: boolean }> {
    try {
      const result = await this.dataSource.callRpc<LinkCustomerToProfileSchema>(
        "link_customer_to_profile",
        {
          p_customer_id: customerId,
          p_phone: phone,
        }
      );

      if (!result) {
        throw new ShopCustomerQueueJoinError(
          ShopCustomerQueueJoinErrorType.OPERATION_FAILED,
          "Failed to link customer to profile",
          "linkCustomerToProfile",
          { customerId, phone }
        );
      }

      // Map schema to result entity using the mapper
      return CustomerMapper.toLinkCustomerToProfileResultEntity(result);
    } catch (error) {
      this.logger.error("Error linking customer to profile", {
        error,
        customerId,
        phone,
      });
      throw new ShopCustomerQueueJoinError(
        ShopCustomerQueueJoinErrorType.OPERATION_FAILED,
        error instanceof Error
          ? error.message
          : "Unknown error linking customer to profile",
        "linkCustomerToProfile",
        { customerId, phone },
        error
      );
    }
  }
}
