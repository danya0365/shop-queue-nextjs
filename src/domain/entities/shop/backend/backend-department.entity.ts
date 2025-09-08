import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";

/**
 * Department entity representing a department in the system
 * Following Clean Architecture principles - domain entity
 */
export interface DepartmentEntity {
  id: string;
  shopId: string;
  shopName?: string; // Joined data
  name: string;
  slug: string;
  description: string | null;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentEntity {
  shopId: string;
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateDepartmentEntity {
  shopId?: string;
  name?: string;
  slug?: string;
  description?: string;
}

/**
 * Department statistics entity
 */
export interface DepartmentStatsEntity {
  totalDepartments: number;
  totalEmployees: number;
  activeDepartments: number;
  averageEmployeesPerDepartment: number;
}

/**
 * Paginated departments result
 */
export type PaginatedDepartmentsEntity = PaginatedResult<DepartmentEntity>;
