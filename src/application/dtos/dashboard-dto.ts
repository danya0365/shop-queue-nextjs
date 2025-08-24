/**
 * DTO for dashboard data
 * Following Clean Architecture by isolating infrastructure types from application layer
 */
export interface DashboardDataDto {
  videoCount: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  recentVideos: RecentVideoDto[];
}

/**
 * DTO for recent video in dashboard
 */
export interface RecentVideoDto {
  id: string;
  title: string;
  youtubeId: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}
