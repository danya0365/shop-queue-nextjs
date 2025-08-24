
/**
 * Domain entity for dashboard statistics
 */
export interface DashboardStatsEntity {
  totalUsers: number;
  userGrowth: number;
  totalVideos: number;
  videoGrowth: number;
  totalCategories: number;
  todayViews: number;
  viewsGrowth: number;
}

/**
 * Domain entity for popular videos
 */
export interface PopularVideoEntity {
  id: string;
  title: string;
  profileName: string;
  views: number;
}

/**
 * Domain entity for recent profiles
 */
export interface RecentProfileEntity {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Domain entity for backend activity data
 */
export interface BackendActivityEntity {
  id: string;
  type: string;
  timestamp: string;
  userId?: string;
  details: Record<string, unknown>;
}

/**
 * Domain entity for daily views data point
 */
export interface DailyViewsDataPointEntity {
  date: string;
  count: number;
}

/**
 * Domain entity for daily views data
 */
export interface DailyViewsEntity {
  data: DailyViewsDataPointEntity[];
  totalViews: number;
  averageViews: number;
}

/**
 * Domain entity for monthly new videos data point
 */
export interface MonthlyNewVideosDataPointEntity {
  month: string;
  count: number;
}

/**
 * Domain entity for monthly new videos data
 */
export interface MonthlyNewVideosEntity {
  data: MonthlyNewVideosDataPointEntity[];
  totalVideos: number;
  averageVideosPerMonth: number;
}

/**
 * Domain entity for system health data
 */
export interface SystemHealthEntity {
  status: 'healthy' | 'warning' | 'critical';
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  lastUpdated: string;
}

/**
 * Domain entity for user data
 */
export interface UserEntity {
  id: string;
  name: string;
  email: string;
  profilesCount: number;
  role: string;
  status: string;
  createdAt: string;
}

/**
 * Domain entity for paginated users data
 */
export interface PaginatedUsersEntity {
  users: UserEntity[];
  totalUsers: number;
}
