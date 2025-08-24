import { DashboardData } from "../../infrastructure/schemas/video-schema";
import { DashboardDataDto } from "../dtos/dashboard-dto";

/**
 * Mapper for converting between infrastructure DashboardData and application DashboardDataDto
 * Following Clean Architecture by isolating infrastructure types from application layer
 */
export class DashboardMapper {
  /**
   * Map infrastructure DashboardData to application DashboardDataDto
   * @param data Infrastructure dashboard data
   * @returns Application dashboard data DTO
   */
  static toDto(data: DashboardData): DashboardDataDto {
    return {
      videoCount: data.videoCount,
      totalViews: data.totalViews,
      totalLikes: data.totalLikes,
      totalComments: data.totalComments,
      recentVideos: data.recentVideos.map(video => ({
        id: video.id,
        title: video.title,
        youtubeId: video.youtubeId,
        viewsCount: video.viewsCount,
        likesCount: video.likesCount,
        commentsCount: video.commentsCount,
        createdAt: video.createdAt.toISOString()
      }))
    };
  }
}
