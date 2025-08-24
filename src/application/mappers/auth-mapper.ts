import { AuthChangeEvent, AuthUser } from "../../domain/interfaces/datasources/auth-datasource";
import { AuthChangeEventDto, AuthUserDto } from "../dtos/auth-dto";

/**
 * Mapper for converting between domain auth entities and DTOs
 * Following Clean Architecture by isolating domain entities from application layer
 */
export class AuthMapper {
  /**
   * Map domain AuthUser to AuthUserDto
   * @param domainUser Domain auth user entity
   * @returns AuthUserDto or null if input is null
   */
  static toDto(domainUser: AuthUser | null): AuthUserDto | null {
    if (!domainUser) return null;

    return {
      id: domainUser.id,
      email: domainUser.email,
      emailConfirmedAt: domainUser.emailConfirmedAt,
      phone: domainUser.phone,
      createdAt: domainUser.createdAt,
      updatedAt: domainUser.updatedAt,
      lastSignInAt: domainUser.lastSignInAt,
      userMetadata: domainUser.userMetadata,
      appMetadata: domainUser.appMetadata,
      role: domainUser.role,
      aud: domainUser.aud
    };
  }

  /**
   * Map AuthChangeEvent to AuthChangeEventDto
   * @param event Domain auth change event
   * @returns AuthChangeEventDto
   */
  static toEventDto(event: AuthChangeEvent): AuthChangeEventDto {
    return event as AuthChangeEventDto;
  }
}
