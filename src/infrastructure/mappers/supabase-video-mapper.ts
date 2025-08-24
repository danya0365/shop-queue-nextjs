import { Category } from "../../domain/entities/category";
import { Profile } from "../../domain/entities/profile";
import { Video, VideoCreate } from "../../domain/entities/video";
import { VideoWithDetails } from "../../domain/entities/video-with-relations";
import {
  DashboardData,
  DashboardDataDbSchema,
  VideoDbSchema,
  VideoDetailsDbSchema,
} from "../schemas/video-schema";

/**
 * Mapper for converting between Supabase database schema and domain entities
 * Following SOLID principles and Clean Architecture
 */
export class SupabaseVideoMapper {
  /**
   * Convert a database video object to a domain entity
   * @param data Database video object
   * @returns Domain video entity
   */
  static toDomain(data: VideoDbSchema): Video {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      youtubeId: data.youtube_id,
      categoryId: data.category_id,
      profileId: data.profile_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at || data.created_at),
      viewsCount: data.views_count || 0,
      likesCount: data.likes_count || 0,
      durationSeconds: data.duration_seconds || 0,
    };
  }

  /**
   * Convert a list of database video objects to domain entities
   * @param data List of database video objects
   * @returns List of domain video entities
   */
  static toDomainList(data: VideoDbSchema[]): Video[] {
    return data.map((item) => this.toDomain(item));
  }

  /**
   * Convert a domain video entity to a database object
   * @param domain Domain video entity
   * @returns Database video object
   */
  static toDatabase(domain: VideoCreate): Partial<VideoDbSchema> {
    return {
      title: domain.title,
      description: domain.description,
      youtube_id: domain.youtubeId,
      category_id: domain.categoryId,
      profile_id: domain.profileId,
      duration_seconds: domain.durationSeconds || 0,
    };
  }

  /**
   * Convert a video details response from RPC to a domain entity with relations
   * @param data Video details data from RPC
   * @returns Domain video with details entity
   */
  static toDetailsDomain(data: VideoDetailsDbSchema): VideoWithDetails {
    // Create the base video entity
    const video = this.toDomain({
      id: String(data.id),
      title: String(data.title),
      description: String(data.description),
      youtube_id: String(data.youtube_id),
      category_id: String(data.category_id),
      profile_id: String(data.user_id || data.profile_id),
      created_at: String(data.created_at),
      updated_at: String(data.updated_at),
      views_count: Number(data.views_count || 0),
      likes_count: Number(data.likes_count || 0),
      duration_seconds: Number(data.duration_seconds || 0),
    } as VideoDbSchema);

    // Create the category entity if data is available
    const category: Category = {
      id: String(data.category_id),
      name: String(data.category_name),
      slug: String(data.category_slug),
      description: data.category_description
        ? String(data.category_description)
        : undefined,
      createdAt: new Date(),
    };

    // Create the profile entity if data is available
    const profile: Profile = {
      id: String(data.user_id || data.profile_id),
      username: String(data.username),
      avatarUrl: String(data.avatar_url),
      authId: data.auth_id ? String(data.auth_id) : "",
      role: (data.role ? String(data.role) : "user") as "user" | "admin",
      isActive: data.is_active !== undefined ? Boolean(data.is_active) : true,
      createdAt: new Date(String(data.user_created_at || data.created_at)),
      updatedAt: new Date(
        String(data.user_updated_at || data.updated_at || data.created_at)
      ),
    };

    // Return the complete video with details
    return {
      ...video,
      category,
      profile,
      isLiked: Boolean(data.is_liked || false),
    };
  }

  /**
   * Convert a list of video details responses to domain entities with relations
   * @param data List of video details data from RPC
   * @returns List of domain video with details entities
   */
  static toDetailsDomainList(data: VideoDetailsDbSchema[]): VideoWithDetails[] {
    return data.map((item) => this.toDetailsDomain(item));
  }

  /**
   * Convert dashboard data from RPC to a domain dashboard data object
   * @param data Dashboard data from RPC
   * @returns Domain dashboard data object
   */
  static toDashboardDomain(data: DashboardDataDbSchema): DashboardData {
    return {
      videoCount: Number(data.video_count || 0),
      totalViews: Number(data.total_views || 0),
      totalLikes: Number(data.total_likes || 0),
      totalComments: Number(data.total_comments || 0),
      recentVideos: Array.isArray(data.recent_videos)
        ? data.recent_videos.map((video) => ({
            id: String(video.id),
            title: String(video.title),
            youtubeId: String(video.youtube_id),
            viewsCount: Number(video.views_count || 0),
            likesCount: Number(video.likes_count || 0),
            commentsCount: Number(video.comments_count || 0),
            createdAt: new Date(String(video.created_at)),
          }))
        : [],
    };
  }
}
