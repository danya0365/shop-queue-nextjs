import {
  EmployeeEntity,
  EmployeePermission,
  EmployeeStatsEntity,
  EmployeeStatus,
} from "@/src/domain/entities/shop/backend/backend-employee.entity";
import { PaginationMeta } from "@/src/domain/interfaces/pagination-types";
import {
  EmployeeSchema,
  EmployeeStatsSchema,
} from "@/src/infrastructure/schemas/shop/backend/employee.schema";

/**
 * Mapper class for converting between employee database schema and domain entities
 * Following Clean Architecture principles for separation of concerns
 */
export class SupabaseShopBackendEmployeeMapper {
  /**
   * Map database schema to domain entity
   * @param schema Employee database schema
   * @returns Employee domain entity
   */
  public static toDomain(schema: EmployeeSchema): EmployeeEntity {
    return {
      id: schema.id,
      employeeCode: schema.employee_code,
      name: schema.name,
      email: schema.email,
      phone: schema.phone,
      departmentId: schema.department_id,
      departmentName: schema.department_name,
      position: schema.position_text,
      shopId: schema.shop_id,
      shopName: schema.shop_name,
      status: schema.status as EmployeeStatus,
      hireDate: schema.hire_date,
      lastLogin: schema.last_login,
      permissions: schema.permissions.map((p) => p as EmployeePermission),
      salary: schema.salary,
      notes: schema.notes,
      profileId: schema.profile_id,
      profile: schema.profile_username
        ? {
            id: schema.profile_id || "",
            fullName: schema.profile_full_name || "",
            username: schema.profile_username || "",
            phone: schema.profile_phone || "",
            avatar: schema.profile_avatar || "",
            isActive: schema.profile_is_active || false,
            createdAt: "", // Will be populated if needed
            updatedAt: "", // Will be populated if needed
          }
        : undefined,
      createdAt: schema.created_at,
      updatedAt: schema.updated_at,
    };
  }

  /**
   * Map domain entity to database schema
   * @param entity Employee domain entity
   * @returns Employee database schema
   */
  public static toSchema(entity: EmployeeEntity): EmployeeSchema {
    return {
      id: entity.id,
      employee_code: entity.employeeCode,
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      department_id: entity.departmentId,
      department_name: entity.departmentName,
      position_text: entity.position,
      shop_id: entity.shopId,
      shop_name: entity.shopName,
      status: entity.status,
      hire_date: entity.hireDate,
      last_login: entity.lastLogin,
      permissions: entity.permissions,
      salary: entity.salary,
      notes: entity.notes,
      profile_id: entity.profileId,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    };
  }

  /**
   * Map employee stats schema to domain entity
   * @param schema Employee stats database schema
   * @returns Employee stats domain entity
   */
  public static statsToEntity(
    schema: EmployeeStatsSchema
  ): EmployeeStatsEntity {
    return {
      totalEmployees: schema.total_employees,
      activeEmployees: schema.active_employees,
      loggedInToday: schema.logged_in_today,
      newEmployeesThisMonth: schema.new_employees_this_month,
      byDepartment: {
        management: schema.management_count,
        customerService: schema.customer_service_count,
        technical: schema.technical_count,
        sales: schema.sales_count,
        other: schema.other_count,
      },
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
      hasPrevPage: page > 1,
    };
  }
}
