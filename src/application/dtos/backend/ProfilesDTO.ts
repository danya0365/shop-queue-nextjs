export interface ProfileDTO {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  avatar_url?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  bio?: string;
  preferences: {
    language: 'th' | 'en';
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  social_links?: {
    facebook?: string;
    line?: string;
    instagram?: string;
  };
  verification_status: 'pending' | 'verified' | 'rejected';
  privacy_settings: {
    show_phone: boolean;
    show_email: boolean;
    show_address: boolean;
  };
  last_login?: string;
  login_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileStatsDTO {
  total_profiles: number;
  verified_profiles: number;
  pending_verification: number;
  active_profiles_today: number;
  new_profiles_this_month: number;
  profiles_by_gender: {
    male: number;
    female: number;
    other: number;
    not_specified: number;
  };
}

export interface ProfilesDataDTO {
  profiles: ProfileDTO[];
  stats: ProfileStatsDTO;
  total_count: number;
  current_page: number;
  per_page: number;
}
