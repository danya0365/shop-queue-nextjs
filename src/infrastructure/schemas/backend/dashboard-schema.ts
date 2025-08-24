
/**
 * Database schema for backend activity data
 */
export interface BackendActivityDbSchema {
  id: string;
  type: string;
  timestamp: string;
  user_id?: string;
  details: Record<string, unknown>;
}

/**
 * Database schema for system health data
 */
export interface SystemHealthDbSchema {
  status: 'healthy' | 'warning' | 'critical';
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  last_updated: string;
}

/**
 * Database schema for dashboard statistics
 */
export interface DashboardStatsDbSchema {
  total_users: string;
  user_growth: string;
  total_videos: string;
  video_growth: string;
  total_categories: string;
  today_views: string;
  views_growth: string;
}

/**
 * Database schema for popular videos
 */
export interface PopularVideoDbSchema {
  id: string;
  title: string;
  profile_name: string;
  views: number;
}

/**
 * Database schema for recent profiles
 */
export interface RecentProfileDbSchema {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

