/**
 * Database schema types for departments
 * These types match the actual database structure
 */

/**
 * Department database schema
 */
export interface DepartmentSchema {
  id: string;
  shop_id: string;
  shop_name?: string; // Joined data
  name: string;
  slug: string;
  description: string | null;
  employee_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Department stats database schema
 */
export interface DepartmentStatsSchema {
  total_departments: number;
  total_employees: number;
  active_departments: number;
  average_employees_per_department: number;
}
