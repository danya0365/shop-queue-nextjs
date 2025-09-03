/**
 * Database schema types for employees
 * These types match the actual database structure
 */

/**
 * Employee database schema
 */
export interface EmployeeSchema {
  id: string;
  employee_code: string;
  name: string;
  email: string | null;
  phone: string | null;
  department_id: string | null;
  department_name?: string; // Joined data
  position_text: string;
  shop_id: string | null;
  shop_name?: string; // Joined data
  status: string;
  hire_date: string;
  last_login: string | null;
  permissions: string[];
  salary: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Employee stats database schema
 */
export interface EmployeeStatsSchema {
  total_employees: number;
  active_employees: number;
  logged_in_today: number;
  new_employees_this_month: number;
  management_count: number;
  customer_service_count: number;
  technical_count: number;
  sales_count: number;
  other_count: number;
}
