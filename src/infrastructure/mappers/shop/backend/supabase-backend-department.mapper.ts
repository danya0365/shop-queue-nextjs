import { DepartmentEntity, DepartmentStatsEntity } from "@/src/domain/entities/shop/backend/backend-department.entity";
import { PaginationMeta } from "@/src/domain/interfaces/pagination-types";
import { DepartmentSchema, DepartmentStatsSchema } from "@/src/infrastructure/schemas/shop/backend/department.schema";

/**
 * Mapper class for converting between department database schema and domain entities
 * Following Clean Architecture principles for separation of concerns
 */
export class SupabaseShopBackendDepartmentMapper {
  /**
   * Map database schema to domain entity
   * @param schema Department database schema
   * @returns Department domain entity
   */
  public static toDomain(schema: DepartmentSchema): DepartmentEntity {
    return {
      id: schema.id,
      shopId: schema.shop_id,
      shopName: schema.shop_name,
      name: schema.name,
      slug: schema.slug,
      description: schema.description,
      employeeCount: schema.employee_count,
      createdAt: schema.created_at,
      updatedAt: schema.updated_at
    };
  }

  /**
   * Map domain entity to database schema
   * @param entity Department domain entity
   * @returns Department database schema
   */
  public static toSchema(entity: DepartmentEntity): DepartmentSchema {
    return {
      id: entity.id,
      shop_id: entity.shopId,
      shop_name: entity.shopName,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      employee_count: entity.employeeCount,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt
    };
  }

  /**
   * Map department stats schema to domain entity
   * @param schema Department stats database schema
   * @returns Department stats domain entity
   */
  public static statsToEntity(schema: DepartmentStatsSchema): DepartmentStatsEntity {
    return {
      totalDepartments: schema.total_departments,
      totalEmployees: schema.total_employees,
      activeDepartments: schema.active_departments,
      averageEmployeesPerDepartment: schema.average_employees_per_department
    };
  }

  /**
   * Create pagination metadata from database results
   * @param page Current page number
   * @param limit Items per page
   * @param totalItems Total number of items
   * @returns Pagination metadata
   */
  public static createPaginationMeta(
    page: number,
    limit: number,
    totalItems: number
  ): PaginationMeta {
    const totalPages = Math.ceil(totalItems / limit);

    return {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }
}
