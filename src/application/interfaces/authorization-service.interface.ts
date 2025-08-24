import type { ProfileRole } from '@/src/domain/entities/profile';

/**
 * Interface for authorization service
 * Follows Interface Segregation Principle by defining specific authorization methods
 */
export interface IAuthorizationService {
  /**
   * Check if user has backend access based on their role
   * @param role User's role
   * @returns boolean indicating if user has backend access
   */
  hasBackendAccess(role?: ProfileRole): boolean;
}
