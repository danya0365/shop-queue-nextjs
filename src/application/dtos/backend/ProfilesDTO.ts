export interface ProfileDTO {
  id: string;
  authId: string;
  username: string;
  fullName: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  bio?: string;
  preferences: {
    language: 'th' | 'en';
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  socialLinks?: {
    facebook?: string;
    line?: string;
    instagram?: string;
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
  privacySettings: {
    showPhone: boolean;
    showEmail: boolean;
    showAddress: boolean;
  };
  lastLogin?: string;
  loginCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileStatsDTO {
  totalProfiles: number;
  verifiedProfiles: number;
  pendingVerification: number;
  activeProfilesToday: number;
  newProfilesThisMonth: number;
  profilesByGender: {
    male: number;
    female: number;
    other: number;
    notSpecified: number;
  };
}

export interface ProfilesDataDTO {
  profiles: ProfileDTO[];
  stats: ProfileStatsDTO;
  totalCount: number;
  currentPage: number;
  perPage: number;
}
