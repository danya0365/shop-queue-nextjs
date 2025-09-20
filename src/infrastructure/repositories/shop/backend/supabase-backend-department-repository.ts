import {
  CreateDepartmentEntity,
  DepartmentEntity,
  DepartmentStatsEntity,
  PaginatedDepartmentsEntity,
} from "@/src/domain/entities/shop/backend/backend-department.entity";
import {
  DatabaseDataSource,
  FilterOperator,
  QueryOptions,
  SortDirection,
} from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import {
  ShopBackendDepartmentError,
  ShopBackendDepartmentErrorType,
  ShopBackendDepartmentRepository,
} from "@/src/domain/repositories/shop/backend/backend-department-repository";
import { SupabaseShopBackendDepartmentMapper } from "@/src/infrastructure/mappers/shop/backend/supabase-backend-department.mapper";
import {
  DepartmentSchema,
  DepartmentStatsSchema,
} from "@/src/infrastructure/schemas/shop/backend/department.schema";
import { StandardRepository } from "../../base/standard-repository";

// Extended types for joined data
type DepartmentWithJoins = DepartmentSchema & {
  shops?: { name?: string };
};
type DepartmentSchemaRecord = Record<string, unknown> & DepartmentSchema;
type DepartmentStatsSchemaRecord = Record<string, unknown> &
  DepartmentStatsSchema;

