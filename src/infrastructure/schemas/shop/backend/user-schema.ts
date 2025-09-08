/**
 * Database schema for users from RPC function
 * Following SOLID principles and Clean Architecture
 */
export interface UserDbSchema extends Record<string, unknown> {
  id: string;
  email: string;
  name: string;
  created_at: string;
  banned_until: string | null;
  role: string;
  profiles_count: number;
}

/**
 * Database schema for paginated users result from RPC function
 */
export interface PaginatedUsersDbSchema {
  users: UserDbSchema[];
  total_count: number;
}
