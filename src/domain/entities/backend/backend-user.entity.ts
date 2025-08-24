
/**
 * Domain entity for user data
 */
export interface UserEntity {
  id: string;
  name: string;
  email: string;
  profilesCount: number;
  role: string;
  status: string;
  createdAt: string;
}

/**
 * Domain entity for paginated users data
 */
export interface PaginatedUsersEntity {
  users: UserEntity[];
  totalUsers: number;
}
