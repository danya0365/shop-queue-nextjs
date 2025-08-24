import { PaginatedResultDto, PaginationParamsDto } from '../dtos/pagination-dto';
import { CreateVideoDto, UpdateVideoDto, VideoDetailsDto, VideoDto } from '../dtos/video-dto';

/**
 * Interface for VideoRepositoryAdapter
 * This interface defines the contract for adapters that work with VideoDto objects
 * Following Clean Architecture by separating domain and application layers
 */
export interface IVideoRepositoryAdapter {
  getAll(): Promise<VideoDto[]>;
  getById(id: string): Promise<VideoDto | null>;
  create(data: CreateVideoDto): Promise<VideoDto>;
  update(id: string, data: UpdateVideoDto): Promise<VideoDto>;
  delete(id: string): Promise<void>;
  incrementViews(id: string): Promise<void>;
  search(query: string, categoryId?: string): Promise<VideoDto[]>;
  getByUser(profileId: string): Promise<VideoDto[]>;
  getLikedByUser(profileId: string): Promise<VideoDto[]>;
  
  // Optional methods that might be available in some implementations
  getRelatedVideos?(id: string, limit?: number): Promise<VideoDto[]>;
  getVideoDetails?(id: string): Promise<VideoDetailsDto | null>;
  
  // Paginated methods for database-level pagination
  getPaginatedMostViewed(pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>>;
  getPaginatedMostRecent(pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>>;
  getPaginatedByUser(profileId: string, pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>>;
  getPaginatedLikedByUser(profileId: string, pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>>;
  getPaginatedVideosByCategory(categoryId: string, pagination: PaginationParamsDto): Promise<PaginatedResultDto<VideoDto>>;
}
