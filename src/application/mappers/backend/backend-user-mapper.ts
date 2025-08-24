import { UserEntity } from "../../../domain/entities/backend/backend-user.entity";
import { UserDto } from "../../dtos/backend/backend-user-dto";
import { PaginatedResultDto } from "../../dtos/pagination-dto";

/**
 * Mapper class for backend dashboard entities to DTOs
 * Following SOLID principles by separating mapping logic
 */
export class BackendUserMapper {
  /**
   * Map user entity to DTO
   * @param entity User entity
   * @returns User DTO
   */
  static toUserDto(entity: UserEntity): UserDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      profilesCount: entity.profilesCount,
      role: entity.role,
      status: entity.status,
      createdAt: entity.createdAt,
    };
  }

  /**
   * Map array of user entities to DTOs
   * @param entities Array of user entities
   * @returns Array of user DTOs
   */
  static toUserDtos(entities: UserEntity[]): UserDto[] {
    return entities.map((entity) => BackendUserMapper.toUserDto(entity));
  }

  /**
   * Map paginated users entity to DTO
   * @param entity Paginated users entity with domain structure
   * @returns PaginatedResultDto with UserDto items
   */
  static toPaginatedUsersDto(entity: {
    data: UserEntity[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }): PaginatedResultDto<UserDto> {
    return {
      data: BackendUserMapper.toUserDtos(entity.data),
      pagination: {
        currentPage: entity.pagination.currentPage,
        totalPages: entity.pagination.totalPages,
        totalItems: entity.pagination.totalItems,
        itemsPerPage: entity.pagination.itemsPerPage,
        hasNextPage: entity.pagination.hasNextPage,
        hasPrevPage: entity.pagination.hasPrevPage
      }
    };
  }
}
