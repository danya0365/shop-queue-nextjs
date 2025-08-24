'use client';

import { IAuthorizationService } from '@/src/application/interfaces/authorization-service.interface';
import { getClientService } from '@/src/di/client-container';
import { ProfileRole } from '@/src/domain/entities/profile';
import { useCallback } from 'react';

/**
 * Hook for authorization-related functionality
 * Follows SOLID principles by providing a clean interface to authorization services
 */
export const useAuthorization = () => {
  // Get the authorization service from the client container
  const authorizationService = getClientService<IAuthorizationService>('AuthorizationService');

  // Check if a user has backend access based on their role
  const hasBackendAccess = useCallback((role?: ProfileRole): boolean => {
    return authorizationService.hasBackendAccess(role);
  }, [authorizationService]);

  return {
    hasBackendAccess
  };
};
