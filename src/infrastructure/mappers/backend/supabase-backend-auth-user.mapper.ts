import type { AuthUserDTO, AuthUserStatsDTO } from '@/src/application/dtos/backend/auth-users-dto';
import { AuthUserAppMetadata, AuthUserEntity, AuthUserStatsEntity, AuthUserUserMetadata, type AuthUserIdentity } from '@/src/domain/entities/backend/backend-auth-user.entity';
import { AuthUserDbSchema, AuthUserStatsDbSchema } from '../../schemas/backend/auth-user.schema';

export class BackendAuthUsersMapper {
  static toDTO(entity: AuthUserEntity): AuthUserDTO {
    return {
      id: entity.id,
      email: entity.email,
      phone: entity.phone || undefined,
      emailConfirmedAt: entity.emailConfirmedAt?.toISOString(),
      phoneConfirmedAt: entity.phoneConfirmedAt?.toISOString(),
      lastSignInAt: entity.lastSignInAt?.toISOString(),
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      isAnonymous: entity.isAnonymous,
      appMetadata: entity.appMetadata,
      userMetadata: entity.userMetadata,
      identities: entity.identities.map(identity => ({
        id: identity.id,
        userId: identity.userId,
        identityData: identity.identityData,
        provider: identity.provider,
        createdAt: identity.createdAt.toISOString(),
        updatedAt: identity.updatedAt.toISOString()
      })),
      profilesCount: entity.profilesCount
    };
  }

  static toDomain(data: AuthUserDbSchema, profilesCount: number): AuthUserEntity {
    let identities: AuthUserIdentity[] = [];
    if (data.identities) {
      identities = (data.identities as Record<string, unknown>[] || []).map((identity: Record<string, unknown>) => ({
        id: identity.id as string,
        userId: identity.user_id as string,
        identityData: identity.identity_data as Record<string, string>,
        provider: identity.provider as string,
        createdAt: new Date(identity.created_at as string),
        updatedAt: new Date(identity.updated_at as string)
      }));
    }

    return new AuthUserEntity(
      data.id as string,
      data.email as string,
      data.phone as string,
      data.email_confirmed_at ? new Date(data.email_confirmed_at as string) : null,
      data.phone_confirmed_at ? new Date(data.phone_confirmed_at as string) : null,
      data.last_sign_in_at ? new Date(data.last_sign_in_at as string) : null,
      new Date(data.created_at as string),
      new Date(data.updated_at as string),
      data.is_anonymous as boolean,
      data.app_metadata as AuthUserAppMetadata,
      data.user_metadata as AuthUserUserMetadata,
      identities,
      profilesCount
    );
  }

  static statsToDTO(entity: AuthUserStatsEntity): AuthUserStatsDTO {
    return {
      totalUsers: entity.totalUsers,
      confirmedUsers: entity.confirmedUsers,
      unconfirmedUsers: entity.unconfirmedUsers,
      activeUsersToday: entity.activeUsersToday,
      newUsersThisMonth: entity.newUsersThisMonth,
      usersByProvider: entity.usersByProvider
    };
  }

  static statsToDomain(data: AuthUserStatsDbSchema): AuthUserStatsEntity {
    return new AuthUserStatsEntity(
      data.total_users,
      data.confirmed_users,
      data.unconfirmed_users,
      data.active_users_today,
      data.new_users_this_month,
      data.users_by_provider
    );
  }
}
