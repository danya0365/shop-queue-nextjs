import type {
  CustomerHistoryDataDTO,
  CustomerQueueHistoryDTO,
  CustomerStatsDTO,
  HistoryFiltersDTO,
  PaginationDTO,
} from "@/src/application/dtos/shop/customer/customer-history-dto";
import type {
  CustomerQueueHistoryEntity,
  CustomerStatsEntity,
  CustomerInfoEntity,
} from "@/src/domain/entities/shop/customer/customer-history.entity";

/**
 * Mapper for converting between customer history domain entities and DTOs
 * Following Clean Architecture principles
 */
export class CustomerHistoryMapper {
  /**
   * Convert domain entities to CustomerHistoryDataDTO
   */
  static toDTO(data: {
    queueHistory: CustomerQueueHistoryEntity[];
    customerStats: CustomerStatsEntity;
    customerInfo: CustomerInfoEntity;
    filters: {
      status: "all" | "completed" | "cancelled" | "no_show";
      dateRange: "all" | "month" | "quarter" | "year";
      shop: string;
      startDate?: string;
      endDate?: string;
    };
    pagination?: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }): CustomerHistoryDataDTO {
    const queueHistory: CustomerQueueHistoryDTO[] = data.queueHistory.map(queue => ({
      id: queue.id,
      queueNumber: queue.queueNumber,
      shopName: queue.shopName,
      services: queue.services.map(service => ({
        id: service.id,
        name: service.name,
        price: service.price,
        quantity: service.quantity,
      })),
      totalAmount: queue.totalAmount,
      status: queue.status,
      queueDate: queue.queueDate,
      queueTime: queue.queueTime,
      completedAt: queue.completedAt,
      waitTime: queue.waitTime,
      serviceTime: queue.serviceTime,
      rating: queue.rating,
      feedback: queue.feedback,
      employeeName: queue.employeeName,
      paymentMethod: queue.paymentMethod,
    }));

    const customerStats: CustomerStatsDTO = {
      totalQueues: data.customerStats.totalQueues,
      completedQueues: data.customerStats.completedQueues,
      cancelledQueues: data.customerStats.cancelledQueues,
      totalSpent: data.customerStats.totalSpent,
      averageRating: data.customerStats.averageRating,
      favoriteService: data.customerStats.favoriteService,
      memberSince: data.customerStats.memberSince,
    };

    const filters: HistoryFiltersDTO = {
      status: data.filters.status,
      dateRange: data.filters.dateRange,
      shop: data.filters.shop,
      startDate: data.filters.startDate,
      endDate: data.filters.endDate,
    };

    const pagination: PaginationDTO | undefined = data.pagination ? {
      currentPage: data.pagination.currentPage,
      perPage: data.pagination.perPage,
      totalItems: data.pagination.totalItems,
      totalPages: data.pagination.totalPages,
      hasNext: data.pagination.hasNext,
      hasPrev: data.pagination.hasPrev,
    } : undefined;

    return {
      queueHistory,
      customerStats,
      filters,
      customerName: data.customerInfo.customerName,
      pagination,
    };
  }

  /**
   * Convert DTO to domain entity (if needed for create/update operations)
   */
  static toDomain(dto: CustomerHistoryDataDTO) {
    // This method can be implemented if needed for create/update operations
    // For now, we primarily need toDomain for reading data
    throw new Error("toDomain not implemented for CustomerHistoryMapper - not needed for read operations");
  }
}
