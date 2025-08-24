/**
 * Database schema for videos table
 * Following SOLID principles and Clean Architecture
 */
export interface VideoDbSchema extends Record<string, unknown> {
  id: string;
  title: string;
  description: string;
  youtube_id: string;
  category_id: string;
  profile_id: string;
  created_at: string;
  updated_at: string;
  views_count: number;
  likes_count: number;
  duration_seconds: number;
}

/**
 * Database schema for video details from RPC function
 */
export interface VideoDetailsDbSchema extends VideoDbSchema {
  category_name: string;
  category_slug: string;
  category_description?: string;
  username: string;
  avatar_url?: string;
  is_liked?: boolean;
}

/**
 * Database schema for dashboard data from RPC function
 */
export interface DashboardDataDbSchema {
  video_count: number | string;
  total_views: number | string;
  total_likes: number | string;
  total_comments: number | string;
  recent_videos?: {
    id: string;
    title: string;
    youtube_id: string;
    views_count: number;
    likes_count: number;
    comments_count: number;
    created_at: string;
  }[];
}

/**
 * Dashboard data domain entity
 */
export interface DashboardData {
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
