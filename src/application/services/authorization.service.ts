
import type { IAuthorizationService } from '@/src/application/interfaces/authorization-service.interface';
import type { ILogger } from '@/src/application/interfaces/logger.interface';
import type { ProfileRole } from '@/src/domain/entities/profile';

/**
 * Authorization service implementation
 * Follows Single Responsibility Principle by handling only authorization logic
 */
export class AuthorizationService implements IAuthorizationService {
  /**
   * Constructor for AuthorizationService
   * @param logger Logger instance for logging
   */
  constructor(
    private readonly logger: ILogger
  ) { }

  /**
   * Check if user has backend access based on their role
   * @param role User's role
   * @returns boolean indicating if user has backend access
   */
  hasBackendAccess(role?: ProfileRole): boolean {
    this.logger.debug('Checking backend access for role', { role });
    return role === 'admin' || role === 'moderator';
  }
}
