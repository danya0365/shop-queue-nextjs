import {
  CreateEmployeeEntity,
  EmployeeEntity,
  EmployeeStatsEntity,
  PaginatedEmployeesEntity,
} from "@/src/domain/entities/shop/backend/backend-employee.entity";
import {
  DatabaseDataSource,
  FilterOperator,
  QueryOptions,
  SortDirection,
} from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import {
  ShopBackendEmployeeError,
  ShopBackendEmployeeErrorType,
  ShopBackendEmployeeRepository,
} from "@/src/domain/repositories/shop/backend/backend-employee-repository";
import { SupabaseShopBackendEmployeeMapper } from "@/src/infrastructure/mappers/shop/backend/supabase-backend-employee.mapper";
import {
  EmployeeSchema,
  EmployeeStatsSchema,
} from "@/src/infrastructure/schemas/shop/backend/employee.schema";
import { StandardRepository } from "../../base/standard-repository";

// Extended types for joined data
type EmployeeWithJoins = EmployeeSchema & {
  departments?: { name?: string };
  shops?: { name?: string };
};
type EmployeeSchemaRecord = Record<string, unknown> & EmployeeSchema;
type EmployeeStatsSchemaRecord = Record<string, unknown> & EmployeeStatsSchema;

/**
 * Supabase implementation of the employee repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseShopBackendEmployeeRepository
  extends StandardRepository
  implements ShopBackendEmployeeRepository
{
  constructor(dataSource: DatabaseDataSource, logger: Logger) {
    super(dataSource, logger, "ShopBackendEmployee");
  }

  /**
   * Get paginated employees data from database
   * @param params Pagination and filter parameters
   * @returns Paginated employees data
   */
  async getPaginatedEmployees(
    params: PaginationParams & {
      filters?: {
        shopId?: string;
        searchQuery?: string;
        departmentFilter?: string;
        positionFilter?: string;
        statusFilter?: string;
        dateFrom?: string;
        dateTo?: string;
        minSalary?: number;
        maxSalary?: number;
      };
    }
  ): Promise<PaginatedEmployeesEntity> {
    try {
      const { page, limit, filters } = params;
      const offset = (page - 1) * limit;

      // Build filters array
      const queryFilters: Array<{
        field: string;
        operator: FilterOperator;
        value: string | number;
      }> = [];

      if (filters?.shopId) {
        queryFilters.push({
          field: "shop_id",
          operator: FilterOperator.EQ,
          value: filters.shopId,
        });
      }

      // Add optional filters
      if (filters?.searchQuery) {
        queryFilters.push({
          field: "name",
          operator: FilterOperator.ILIKE,
          value: `%${filters.searchQuery}%`,
        });
      }

      if (filters?.departmentFilter) {
        queryFilters.push({
          field: "department_id",
          operator: FilterOperator.EQ,
          value: filters.departmentFilter,
        });
      }

      if (filters?.positionFilter) {
        queryFilters.push({
          field: "position_text",
          operator: FilterOperator.ILIKE,
          value: `%${filters.positionFilter}%`,
        });
      }

      if (filters?.statusFilter) {
        queryFilters.push({
          field: "status",
          operator: FilterOperator.EQ,
          value: filters.statusFilter,
        });
      }

      if (filters?.dateFrom) {
        queryFilters.push({
          field: "hire_date",
          operator: FilterOperator.GTE,
          value: filters.dateFrom,
        });
      }

      if (filters?.dateTo) {
        queryFilters.push({
          field: "hire_date",
          operator: FilterOperator.LTE,
          value: filters.dateTo,
        });
      }

      if (filters?.minSalary !== undefined) {
        queryFilters.push({
          field: "salary",
          operator: FilterOperator.GTE,
          value: filters.minSalary,
        });
      }

      if (filters?.maxSalary !== undefined) {
        queryFilters.push({
          field: "salary",
          operator: FilterOperator.LTE,
          value: filters.maxSalary,
        });
      }

      // Use getAdvanced with proper QueryOptions format
      const queryOptions: QueryOptions = {
        select: ["*"],
        filters: queryFilters.length > 0 ? queryFilters : undefined,
        joins: [
          {
            table: "departments",
            on: { fromField: "department_id", toField: "id" },
          },
          { table: "shops", on: { fromField: "shop_id", toField: "id" } },
        ],
        sort: [{ field: "created_at", direction: SortDirection.DESC }],
        pagination: {
          limit,
          offset,
        },
      };

      // Use extended type that satisfies Record<string, unknown> constraint
      const employees = await this.dataSource.getAdvanced<EmployeeSchemaRecord>(
        "employees",
        queryOptions
      );

      // Count total items
      const totalItems = await this.dataSource.count("employees", queryOptions);

      // Map database results to domain entities
      const mappedEmployees = employees.map((employee) => {
        // Handle joined data from departments and shops tables
        const employeeWithJoinedData = employee as EmployeeWithJoins;

        const employeeWithJoins = {
          ...employee,
          department_name: employeeWithJoinedData.departments?.name,
          shop_name: employeeWithJoinedData.shops?.name,
        };
        return SupabaseShopBackendEmployeeMapper.toDomain(employeeWithJoins);
      });

      // Create pagination metadata
      const pagination = SupabaseShopBackendEmployeeMapper.createPaginationMeta(
        page,
        limit,
        totalItems
      );

      return {
        data: mappedEmployees,
        pagination,
      };
    } catch (error) {
      if (error instanceof ShopBackendEmployeeError) {
        throw error;
      }

      this.logger.error("Error in getPaginatedEmployees", { error });
      throw new ShopBackendEmployeeError(
        ShopBackendEmployeeErrorType.UNKNOWN,
        "An unexpected error occurred while fetching employees",
        "getPaginatedEmployees",
        {},
        error
      );
    }
  }

  /**
   * Get employee statistics from database
   * @returns Employee statistics
   */
  async getEmployeeStats(shopId: string): Promise<EmployeeStatsEntity> {
    // TODO: Implement getEmployeeStats
    return {
      totalEmployees: 0,
      activeEmployees: 0,
      loggedInToday: 0,
      newEmployeesThisMonth: 0,
      byDepartment: {
        management: 0,
        customerService: 0,
        technical: 0,
        sales: 0,
        other: 0,
      },
    };
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

      // Assuming a view exists for employee statistics
      // Use extended type that satisfies Record<string, unknown> constraint
      const statsData =
        await this.dataSource.getAdvanced<EmployeeStatsSchemaRecord>(
          "employee_stats_view",
          queryOptions
        );

      if (!statsData || statsData.length === 0) {
        // If no stats are found, return default values
        return {
          totalEmployees: 0,
          activeEmployees: 0,
          loggedInToday: 0,
          newEmployeesThisMonth: 0,
          byDepartment: {
            management: 0,
            customerService: 0,
            technical: 0,
            sales: 0,
            other: 0,
          },
        };
      }

      // Map database results to domain entity
      // Assuming the first record contains all stats
      return SupabaseShopBackendEmployeeMapper.statsToEntity(statsData[0]);
    } catch (error) {
      if (error instanceof ShopBackendEmployeeError) {
        throw error;
      }

      this.logger.error("Error in getEmployeeStats", { error });
      throw new ShopBackendEmployeeError(
        ShopBackendEmployeeErrorType.UNKNOWN,
        "An unexpected error occurred while fetching employee statistics",
        "getEmployeeStats",
        {},
        error
      );
    }
  }

  /**
   * Get employee by ID
   * @param id Employee ID
   * @returns Employee entity or null if not found
   */
  async getEmployeeById(id: string): Promise<EmployeeEntity | null> {
    try {
      // Use getById which is designed for fetching by ID
      // Use extended type that satisfies Record<string, unknown> constraint
      const employee = await this.dataSource.getById<EmployeeSchemaRecord>(
        "employees",
        id,
        {
          select: ["*"],
          joins: [
            {
              table: "departments",
              on: { fromField: "department_id", toField: "id" },
            },
            { table: "shops", on: { fromField: "shop_id", toField: "id" } },
          ],
        }
      );

      if (!employee) {
        return null;
      }

      // Handle joined data from departments and shops tables
      const employeeWithJoinedData = employee as EmployeeWithJoins;

      const employeeWithJoins = {
        ...employee,
        department_name: employeeWithJoinedData.departments?.name,
        shop_name: employeeWithJoinedData.shops?.name,
      };

      // Map database result to domain entity
      return SupabaseShopBackendEmployeeMapper.toDomain(employeeWithJoins);
    } catch (error) {
      if (error instanceof ShopBackendEmployeeError) {
        throw error;
      }

      this.logger.error("Error in getEmployeeById", { error, id });
      throw new ShopBackendEmployeeError(
        ShopBackendEmployeeErrorType.UNKNOWN,
        "An unexpected error occurred while fetching employee",
        "getEmployeeById",
        { id },
        error
      );
    }
  }

  /**
   * Create a new employee
   * @param employee Employee data to create
   * @returns Created employee entity
   */
  async createEmployee(
    employee: Omit<CreateEmployeeEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<EmployeeEntity> {
    try {
      // Convert domain entity to database schema
      const employeeSchema = {
        employee_code: employee.employeeCode,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        department_id: employee.departmentId,
        position_text: employee.position,
        shop_id: employee.shopId,
        status: employee.status,
        hire_date: employee.hireDate,
        permissions: employee.permissions,
        salary: employee.salary,
        notes: employee.notes,
      };

      // Create employee in database
      const createdEmployee =
        await this.dataSource.insert<EmployeeSchemaRecord>(
          "employees",
          employeeSchema
        );

      if (!createdEmployee) {
        throw new ShopBackendEmployeeError(
          ShopBackendEmployeeErrorType.OPERATION_FAILED,
          "Failed to create employee",
          "createEmployee",
          { employee }
        );
      }

      // Get the created employee with joined data
      return this.getEmployeeById(
        createdEmployee.id
      ) as Promise<EmployeeEntity>;
    } catch (error) {
      if (error instanceof ShopBackendEmployeeError) {
        throw error;
      }

      this.logger.error("Error in createEmployee", { error, employee });
      throw new ShopBackendEmployeeError(
        ShopBackendEmployeeErrorType.UNKNOWN,
        "An unexpected error occurred while creating employee",
        "createEmployee",
        { employee },
        error
      );
    }
  }

  /**
   * Update an existing employee
   * @param id Employee ID
   * @param employee Employee data to update
   * @returns Updated employee entity
   */
  async updateEmployee(
    id: string,
    employee: Partial<Omit<EmployeeEntity, "id" | "createdAt" | "updatedAt">>
  ): Promise<EmployeeEntity> {
    try {
      // Check if employee exists
      const existingEmployee = await this.getEmployeeById(id);
      if (!existingEmployee) {
        throw new ShopBackendEmployeeError(
          ShopBackendEmployeeErrorType.NOT_FOUND,
          `Employee with ID ${id} not found`,
          "updateEmployee",
          { id, employee }
        );
      }

      // Convert domain entity to database schema
      const employeeSchema: Partial<EmployeeSchema> = {};
      if (employee.employeeCode !== undefined)
        employeeSchema.employee_code = employee.employeeCode;
      if (employee.name !== undefined) employeeSchema.name = employee.name;
      if (employee.email !== undefined) employeeSchema.email = employee.email;
      if (employee.phone !== undefined) employeeSchema.phone = employee.phone;
      if (employee.departmentId !== undefined)
        employeeSchema.department_id = employee.departmentId;
      if (employee.position !== undefined)
        employeeSchema.position_text = employee.position;
      if (employee.shopId !== undefined)
        employeeSchema.shop_id = employee.shopId;
      if (employee.status !== undefined)
        employeeSchema.status = employee.status;
      if (employee.hireDate !== undefined)
        employeeSchema.hire_date = employee.hireDate;
      if (employee.lastLogin !== undefined)
        employeeSchema.last_login = employee.lastLogin;
      if (employee.permissions !== undefined)
        employeeSchema.permissions = employee.permissions;
      if (employee.salary !== undefined)
        employeeSchema.salary = employee.salary;
      if (employee.notes !== undefined) employeeSchema.notes = employee.notes;

      // Update employee in database
      const updatedEmployee =
        await this.dataSource.update<EmployeeSchemaRecord>(
          "employees",
          id,
          employeeSchema
        );

      if (!updatedEmployee) {
        throw new ShopBackendEmployeeError(
          ShopBackendEmployeeErrorType.OPERATION_FAILED,
          "Failed to update employee",
          "updateEmployee",
          { id, employee }
        );
      }

      // Get the updated employee with joined data
      return this.getEmployeeById(id) as Promise<EmployeeEntity>;
    } catch (error) {
      if (error instanceof ShopBackendEmployeeError) {
        throw error;
      }

      this.logger.error("Error in updateEmployee", { error, id, employee });
      throw new ShopBackendEmployeeError(
        ShopBackendEmployeeErrorType.UNKNOWN,
        "An unexpected error occurred while updating employee",
        "updateEmployee",
        { id, employee },
        error
      );
    }
  }

  /**
   * Delete an employee
   * @param id Employee ID
   * @returns true if deleted successfully
   */
  async deleteEmployee(id: string): Promise<boolean> {
    try {
      // Check if employee exists
      const existingEmployee = await this.getEmployeeById(id);
      if (!existingEmployee) {
        throw new ShopBackendEmployeeError(
          ShopBackendEmployeeErrorType.NOT_FOUND,
          `Employee with ID ${id} not found`,
          "deleteEmployee",
          { id }
        );
      }

      // Delete employee from database
      await this.dataSource.delete("employees", id);

      // Since we've already checked if the employee exists, we can return true
      return true;
    } catch (error) {
      if (error instanceof ShopBackendEmployeeError) {
        throw error;
      }

      this.logger.error("Error in deleteEmployee", { error, id });
      throw new ShopBackendEmployeeError(
        ShopBackendEmployeeErrorType.UNKNOWN,
        "An unexpected error occurred while deleting employee",
        "deleteEmployee",
        { id },
        error
      );
    }
  }
}
