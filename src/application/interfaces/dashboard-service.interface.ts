import { DashboardDataDto } from "../dtos/dashboard-dto";

/**
 * Interface for dashboard service
 * Following Interface Segregation Principle by creating focused interfaces
 */
export interface IDashboardService {
  /**
   * Get dashboard data for the current user
   * @returns Dashboard data or null if not found
   */
  getUserDashboard(): Promise<DashboardDataDto | null>;
}
