import {
  DepartmentDTO,
  DepartmentStatsDTO,
  DepartmentsDataDTO,
} from "@/src/application/dtos/shop/backend/department-dto";
import {
  DepartmentEntity,
  DepartmentStatsEntity,
  PaginatedDepartmentsEntity,
} from "@/src/domain/entities/shop/backend/backend-department.entity";

/**
 * Mapper class for converting between domain entities and DTOs
 * Following Clean Architecture principles for separation of concerns
 */
export class DepartmentMapper {
  /**
   * Map domain entity to DTO
   * @param entity Department domain entity
   * @returns Department DTO
   */
  public static toDTO(entity: DepartmentEntity): DepartmentDTO {
    return {
      id: entity.id,
      shopId: entity.shopId,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      employeeCount: entity.employeeCount,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  /**
   * Map stats domain entity to DTO
   * @param entity Department stats domain entity
   * @returns Department stats DTO
   */
  public static statsToDTO(entity: DepartmentStatsEntity): DepartmentStatsDTO {
    return {
      totalDepartments: entity.totalDepartments,
      totalEmployees: entity.totalEmployees,
      activeDepartments: entity.activeDepartments,
      averageEmployeesPerDepartment: entity.averageEmployeesPerDepartment,
    };
  }

  /**
   * Map paginated departments entity to departments data DTO
   * @param entity Paginated departments entity
   * @param stats Department stats entity
   * @returns Departments data DTO
   */
  public static toDepartmentsDataDTO(
    entity: PaginatedDepartmentsEntity,
    stats: DepartmentStatsEntity
  ): DepartmentsDataDTO {
    return {
      departments: entity.data.map((department) => this.toDTO(department)),
      stats: this.statsToDTO(stats),
      totalCount: entity.pagination.totalItems,
    };
  }
}
