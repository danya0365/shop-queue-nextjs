import { Like } from "../../domain/entities/like";
import { LikeDbSchema } from "../schemas/like-schema";

/**
 * Mapper class for converting between Like domain entity and database schema
 * Following SOLID principles by separating mapping logic from repository
 */
export class SupabaseLikeMapper {
  /**
   * Convert a database schema object to a domain entity
   * @param data Database schema object
   * @returns Like domain entity
   */
  static toDomain(data: LikeDbSchema): Like {
    return {
      id: data.id,
      profileId: data.profile_id,
      videoId: data.video_id,
      createdAt: new Date(data.created_at)
    };
  }

  /**
   * Convert a list of database schema objects to domain entities
   * @param data List of database schema objects
   * @returns Array of Like domain entities
   */
  static toDomainList(data: LikeDbSchema[]): Like[] {
    return data.map(item => this.toDomain(item));
  }
}
