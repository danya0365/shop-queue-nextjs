import {
  EmployeeDTO,
  EmployeeStatsDTO,
  PaginatedEmployeesDTO,
} from "@/src/application/dtos/shop/backend/employees-dto";
import {
  EmployeeEntity,
  EmployeeStatsEntity,
  PaginatedEmployeesEntity,
} from "@/src/domain/entities/shop/backend/backend-employee.entity";

/**
 * Mapper class for converting between domain entities and DTOs
 * Following Clean Architecture principles for separation of concerns
 */
export class EmployeeMapper {
  /**
   * Map domain entity to DTO
   * @param entity Employee domain entity
   * @returns Employee DTO
   */
  public static toDTO(entity: EmployeeEntity): EmployeeDTO {
    return {
      id: entity.id,
      employeeCode: entity.employeeCode,
      name: entity.name,
      email: entity.email || undefined,
      phone: entity.phone || undefined,
      departmentId: entity.departmentId || undefined,
      departmentName: entity.departmentName || undefined,
      position: entity.position,
      shopId: entity.shopId || undefined,
      shopName: entity.shopName || undefined,
      status: entity.status,
      hireDate: entity.hireDate,
      lastLogin: entity.lastLogin || undefined,
      permissions: entity.permissions || [],
      salary: entity.salary || undefined,
      notes: entity.notes || undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      profileId: entity.profileId || undefined,
      profile: entity.profile
        ? {
            id: entity.profile.id,
            fullName: entity.profile.fullName,
            username: entity.profile.username || "",
            phone: entity.profile.phone || "",
            avatar: entity.profile.avatar || "",
            isActive: entity.profile.isActive,
            createdAt: entity.profile.createdAt || "",
            updatedAt: entity.profile.updatedAt || "",
          }
        : undefined,
      todayStats: {
        queuesServed: 0,
        revenue: 0,
        averageServiceTime: 0,
        rating: 0,
      },
    };
  }

  /**
   * Map stats domain entity to DTO
   * @param entity Employee stats domain entity
   * @returns Employee stats DTO
   */
  public static statsToDTO(entity: EmployeeStatsEntity): EmployeeStatsDTO {
    return {
      totalEmployees: entity.totalEmployees,
      activeEmployees: entity.activeEmployees,
      loggedInToday: entity.loggedInToday,
      newEmployeesThisMonth: entity.newEmployeesThisMonth,
      byDepartment: {
        management: entity.byDepartment.management,
        customerService: entity.byDepartment.customerService,
        technical: entity.byDepartment.technical,
        sales: entity.byDepartment.sales,
        other: entity.byDepartment.other,
      },
    };
  }

  /**
   * Map paginated employees entity to DTO
   * @param entity Paginated employees entity
   * @returns Paginated employees DTO
   */
  public static toPaginatedDTO(
    entity: PaginatedEmployeesEntity
  ): PaginatedEmployeesDTO {
    return {
      data: entity.data.map((employee) => this.toDTO(employee)),
      pagination: {
        currentPage: entity.pagination.currentPage,
        totalPages: entity.pagination.totalPages,
        totalItems: entity.pagination.totalItems,
        itemsPerPage: entity.pagination.itemsPerPage,
        hasNextPage: entity.pagination.hasNextPage,
        hasPrevPage: entity.pagination.hasPrevPage,
      },
    };
  }
}
