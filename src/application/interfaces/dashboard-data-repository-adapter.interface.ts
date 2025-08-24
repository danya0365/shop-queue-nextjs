import { DashboardDataDto } from '../dtos/dashboard-dto';

/**
 * Interface for Dashboard Data Repository Adapter
 * This interface defines the contract for adapters that work with Dashboard data
 * Following Interface Segregation Principle by creating focused interfaces
 */
export interface IDashboardDataRepositoryAdapter {
  /**
   * Get dashboard data for the currently active profile
   * @returns Dashboard data or null if not found or no active profile
   */
  getUserDashboard(): Promise<DashboardDataDto | null>;
}
