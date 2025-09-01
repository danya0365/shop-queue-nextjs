import type { AuthUserEntity, AuthUserStatsEntity, PaginatedAuthUsersEntity } from '@/src/domain/entities/backend/backend-auth-user.entity';

export interface IBackendAuthUsersRepository {
  /**
   * Get paginated auth users with their profile counts
   */
  getAuthUsers(page: number, perPage: number): Promise<PaginatedAuthUsersEntity>;

  /**
   * Get auth user by ID
   */
  getAuthUserById(id: string): Promise<AuthUserEntity | null>;

  /**
   * Get auth user statistics
   */
  getAuthUserStats(): Promise<AuthUserStatsEntity>;

  /**
   * Delete auth user (admin only - this will cascade delete profiles)
   */
  deleteAuthUser(id: string): Promise<boolean>;
}
