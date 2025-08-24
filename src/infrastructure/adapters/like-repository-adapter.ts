import { CreateLikeInputDto, LikeDto, LikeToggleResponseDto } from '../../application/dtos/like-dto';
import {
  LikeAlreadyExistsException,
  LikeNotFoundException,
  LikeRepositoryException
} from '../../application/exceptions/like-exceptions';
import { ILikeRepositoryAdapter } from '../../application/interfaces/like-repository-adapter.interface';
import { LikeMapper } from '../../application/mappers/like-mapper';
import { LikeCreate } from '../../domain/entities/like';
import { LikeRepository } from '../../domain/repositories/like-repository';
import { VideoRepository } from '../../domain/repositories/video-repository';
import {
  DatabaseOperationException,
  EntityAlreadyExistsException,
  EntityNotFoundException
} from '../exceptions/repository-exceptions';

/**
 * Adapter for LikeRepository that converts between domain entities and DTOs
 * Following Clean Architecture by separating infrastructure and application layers
 * Implements ILikeRepositoryAdapter interface for dependency inversion
 */
export class LikeRepositoryAdapter implements ILikeRepositoryAdapter {
  /**
   * Constructor with dependency injection
   * @param repository The actual repository implementation for likes
   * @param videoRepository The repository implementation for videos
   */
  constructor(
    private readonly repository: LikeRepository,
    private readonly videoRepository: VideoRepository
  ) {}

  /**
   * Get all likes by a user as DTOs
   * @param profileId Profile ID
   * @returns Array of like DTOs
   * @throws LikeRepositoryException if there's an error in the repository
   */
  async getByUser(profileId: string): Promise<LikeDto[]> {
    try {
      const likes = await this.repository.getByUser(profileId);
      return LikeMapper.toDtoList(likes);
    } catch (error) {
      if (error instanceof DatabaseOperationException) {
        throw new LikeRepositoryException(error.message, error);
      }
      throw error;
    }
  }

  /**
   * Get all likes for a video as DTOs
   * @param videoId Video ID
   * @returns Array of like DTOs
   * @throws LikeRepositoryException if there's an error in the repository
   */
  async getByVideo(videoId: string): Promise<LikeDto[]> {
    try {
      const likes = await this.repository.getByVideo(videoId);
      return LikeMapper.toDtoList(likes);
    } catch (error) {
      if (error instanceof DatabaseOperationException) {
        throw new LikeRepositoryException(error.message, error);
      }
      throw error;
    }
  }

  /**
   * Get like status for a video by a user
   * @param profileId Profile ID
   * @param videoId Video ID
   * @returns Boolean indicating if the video is liked by the user
   * @throws LikeRepositoryException if there's an error in the repository
   */
  async getLikeStatus(profileId: string, videoId: string): Promise<boolean> {
    try {
      const like = await this.repository.getByUserAndVideo(profileId, videoId);
      return !!like;
    } catch (error) {
      if (error instanceof DatabaseOperationException) {
        throw new LikeRepositoryException(error.message, error);
      }
      throw error;
    }
  }

  /**
   * Toggle like status for a video
   * @param input Like input data
   * @returns Object containing like status and count
   * @throws LikeRepositoryException if there's an error in the repository
   */
  async toggleLike(input: CreateLikeInputDto): Promise<LikeToggleResponseDto> {
    try {
      const { profileId, videoId } = input;
      const existingLike = await this.repository.getByUserAndVideo(profileId, videoId);
      
      if (existingLike) {
        // Unlike
        await this.repository.deleteByUserAndVideo(profileId, videoId);
        const video = await this.videoRepository.getById(videoId);
        return { 
          liked: false, 
          likesCount: video?.likesCount || 0 
        };
      } else {
        // Like
        const likeCreate: LikeCreate = {
          profileId,
          videoId
        };
        await this.repository.create(likeCreate);
        const video = await this.videoRepository.getById(videoId);
        return { 
          liked: true, 
          likesCount: video?.likesCount || 0 
        };
      }
    } catch (error) {
      if (error instanceof EntityAlreadyExistsException) {
        throw new LikeAlreadyExistsException(input.profileId, input.videoId);
      }
      if (error instanceof EntityNotFoundException) {
        throw new LikeNotFoundException(input.videoId);
      }
      if (error instanceof DatabaseOperationException) {
        throw new LikeRepositoryException(error.message, error);
      }
      throw error;
    }
  }
}
