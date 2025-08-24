import { BackendActivityEntity, DashboardStatsEntity, PopularVideoEntity, RecentProfileEntity, SystemHealthEntity } from "@/src/domain/entities/backend/backend-dashboard.entity";
import { BackendActivityDbSchema, DashboardStatsDbSchema, PopularVideoDbSchema, RecentProfileDbSchema, SystemHealthDbSchema } from "../../schemas/backend/dashboard-schema";

/**
 * Mapper for converting between database schema and domain entities for backend dashboard
 * Following Single Responsibility Principle from SOLID
 */
export class SupabaseBackendDashboardMapper {

  /**
   * Convert database schema to domain entity for system health data
   * @param dbData Database schema data
   * @returns Domain entity
   */
  static toSystemHealthDomain(dbData: SystemHealthDbSchema): SystemHealthEntity {
    return {
      status: dbData.status,
      cpuUsage: dbData.cpu_usage,
      memoryUsage: dbData.memory_usage,
      diskUsage: dbData.disk_usage,
      lastUpdated: dbData.last_updated
    };
  }

  /**
   * Convert database schema to domain entity for backend activity data
   * @param dbData Database schema data
   * @returns Domain entity
   */
  static toBackendActivityDomain(dbData: BackendActivityDbSchema): BackendActivityEntity {
    return {
      id: dbData.id,
      type: dbData.type,
      timestamp: dbData.timestamp,
      userId: dbData.user_id,
      details: dbData.details
    };
  }

  /**
   * Convert database schema array to domain entity array for backend activity data
   * @param dbDataList Database schema data array
   * @returns Domain entity array
   */
  static toBackendActivityDomainList(dbDataList: BackendActivityDbSchema[]): BackendActivityEntity[] {
    return dbDataList.map(dbData => this.toBackendActivityDomain(dbData));
  }

  static toDashboardStatsEntity(dbData: DashboardStatsDbSchema): DashboardStatsEntity {
    return {
      totalUsers: Number(dbData.total_users),
      userGrowth: Number(dbData.user_growth),
      totalVideos: Number(dbData.total_videos),
      videoGrowth: Number(dbData.video_growth),
      totalCategories: Number(dbData.total_categories),
      todayViews: Number(dbData.today_views),
      viewsGrowth: Number(dbData.views_growth),
    };
  }

  static toPopularVideoEntity(dbData: PopularVideoDbSchema): PopularVideoEntity {
    return {
      id: dbData.id,
      title: dbData.title,
      profileName: dbData.profile_name,
      views: dbData.views
    };
  }

  static toPopularVideoEntityList(dbDataList: PopularVideoDbSchema[]): PopularVideoEntity[] {
    return dbDataList.map(dbData => this.toPopularVideoEntity(dbData));
  }

  static toRecentProfileEntity(dbData: RecentProfileDbSchema): RecentProfileEntity {
    return {
      id: dbData.id,
      name: dbData.name,
      email: dbData.email,
      createdAt: dbData.created_at,
      isActive: dbData.is_active
    };
  }

  static toRecentProfileEntityList(dbDataList: RecentProfileDbSchema[]): RecentProfileEntity[] {
    return dbDataList.map(dbData => this.toRecentProfileEntity(dbData));
  }
}
