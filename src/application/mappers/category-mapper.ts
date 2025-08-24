import { Category } from '../../domain/entities/category';
import { CategoryDto } from '../dtos/category-dto';

/**
 * Mapper class for converting between Category domain entities and DTOs
 * Following Single Responsibility Principle by isolating mapping logic
 */
export class CategoryMapper {
  /**
   * Convert a Category domain entity to a CategoryDto
   * @param category Category domain entity
   * @returns CategoryDto for presentation layer
   */
  static toDto(category: Category): CategoryDto {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      createdAt: category.createdAt.toISOString(),
    };
  }

  /**
   * Convert multiple Category domain entities to CategoryDtos
   * @param categories Array of Category domain entities
   * @returns Array of CategoryDtos
   */
  static toDtoList(categories: Category[]): CategoryDto[] {
    return categories.map(category => this.toDto(category));
  }
}
