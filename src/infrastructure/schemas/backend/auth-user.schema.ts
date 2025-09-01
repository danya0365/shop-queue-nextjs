export interface AuthUserDbSchema {
  id: string;
  email: string;
  phone?: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  last_sign_in_at?: string;
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
  app_metadata: {
    provider?: string;
    providers?: string[];
  };
  user_metadata: {
    [key: string]: string;
  };
  identities?: Array<{
    id: string;
    user_id: string;
    identity_data: {
      [key: string]: string;
    };
    provider: string;
    created_at: string;
    updated_at: string;
  }>;
}

export interface AuthUserStatsDbSchema {
  total_users: number;
  confirmed_users: number;
  unconfirmed_users: number;
  active_users_today: number;
  new_users_this_month: number;
  users_by_provider: {
    email: number;
    google: number;
    facebook: number;
    apple: number;
    phone: number;
    anonymous: number;
  };
}

/**
 * Database schema for paginated users result from RPC function
 */
export interface PaginatedAuthUsersDbSchema {
  users: AuthUserDbSchema[];
  total_count: number;
}
