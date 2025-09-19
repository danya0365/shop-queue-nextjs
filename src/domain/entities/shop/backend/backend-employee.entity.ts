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
  permissions: EmployeePermission[];
  salary: number | null;
  notes: string | null;
  profileId: string | null;
  profile?: {
    id: string;
    fullName: string;
    username: string | null;
    phone?: string | null;
    avatar?: string | null;
    isActive: boolean;
    createdAt?: string | null;
    updatedAt?: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeEntity {
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

export enum EmployeePermission {
  MANAGE_QUEUES = "manage_queues",
  MANAGE_EMPLOYEES = "manage_employees",
  MANAGE_SERVICES = "manage_services",
  MANAGE_CUSTOMERS = "manage_customers",
  MANAGE_SETTINGS = "manage_settings",
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
