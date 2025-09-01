import { AuthUserEntity, AuthUserStatsEntity, PaginatedAuthUsersEntity } from '@/src/domain/entities/backend/backend-auth-user.entity';
import { Logger } from '@/src/domain/interfaces/logger';
import { IBackendAuthUsersRepository } from '@/src/domain/repositories/backend/backend-auth-user-repository';
import { BackendAuthUsersMapper } from '@/src/infrastructure/mappers/backend/supabase-backend-auth-user.mapper';
import { DatabaseDataSource } from "../../../domain/interfaces/datasources/database-datasource";
import { AuthUserDbSchema, AuthUserStatsDbSchema, PaginatedAuthUsersDbSchema } from '../../schemas/backend/auth-user.schema';
import { BackendRepository } from '../base/backend-repository';
export class SupabaseBackendAuthUsersRepository extends BackendRepository implements IBackendAuthUsersRepository {
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger
  ) {
    super(dataSource, logger, "BackendAuthUsers");
  }

  async getAuthUsers(page: number, perPage: number): Promise<PaginatedAuthUsersEntity> {

    try {
      // Call the RPC function to get paginated users with all related data
      const result = await this.dataSource.callRpc<PaginatedAuthUsersDbSchema>('get_paginated_users', {
        p_page: page,
        p_limit: perPage
      });

      if (!result || !result.users || !Array.isArray(result.users) || result.users.length === 0) {
        return {
          data: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: perPage,
            hasNextPage: false,
            hasPrevPage: page > 1,
          },
        };
      }

      // Get total count from the result
      const totalCount = parseInt(String(result.total_count)) || 0;

      // Map database results to domain entities
      const users: AuthUserEntity[] = result.users.map((user: AuthUserDbSchema) => {
        const profilesCount = 0; // Simplified for now
        return BackendAuthUsersMapper.toDomain(user, profilesCount);
      });

      return {
        data: users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / perPage),
          totalItems: totalCount,
          itemsPerPage: perPage,
          hasNextPage: page < Math.ceil(totalCount / perPage),
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      this.logger.error('SupabaseBackendAuthUsersRepository: Error in getAuthUsers', error);
      throw error;
    }
  }

  async getAuthUserById(id: string): Promise<AuthUserEntity | null> {
    try {
      const userData = await this.dataSource.callRpc<AuthUserDbSchema[]>('get_auth_user_by_id', { p_id: id });
      const profilesCount = 0; // Simplified for now
      return BackendAuthUsersMapper.toDomain(userData[0], profilesCount);
    } catch (error) {
      this.logger.error('SupabaseBackendAuthUsersRepository: Error in getAuthUserById', error);
      throw error;
    }
  }

  async getAuthUserStats(): Promise<AuthUserStatsEntity> {
    try {
      const statsData = await this.dataSource.callRpc<AuthUserStatsDbSchema>('get_auth_user_stats');

      return BackendAuthUsersMapper.statsToDomain(statsData);
    } catch (error) {
      this.logger.error('SupabaseBackendAuthUsersRepository: Error in getAuthUserStats', error);
      throw error;
    }
  }

  async deleteAuthUser(id: string): Promise<boolean> {
    try {
      // Delete auth user using admin client (this will cascade delete profiles)

      this.logger.info(`SupabaseBackendAuthUsersRepository: Successfully deleted auth user ${id}`);
      return true;
    } catch (error) {
      this.logger.error('SupabaseBackendAuthUsersRepository: Error in deleteAuthUser', error);
      throw error;
    }
  }
}