/**
 * Supabase implementation of the department repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseShopBackendDepartmentRepository
  extends StandardRepository
  implements ShopBackendDepartmentRepository
{
  constructor(dataSource: DatabaseDataSource, logger: Logger) {
    super(dataSource, logger, "ShopBackendDepartment");
  }

  /**
   * Get paginated departments data from database
   * @param params Pagination and filter parameters
   * @returns Paginated departments data
   */
  async getPaginatedDepartments(
    params: PaginationParams & {
      filters?: {
        searchQuery?: string;
        shopFilter?: string;
        minEmployeeCount?: number;
        maxEmployeeCount?: number;
      };
    }
  ): Promise<PaginatedDepartmentsEntity> {
    try {
      const { page, limit, filters } = params;
      const offset = (page - 1) * limit;

      // Build filters array
      const queryFilters: Array<{
        field: string;
        operator: FilterOperator;
        value: string | number;
      }> = [];

      // Add optional filters
      if (filters?.searchQuery) {
        queryFilters.push({
          field: "name",
          operator: FilterOperator.ILIKE,
          value: `%${filters.searchQuery}%`,
        });
      }

      if (filters?.shopFilter) {
        queryFilters.push({
          field: "shop_id",
          operator: FilterOperator.EQ,
          value: filters.shopFilter,
        });
      }

      // Note: employeeCount filtering will be handled after fetching data
      // since it's a calculated field from a joined view

      // Use getAdvanced with proper QueryOptions format
      const queryOptions: QueryOptions = {
        select: ["*"],
        filters: queryFilters.length > 0 ? queryFilters : undefined,
        joins: [
          { table: "shops", on: { fromField: "shop_id", toField: "id" } },
        ],
        sort: [{ field: "created_at", direction: SortDirection.DESC }],
        pagination: {
          limit,
          offset,
        },
      };

      // Use extended type that satisfies Record<string, unknown> constraint
      const departments =
        await this.dataSource.getAdvanced<DepartmentSchemaRecord>(
          "departments",
          queryOptions
        );

      // Count total items
      const totalItems = await this.dataSource.count(
        "departments",
        queryOptions
      );

      // query employee count for each department into hash map
      const employeeCounts =
        await this.dataSource.getAdvanced<DepartmentSchemaRecord>(
          "department_employee_counts_view",
          {
            select: ["department_id", "employee_count"],
          }
        );

      const employeeCountMap = employeeCounts.reduce((acc, employee) => {
        const departmentId = employee.department_id as string;
        if (!acc[departmentId]) {
          acc[departmentId] = 0;
        }
        acc[departmentId] = employee.employee_count as number;
        return acc;
      }, {} as Record<string, number>);

      // Map database results to domain entities
      const mappedDepartments = departments.map((department) => {
        // Handle joined data from shops table
        const departmentWithJoinedData = department as DepartmentWithJoins;
        const employee_count = employeeCountMap[department.id as string] || 0; // separate query to get employee count

        const departmentWithJoins = {
          ...department,
          shop_name: departmentWithJoinedData.shops?.name,
          employee_count,
        };
        return SupabaseShopBackendDepartmentMapper.toDomain(
          departmentWithJoins
        );
      });

      // Apply employee count filters if specified
      let filteredDepartments = mappedDepartments;
      if (
        filters?.minEmployeeCount !== undefined ||
        filters?.maxEmployeeCount !== undefined
      ) {
        filteredDepartments = mappedDepartments.filter((department) => {
          const employeeCount = department.employeeCount;

          if (
            filters?.minEmployeeCount !== undefined &&
            employeeCount < filters.minEmployeeCount
          ) {
            return false;
          }

          if (
            filters?.maxEmployeeCount !== undefined &&
            employeeCount > filters.maxEmployeeCount
          ) {
            return false;
          }

          return true;
        });
      }

      // Create pagination metadata
      const pagination =
        SupabaseShopBackendDepartmentMapper.createPaginationMeta(
          page,
          limit,
          totalItems
        );

      return {
        data: filteredDepartments,
        pagination,
      };
    } catch (error) {
      if (error instanceof ShopBackendDepartmentError) {
        throw error;
      }

      this.logger.error("Error in getPaginatedDepartments", { error });
      throw new ShopBackendDepartmentError(
        ShopBackendDepartmentErrorType.UNKNOWN,
        "An unexpected error occurred while fetching departments",
        "getPaginatedDepartments",
        {},
        error
      );
    }
  }

  /**
   * Get department statistics from database
   * @param shopId Shop ID to filter statistics
   * @returns Department statistics
   */
  async getDepartmentStats(shopId: string): Promise<DepartmentStatsEntity> {
    try {
      // Use getAdvanced to fetch statistics data
      const queryOptions: QueryOptions = {
        select: ["*"],
        filters: [
          {
            field: "shop_id",
            operator: FilterOperator.EQ,
            value: shopId,
          },
        ],
        // No joins needed for stats view
        // No pagination needed, we want all stats
      };

      // Assuming a view exists for department statistics
      // Use extended type that satisfies Record<string, unknown> constraint
      const statsData =
        await this.dataSource.getAdvanced<DepartmentStatsSchemaRecord>(
          "department_stats_by_shop_view",
          queryOptions
        );

      if (!statsData || statsData.length === 0) {
        // If no stats are found, return default values
        return {
          totalDepartments: 0,
          totalEmployees: 0,
          activeDepartments: 0,
          averageEmployeesPerDepartment: 0,
        };
      }

      // Map database results to domain entity
      // Assuming the first record contains all stats
      return SupabaseShopBackendDepartmentMapper.statsToEntity(statsData[0]);
    } catch (error) {
      if (error instanceof ShopBackendDepartmentError) {
        throw error;
      }

      this.logger.error("Error in getDepartmentStats", { error, shopId });
      throw new ShopBackendDepartmentError(
        ShopBackendDepartmentErrorType.UNKNOWN,
        "An unexpected error occurred while fetching department statistics",
        "getDepartmentStats",
        { shopId },
        error
      );
    }
  }

  /**
   * Get department by ID
   * @param id Department ID
   * @returns Department entity or null if not found
   */
  async getDepartmentById(id: string): Promise<DepartmentEntity | null> {
    try {
      // Use getById which is designed for fetching by ID
      // Use extended type that satisfies Record<string, unknown> constraint
      const department = await this.dataSource.getById<DepartmentSchemaRecord>(
        "departments",
        id,
        {
          select: ["*"],
          joins: [
            { table: "shops", on: { fromField: "shop_id", toField: "id" } },
          ],
        }
      );

      if (!department) {
        return null;
      }

      // Handle joined data from shops table
      const departmentWithJoinedData = department as DepartmentWithJoins;

      const departmentWithJoins = {
        ...department,
        shop_name: departmentWithJoinedData.shops?.name,
      };

      // Map database result to domain entity
      return SupabaseShopBackendDepartmentMapper.toDomain(departmentWithJoins);
    } catch (error) {
      if (error instanceof ShopBackendDepartmentError) {
        throw error;
      }

      this.logger.error("Error in getDepartmentById", { error, id });
      throw new ShopBackendDepartmentError(
        ShopBackendDepartmentErrorType.UNKNOWN,
        "An unexpected error occurred while fetching department",
        "getDepartmentById",
        { id },
        error
      );
    }
  }

  /**
   * Create a new department
   * @param department Department data to create
   * @returns Created department entity
   */
  async createDepartment(
    department: Omit<CreateDepartmentEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<DepartmentEntity> {
    try {
      // Convert domain entity to database schema
      const departmentSchema = {
        shop_id: department.shopId,
        name: department.name,
        slug: department.slug,
        description: department.description || null,
      };

      // Create department in database
      const createdDepartment =
        await this.dataSource.insert<DepartmentSchemaRecord>(
          "departments",
          departmentSchema
        );

      if (!createdDepartment) {
        throw new ShopBackendDepartmentError(
          ShopBackendDepartmentErrorType.OPERATION_FAILED,
          "Failed to create department",
          "createDepartment",
          { department }
        );
      }

      // Get the created department with joined data
      return this.getDepartmentById(
        createdDepartment.id
      ) as Promise<DepartmentEntity>;
    } catch (error) {
      if (error instanceof ShopBackendDepartmentError) {
        throw error;
      }

      this.logger.error("Error in createDepartment", { error, department });
      throw new ShopBackendDepartmentError(
        ShopBackendDepartmentErrorType.UNKNOWN,
        "An unexpected error occurred while creating department",
        "createDepartment",
        { department },
        error
      );
    }
  }

  /**
   * Update an existing department
   * @param id Department ID
   * @param department Department data to update
   * @returns Updated department entity
   */
  async updateDepartment(
    id: string,
    department: Partial<
      Omit<DepartmentEntity, "id" | "createdAt" | "updatedAt">
    >
  ): Promise<DepartmentEntity> {
    try {
      // Check if department exists
      const existingDepartment = await this.getDepartmentById(id);
      if (!existingDepartment) {
        throw new ShopBackendDepartmentError(
          ShopBackendDepartmentErrorType.NOT_FOUND,
          `Department with ID ${id} not found`,
          "updateDepartment",
          { id, department }
        );
      }

      // Convert domain entity to database schema
      const departmentSchema: Partial<DepartmentSchema> = {};
      if (department.shopId !== undefined)
        departmentSchema.shop_id = department.shopId;
      if (department.name !== undefined)
        departmentSchema.name = department.name;
      if (department.slug !== undefined)
        departmentSchema.slug = department.slug;
      if (department.description !== undefined)
        departmentSchema.description = department.description;
      if (department.employeeCount !== undefined)
        departmentSchema.employee_count = department.employeeCount;

      // Update department in database
      const updatedDepartment =
        await this.dataSource.update<DepartmentSchemaRecord>(
          "departments",
          id,
          departmentSchema
        );

      if (!updatedDepartment) {
        throw new ShopBackendDepartmentError(
          ShopBackendDepartmentErrorType.OPERATION_FAILED,
          "Failed to update department",
          "updateDepartment",
          { id, department }
        );
      }

      // Get the updated department with joined data
      return this.getDepartmentById(id) as Promise<DepartmentEntity>;
    } catch (error) {
      if (error instanceof ShopBackendDepartmentError) {
        throw error;
      }

      this.logger.error("Error in updateDepartment", { error, id, department });
      throw new ShopBackendDepartmentError(
        ShopBackendDepartmentErrorType.UNKNOWN,
        "An unexpected error occurred while updating department",
        "updateDepartment",
        { id, department },
        error
      );
    }
  }

  /**
   * Delete a department
   * @param id Department ID
   * @returns true if deleted successfully
   */
  async deleteDepartment(id: string): Promise<boolean> {
    try {
      // Check if department exists
      const existingDepartment = await this.getDepartmentById(id);
      if (!existingDepartment) {
        throw new ShopBackendDepartmentError(
          ShopBackendDepartmentErrorType.NOT_FOUND,
          `Department with ID ${id} not found`,
          "deleteDepartment",
          { id }
        );
      }

      // Delete department from database
      await this.dataSource.delete("departments", id);

      // Since we've already checked if the department exists, we can return true
      return true;
    } catch (error) {
      if (error instanceof ShopBackendDepartmentError) {
        throw error;
      }

      this.logger.error("Error in deleteDepartment", { error, id });
      throw new ShopBackendDepartmentError(
        ShopBackendDepartmentErrorType.UNKNOWN,
        "An unexpected error occurred while deleting department",
        "deleteDepartment",
        { id },
        error
      );
    }
  }
}
