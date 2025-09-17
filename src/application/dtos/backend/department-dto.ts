import { EmployeeDTO } from "./employees-dto";

export interface DepartmentDTO {
  id: string;
  shopId: string;
  name: string;
  slug: string;
  description: string | null;
  employeeCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentStatsDTO {
  totalDepartments: number;
  totalEmployees: number;
  activeDepartments: number;
  averageEmployeesPerDepartment: number;
}

export interface DepartmentWithEmployeesDTO extends DepartmentDTO {
  employees: EmployeeDTO[];
}

export interface DepartmentsDataDTO {
  departments: DepartmentDTO[];
  stats: DepartmentStatsDTO;
  totalCount: number;
}

export interface CreateDepartmentDTO {
  shopId: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface UpdateDepartmentDTO {
  id: string;
  name?: string;
  slug?: string;
  description?: string | null;
}
