import { 
  DashboardStatsEntity, 
  PopularServiceEntity, 
  QueueStatusDistributionEntity, 
  RecentActivityEntity 
} from "../../../domain/entities/backend/backend-dashboard.entity";
import { 
  DashboardStatsSchema, 
  PopularServiceSchema, 
  QueueStatusDistributionSchema, 
  RecentActivitySchema 
} from "../../schemas/backend/dashboard.schema";

/**
 * Mapper for dashboard data between domain entities and database schemas
 * Following Clean Architecture principles for infrastructure mappers
 */
export class SupabaseBackendDashboardMapper {
  /**
   * Map dashboard stats schema to domain entity
   * @param schema Dashboard stats schema from database
   * @returns Dashboard stats domain entity
   */
  static statsToEntity(schema: DashboardStatsSchema): DashboardStatsEntity {
    return {
      totalShops: schema.total_shops,
      totalQueues: schema.total_queues,
      totalCustomers: schema.total_customers,
      totalEmployees: schema.total_employees,
      activeQueues: schema.active_queues,
      completedQueuesToday: schema.completed_queues_today,
      totalRevenue: schema.total_revenue,
      averageWaitTime: schema.average_wait_time
    };
  }

  /**
   * Map queue distribution schema to domain entity
   * @param schema Queue distribution schema from database
   * @returns Queue distribution domain entity
   */
  static queueDistributionToEntity(schema: QueueStatusDistributionSchema): QueueStatusDistributionEntity {
    return {
      waiting: schema.waiting,
      serving: schema.serving,
      completed: schema.completed,
      cancelled: schema.cancelled,
      noShow: schema.no_show
    };
  }

  /**
   * Map popular service schema to domain entity
   * @param schema Popular service schema from database
   * @returns Popular service domain entity
   */
  static popularServiceToEntity(schema: PopularServiceSchema): PopularServiceEntity {
    return {
      id: schema.id,
      name: schema.name,
      queueCount: schema.queue_count,
      revenue: schema.revenue,
      category: schema.category
    };
  }

  /**
   * Map recent activity schema to domain entity
   * @param schema Recent activity schema from database
   * @returns Recent activity domain entity
   */
  static recentActivityToEntity(schema: RecentActivitySchema): RecentActivityEntity {
    return {
      id: schema.id,
      type: schema.type as RecentActivityEntity['type'],
      title: schema.title,
      description: schema.description,
      timestamp: schema.timestamp,
      metadata: schema.metadata
    };
  }
}
