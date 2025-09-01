/**
 * Database schema types for profiles
 * These types match the actual database structure
 */

/**
 * Profile database schema
 */
export interface ProfileSchema extends Record<string, unknown> {
  id: string;
  auth_id: string;
  username: string;
  full_name: string;
  phone: string;
  email: string;
  avatar_url: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  bio: string | null;
  preferences: {
    language: 'th' | 'en';
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  social_links: {
    facebook: string | null;
    line: string | null;
    instagram: string | null;
  } | null;
  verification_status: string;
  privacy_settings: {
    show_phone: boolean;
    show_email: boolean;
    show_address: boolean;
  };
  last_login: string | null;
  login_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Profile stats database schema
 */
export interface ProfileStatsSchema extends Record<string, unknown> {
  total_profiles: number;
  verified_profiles: number;
  pending_verification: number;
  active_profiles_today: number;
  new_profiles_this_month: number;
  profiles_by_gender_male: number;
  profiles_by_gender_female: number;
  profiles_by_gender_other: number;
  profiles_by_gender_not_specified: number;
}
