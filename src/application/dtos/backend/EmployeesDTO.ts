export interface EmployeeDTO {
  id: string;
  employee_code: string;
  name: string;
  email?: string;
  phone?: string;
  department_id?: string;
  department_name?: string; // joined from departments
  position: string;
  shop_id?: string;
  shop_name?: string; // joined from shops
  status: EmployeeStatus;
  hire_date: string;
  last_login?: string;
  permissions: string[];
  salary?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeParams {
  employee_code: string;
  name: string;
  email?: string;
  phone?: string;
  department_id?: string;
  position: string;
  shop_id?: string;
  status: EmployeeStatus;
  hire_date: string;
  permissions?: string[];
  salary?: number;
  notes?: string;
}

export interface UpdateEmployeeParams {
  id: string;
  employee_code?: string;
  name?: string;
  email?: string;
  phone?: string;
  department_id?: string;
  position?: string;
  shop_id?: string;
  status?: EmployeeStatus;
  hire_date?: string;
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
  SUSPENDED = 'suspended',
}

export interface EmployeeStatsDTO {
  total_employees: number;
  active_employees: number;
  logged_in_today: number;
  new_employees_this_month: number;
  by_department: {
    management: number;
    customer_service: number;
    technical: number;
    sales: number;
    other: number;
  };
}

export interface EmployeesDataDTO {
  employees: EmployeeDTO[];
  stats: EmployeeStatsDTO;
  total_count: number;
  current_page: number;
  per_page: number;
}
