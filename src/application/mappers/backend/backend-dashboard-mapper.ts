import { 
  BackendActivityEntity, 
  DailyViewsEntity,
  DashboardStatsEntity, 
  MonthlyNewVideosEntity,
  PaginatedUsersEntity,
  PopularVideoEntity, 
  RecentProfileEntity, 
  SystemHealthEntity,
  UserEntity
} from '../../../domain/entities/backend/backend-dashboard.entity';
import { 
  BackendActivityDto, 
  DailyViewsDto,
  DashboardStatsDto, 
  MonthlyNewVideosDto,
  PopularVideoDto, 
  RecentProfileDto, 
  SystemHealthDto,
  UserDto 
} from '../../dtos/backend/backend-dashboard-dto';

/**
 * Mapper class for backend dashboard entities to DTOs
 * Following SOLID principles by separating mapping logic
 */
export class BackendDashboardMapper {
  /**
   * Map system health entity to DTO
   * @param entity System health entity
   * @returns System health DTO
   */
  static toSystemHealthDto(entity: SystemHealthEntity): SystemHealthDto {
    return {
      status: entity.status,
      cpuUsage: entity.cpuUsage,
      memoryUsage: entity.memoryUsage,
      diskUsage: entity.diskUsage,
      lastUpdated: entity.lastUpdated
    };
  }

  /**
   * Map backend activity entity to DTO
   * @param entity Backend activity entity
   * @returns Backend activity DTO
   */
  static toBackendActivityDto(entity: BackendActivityEntity): BackendActivityDto {
    return {
      id: entity.id,
      type: entity.type,
      timestamp: entity.timestamp,
      userId: entity.userId,
      details: entity.details
    };
  }

  /**
   * Map dashboard stats entity to DTO
   * @param entity Dashboard stats entity
   * @returns Dashboard stats DTO
   */
  static toDashboardStatsDto(entity: DashboardStatsEntity): DashboardStatsDto {
    return {
      totalUsers: entity.totalUsers,
      userGrowth: entity.userGrowth,
      totalVideos: entity.totalVideos,
      videoGrowth: entity.videoGrowth,
      totalCategories: entity.totalCategories,
      todayViews: entity.todayViews,
      viewsGrowth: entity.viewsGrowth
    };
  }

  /**
   * Map popular video entity to DTO
   * @param entity Popular video entity
   * @returns Popular video DTO
   */
  static toPopularVideoDto(entity: PopularVideoEntity): PopularVideoDto {
    return {
      id: entity.id,
      title: entity.title,
      profileName: entity.profileName,
      views: entity.views
    };
  }

  /**
   * Map recent profile entity to DTO
   * @param entity Recent profile entity
   * @returns Recent profile DTO
   */
  static toRecentProfileDto(entity: RecentProfileEntity): RecentProfileDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      isActive: entity.isActive,
      createdAt: entity.createdAt
    };
  }

  /**
   * Map array of system health entities to DTOs
   * @param entities Array of system health entities
   * @returns Array of system health DTOs
   */
  static toSystemHealthDtos(entities: SystemHealthEntity[]): SystemHealthDto[] {
    return entities.map(entity => this.toSystemHealthDto(entity));
  }

  /**
   * Map array of backend activity entities to DTOs
   * @param entities Array of backend activity entities
   * @returns Array of backend activity DTOs
   */
  static toBackendActivityDtos(entities: BackendActivityEntity[]): BackendActivityDto[] {
    return entities.map(entity => this.toBackendActivityDto(entity));
  }

  /**
   * Map array of popular video entities to DTOs
   * @param entities Array of popular video entities
   * @returns Array of popular video DTOs
   */
  static toPopularVideoDtos(entities: PopularVideoEntity[]): PopularVideoDto[] {
    return entities.map(entity => this.toPopularVideoDto(entity));
  }

  /**
   * Map array of recent profile entities to DTOs
   * @param entities Array of recent profile entities
   * @returns Array of recent profile DTOs
   */
  static toRecentProfileDtos(entities: RecentProfileEntity[]): RecentProfileDto[] {
    return entities.map(entity => this.toRecentProfileDto(entity));
  }

  /**
   * Map daily views entity to DTO
   * @param entity Daily views entity
   * @returns Daily views DTO
   */
  static toDailyViewsDto(entity: DailyViewsEntity): DailyViewsDto {
    return {
      data: entity.data.map(point => ({
        date: point.date,
        count: point.count
      })),
      totalViews: entity.totalViews,
      averageViews: entity.averageViews
    };
  }

  /**
   * Map monthly new videos entity to DTO
   * @param entity Monthly new videos entity
   * @returns Monthly new videos DTO
   */
  static toMonthlyNewVideosDto(entity: MonthlyNewVideosEntity): MonthlyNewVideosDto {
    return {
      data: entity.data.map(point => ({
        month: point.month,
        count: point.count
      })),
      totalVideos: entity.totalVideos,
      averageVideosPerMonth: entity.averageVideosPerMonth
    };
  }
  
  /**
   * Map user entity to DTO
   * @param entity User entity
   * @returns User DTO
   */
  static toUserDto(entity: UserEntity): UserDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      profilesCount: entity.profilesCount,
      role: entity.role,
      status: entity.status,
      createdAt: entity.createdAt
    };
  }
  
  /**
   * Map array of user entities to DTOs
   * @param entities Array of user entities
   * @returns Array of user DTOs
   */
  static toUserDtos(entities: UserEntity[]): UserDto[] {
    return entities.map(entity => BackendDashboardMapper.toUserDto(entity));
  }
  
  /**
   * Map paginated users entity to DTO
   * @param entity Paginated users entity
   * @returns Object with users array and total count
   */
  static toPaginatedUsersDto(entity: PaginatedUsersEntity): { users: UserDto[], totalUsers: number } {
    return {
      users: BackendDashboardMapper.toUserDtos(entity.users),
      totalUsers: entity.totalUsers
    };
  }
}
