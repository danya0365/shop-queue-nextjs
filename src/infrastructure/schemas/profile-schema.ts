/**
 * Database schema for profiles table
 * Represents the structure of the profiles table in the database
 */
export interface ProfileDbSchema extends Record<string, unknown> {
  id: string;
  auth_id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Database schema for profile_roles table
 * Represents the structure of the profile_roles table in the database
 * Used in role queries to ensure type safety
 */
export interface ProfileRoleDbSchema {
  id: string;
  profile_id: string;
  role: 'user' | 'moderator' | 'admin';
  granted_by: string;
  granted_at: string;
}
