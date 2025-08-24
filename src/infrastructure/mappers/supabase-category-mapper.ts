import { Category } from '../../domain/entities/category';
import { CategoryDbSchema } from '../schemas/category-schema';

/**
 * Mapper class for converting between Supabase database schema and domain entities
 * Following SOLID principles by separating mapping responsibility from repository
 */
export class SupabaseCategoryMapper {
  /**
   * Convert a database schema object to a domain entity
   * @param data Database schema object
   * @returns Domain entity
   */
  static toDomain(data: CategoryDbSchema): Category {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description || undefined, // Convert null to undefined to match Category type
      createdAt: new Date(data.created_at)
    };
  }

  /**
   * Convert an array of database schema objects to domain entities
   * @param data Array of database schema objects
   * @returns Array of domain entities
   */
  static toDomainList(data: CategoryDbSchema[]): Category[] {
    return data.map(item => this.toDomain(item));
  }
}
