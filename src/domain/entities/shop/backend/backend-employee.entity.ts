import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";

/**
 * Employee entity representing a staff member in the system
 * Following Clean Architecture principles - domain entity
 */
export interface EmployeeEntity {
  id: string;
  employeeCode: string;
  name: string;
  email: string | null;
  phone: string | null;
  departmentId: string | null;
  departmentName?: string; // Joined data
  position: string;
  shopId: string | null;
  shopName?: string; // Joined data
  status: EmployeeStatus;
  hireDate: string;
  lastLogin: string | null;
  permissions: string[];
  salary: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeEntity {
  employeeCode: string;
  name: string;
  email?: string;
  phone?: string;
  departmentId?: string;
  position: string;
  shopId?: string;
  status: EmployeeStatus;
  hireDate: string;
  permissions?: string[];
  salary?: number;
  notes?: string;
}

export interface UpdateEmployeeEntity {
  employeeCode?: string;
  name?: string;
  email?: string;
  phone?: string;
  departmentId?: string;
  position?: string;
  shopId?: string;
  status?: EmployeeStatus;
  hireDate?: string;
  permissions?: string[];
  salary?: number;
  notes?: string;
}

/**
 * Employee status enum
 */
export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

/**
 * Employee statistics entity
 */
export interface EmployeeStatsEntity {
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

/**
 * Paginated employees result
 */
export type PaginatedEmployeesEntity = PaginatedResult<EmployeeEntity>;
