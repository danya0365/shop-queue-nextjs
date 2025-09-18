import { EmployeePermission } from "@/src/domain/entities/shop/backend/backend-employee.entity";
import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";

export interface EmployeeDTO {
  id: string;
  employeeCode: string;
  name: string;
  email?: string;
  phone?: string;
  departmentId?: string;
  departmentName?: string; // joined from departments
  position: string;
  shopId?: string;
  shopName?: string; // joined from shops
  status: EmployeeStatus;
  hireDate: string;
  lastLogin?: string;
  permissions: EmployeePermission[];
  salary?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  todayStats: {
    queuesServed: number;
    revenue: number;
    averageServiceTime: number;
    rating: number;
  };
}

export interface CreateEmployeeParams {
  employeeCode: string;
  name: string;
  email?: string;
  phone?: string;
  departmentId: string;
  position: string;
  shopId: string;
  status: EmployeeStatus;
  hireDate: string;
  permissions?: EmployeePermission[];
  salary?: number;
  notes?: string;
  profileId: string;
}

export interface UpdateEmployeeParams {
  id: string;
  employeeCode?: string;
  name?: string;
  email?: string;
  phone?: string;
  departmentId?: string;
  position?: string;
  shopId?: string;
  status?: EmployeeStatus;
  hireDate?: string;
  permissions?: EmployeePermission[];
  salary?: number;
  notes?: string;
}

/**
 * Employee status enum
 */
export enum EmployeeStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

export interface EmployeeStatsDTO {
  totalEmployees: number;
  activeEmployees: number;
  loggedInToday: number;
  newEmployeesThisMonth: number;
  byDepartment: {
    management: number;
    customerService: number;
    technical: number;
    sales: number;
    other: number;
  };
}

export interface EmployeesDataDTO {
  employees: EmployeeDTO[];
  stats: EmployeeStatsDTO;
  totalCount: number;
  currentPage: number;
  perPage: number;
}

/**
 * Input DTO for GetShopsPaginatedUseCase
 */
export interface GetEmployeesPaginatedInput {
  page: number;
  limit: number;
  filters?: {
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

export type PaginatedEmployeesDTO = PaginatedResult<EmployeeDTO>;
