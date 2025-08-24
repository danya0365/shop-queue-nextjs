import { Like } from '../../domain/entities/like';
import { LikeDto } from '../dtos/like-dto';

/**
 * Mapper class for converting between Like domain entities and DTOs
 * Following Single Responsibility Principle by isolating mapping logic
 */
export class LikeMapper {
  /**
   * Convert a domain entity to a DTO
   * @param like Domain entity
   * @returns Like DTO
   */
  static toDto(like: Like): LikeDto {
    return {
      id: like.id,
      profileId: like.profileId,
      videoId: like.videoId,
      createdAt: like.createdAt.toISOString(),
    };
  }

  /**
   * Convert a list of domain entities to DTOs
   * @param likes List of domain entities
   * @returns List of Like DTOs
   */
  static toDtoList(likes: Like[]): LikeDto[] {
    return likes.map(like => this.toDto(like));
  }
}
