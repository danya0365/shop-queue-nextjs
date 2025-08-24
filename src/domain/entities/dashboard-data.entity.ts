/**
 * Domain entity for dashboard data
 * This represents the core dashboard data structure in the domain layer
 */
export interface DashboardDataEntity {
  videoCount: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  recentVideos: {
    id: string;
    title: string;
    youtubeId: string;
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
    createdAt: Date;
  }[];
}
