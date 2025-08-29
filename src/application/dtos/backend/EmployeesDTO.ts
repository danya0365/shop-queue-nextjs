export interface EmployeeDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: 'management' | 'customer_service' | 'technical' | 'sales' | 'other';
  position: string;
  shop_id?: string;
  shop_name?: string;
  status: 'active' | 'inactive' | 'suspended';
  hire_date: string;
  last_login?: string;
  permissions: string[];
  salary?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
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
