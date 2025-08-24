import { Profile, ProfileCreate } from '../../domain/entities/profile';
import { CreateProfileDto, ProfileDto, UpdateProfileDto } from '../dtos/profile-dto';

/**
 * ProfileMapper
 * 
 * Responsible for mapping between domain entities and DTOs
 * Following the Mapper pattern in Clean Architecture
 */
export class ProfileMapper {
  /**
   * Map domain Profile entity to ProfileDto
   */
  static toDto(profile: Profile): ProfileDto {
    return {
      id: profile.id,
      authId: profile.authId,
      username: profile.username,
      name: profile.fullName || profile.username, // ใช้ fullName หรือ fallback เป็น username
      fullName: profile.fullName, // เพิ่มการแมป fullName จาก entity ไปยัง DTO
      bio: undefined, // Profile entity ไม่มี bio
      avatarUrl: profile.avatarUrl,
      role: profile.role, // เพิ่มการแมป field role จาก Profile ไปยัง ProfileDto
      isActive: profile.isActive,
      createdAt: profile.createdAt.toISOString(), // Convert Date to string
      updatedAt: profile.updatedAt.toISOString() // Convert Date to string
    };
  }

  /**
   * Map DTO to domain entity
   */
  static toDomain(dto: ProfileDto): Partial<Profile> {
    return {
      id: dto.id,
      authId: dto.authId,
      username: dto.username,
      fullName: dto.fullName || dto.name, // ใช้ fullName จาก DTO หรือ fallback เป็น name
      avatarUrl: dto.avatarUrl,
      role: dto.role, // ProfileRoleDto และ ProfileRole มี type เหมือนกันจึงไม่ต้อง cast
      isActive: dto.isActive,
      createdAt: new Date(dto.createdAt), // Convert string to Date
      updatedAt: new Date(dto.updatedAt) // Convert string to Date
    };
  }

  /**
   * Map CreateProfileDto to domain entity
   */
  static createDtoToDomain(dto: CreateProfileDto): ProfileCreate {
    return {
      authId: dto.authId,
      username: dto.username,
      fullName: dto.name, // ใช้ name จาก DTO เป็น fullName ใน entity
      avatarUrl: dto.avatarUrl,
      isActive: dto.isActive ?? true,
      role: 'user' // กำหนดค่าเริ่มต้นเป็น 'user'
    };
  }

  /**
   * Map UpdateProfileDto to domain entity for partial updates
   */
  static updateDtoToDomain(dto: UpdateProfileDto): Partial<Profile> {
    const result: Partial<Profile> = {};
    
    if (dto.username !== undefined) result.username = dto.username;
    if (dto.name !== undefined) result.fullName = dto.name; // ใช้ name จาก DTO เป็น fullName ใน entity
    if (dto.avatarUrl !== undefined) result.avatarUrl = dto.avatarUrl;
    
    return result;
  }

  /**
   * Map array of Profile entities to array of ProfileDtos
   */
  static toDtoList(profiles: Profile[]): ProfileDto[] {
    return profiles.map(profile => this.toDto(profile));
  }
}
