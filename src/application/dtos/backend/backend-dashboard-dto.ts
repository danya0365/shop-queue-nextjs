/**
 * DTOs for backend dashboard data
 * Following SOLID principles by separating data transfer objects from domain entities
 */

/**
 * DTO for dashboard statistics
 */
export interface DashboardStatsDto {
  totalUsers: number;
  userGrowth: number;
  totalVideos: number;
  videoGrowth: number;
  totalCategories: number;
  todayViews: number;
  viewsGrowth: number;
}

/**
 * DTO for daily views data point
 */
export interface DailyViewsDataPointDto {
  date: string;
  count: number;
}

/**
 * DTO for daily views data
 */
export interface DailyViewsDto {
  data: DailyViewsDataPointDto[];
  totalViews: number;
  averageViews: number;
}

/**
 * DTO for monthly new videos data point
 */
export interface MonthlyNewVideosDataPointDto {
  month: string;
  count: number;
}

/**
 * DTO for monthly new videos data
 */
export interface MonthlyNewVideosDto {
  data: MonthlyNewVideosDataPointDto[];
  totalVideos: number;
  averageVideosPerMonth: number;
}

/**
 * DTO for popular videos
 */
export interface PopularVideoDto {
  id: string;
  title: string;
  profileName: string;
  views: number;
}

/**
 * DTO for recent profiles
 */
export interface RecentProfileDto {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * DTO for backend activity data
 */
export interface BackendActivityDto {
  id: string;
  type: string;
  timestamp: string;
  userId?: string;
  details: Record<string, unknown>;
}

/**
 * DTO for system health data
 */
export interface SystemHealthDto {
  status: 'healthy' | 'warning' | 'critical';
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  lastUpdated: string;
}

/**
 * DTO for user data
 */
export interface UserDto {
  id: string;
  name: string;
  email: string;
  profilesCount: number;
  role: string;
  status: string;
  createdAt: string;
}
