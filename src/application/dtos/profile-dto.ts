/**
 * Data Transfer Objects for Profile-related operations
 * These DTOs are used to transfer data between layers without exposing domain entities
 */

// ใช้ ProfileRole จาก domain entity เพื่อให้ type ตรงกัน
export type ProfileRoleDto = 'user' | 'moderator' | 'admin';

export interface ProfileDto {
  id: string;
  authId: string;
  username: string;
  name: string;
  fullName?: string; // เพิ่ม fullName เป็น optional เพื่อให้สอดคล้องกับ domain entity
  bio?: string;
  avatarUrl?: string;
  role: ProfileRoleDto; // ใช้ ProfileRoleDto แทน string เพื่อให้ตรงกับ ProfileRole ใน domain
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileDto {
  authId: string;
  username: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  isActive?: boolean;
}

export interface UpdateProfileDto {
  username?: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
}

// Aliases for better naming in use cases
export type CreateProfileInputDto = CreateProfileDto;
export type UpdateProfileInputDto = UpdateProfileDto;
