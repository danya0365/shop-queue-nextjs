import { Video, VideoCreate } from '../../domain/entities/video';
import { VideoWithCategory, VideoWithDetails } from '../../domain/entities/video-with-relations';
import { CreateVideoDto, UpdateVideoDto, VideoDetailsDto, VideoDto, VideoWithCategoryDto } from '../dtos/video-dto';

/**
 * VideoMapper
 * 
 * Responsible for mapping between domain entities and DTOs
 * Following the Mapper pattern in Clean Architecture
 */
export class VideoMapper {
  /**
   * Map domain Video entity to VideoDto
   */
  static toDto(video: Video): VideoDto {
    return {
      id: video.id,
      title: video.title,
      description: video.description,
      url: video.youtubeId, // Map youtubeId to url in DTO
      thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`, // Generate thumbnail URL from youtubeId
      categoryId: video.categoryId,
      profileId: video.profileId,
      views: video.viewsCount, // Map viewsCount to views in DTO
      createdAt: video.createdAt.toISOString(), // Convert Date to string
      updatedAt: video.updatedAt.toISOString(), // Convert Date to string
      // เพิ่ม field ที่ต้องการใช้ใน View
      youtubeId: video.youtubeId,
      viewsCount: video.viewsCount,
      likesCount: video.likesCount || 0
    };
  }

  /**
   * Map DTO to domain entity
   */
  static toDomain(dto: VideoDto): Partial<Video> {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      youtubeId: dto.youtubeId, // Map youtubeId in DTO to youtubeId in domain
      categoryId: dto.categoryId,
      profileId: dto.profileId,
      viewsCount: dto.views, // Map views in DTO to viewsCount in domain
      createdAt: new Date(dto.createdAt), // Convert string to Date
      updatedAt: new Date(dto.updatedAt) // Convert string to Date
    };
  }

  /**
   * Map CreateVideoDto to domain entity
   */
  static createDtoToDomain(dto: CreateVideoDto, profileId: string): VideoCreate {
    return {
      title: dto.title,
      description: dto.description,
      youtubeId: dto.youtubeId,
      categoryId: dto.categoryId,
      profileId: profileId
    };
  }
  
  /**
   * Map UpdateVideoDto to domain entity for partial updates
   */
  static updateDtoToDomain(dto: UpdateVideoDto): Partial<Video> {
    const result: Partial<Video> = {};
    
    if (dto.title !== undefined) result.title = dto.title;
    if (dto.description !== undefined) result.description = dto.description;
    if (dto.thumbnailUrl !== undefined) {
      // No direct mapping for thumbnailUrl in domain entity
      // This would be handled by the repository implementation
    }
    if (dto.categoryId !== undefined) result.categoryId = dto.categoryId;
    
    return result;
  }

  /**
   * Map domain entity to DTO with details
   */
  static detailsToDto(videoDetails: VideoWithDetails): VideoDetailsDto {
    return {
      ...this.toDto(videoDetails),
      category: videoDetails.category ? {
        id: videoDetails.category.id,
        name: videoDetails.category.name,
        slug: videoDetails.category.slug
      } : {
        id: '',
        name: 'Uncategorized',
        slug: 'uncategorized'
      },
      profile: videoDetails.profile ? {
        id: videoDetails.profile.id,
        name: videoDetails.profile.username || videoDetails.profile.fullName || 'Unknown', // Map username to name in DTO
        avatarUrl: videoDetails.profile.avatarUrl || '',
        username: videoDetails.profile.username || 'unknown_user' // เพิ่ม field username ตามที่ต้องการ
      } : {
        id: '',
        name: 'Unknown',
        avatarUrl: '',
        username: 'unknown_user' // เพิ่ม field username ตามที่ต้องการ
      },
      isLiked: videoDetails.isLiked,
      likeCount: videoDetails.likesCount || 0, // Use likesCount from domain entity
      commentCount: 0 // This would come from a separate repository
    };
  }

  /**
   * Map array of Video entities to array of VideoDtos
   */
  static toDtoList(videos: Video[]): VideoDto[] {
    return videos.map(video => this.toDto(video));
  }

  /**
   * Map domain entity with category to VideoWithCategoryDto
   */
  static toVideoWithCategoryDto(videoWithCategory: VideoWithCategory): VideoWithCategoryDto {
    return {
      ...this.toDto(videoWithCategory),
      category: videoWithCategory.category ? {
        id: videoWithCategory.category.id,
        name: videoWithCategory.category.name,
        slug: videoWithCategory.category.slug
      } : null,
      profile: videoWithCategory.profile ? {
        id: videoWithCategory.profile.id,
        name: videoWithCategory.profile.username || videoWithCategory.profile.fullName || 'Unknown', // Map username to name in DTO
        avatarUrl: videoWithCategory.profile.avatarUrl || '',
        username: videoWithCategory.profile.username || 'unknown_user' // เพิ่ม field username ตามที่ต้องการ
      } : null
    };
  }
}
