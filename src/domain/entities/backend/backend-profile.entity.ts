import { PaginatedResult } from "../../interfaces/pagination-types";

/**
 * Profile entity representing a user profile in the system
 * Following Clean Architecture principles - domain entity
 */
export interface ProfileEntity {
  id: string;
  authId: string;
  username: string;
  fullName: string;
  phone: string;
  email: string;
  avatarUrl: string | null;
  dateOfBirth: string | null;
  gender: ProfileGender | null;
  address: string | null;
  bio: string | null;
  preferences: {
    language: 'th' | 'en';
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  socialLinks: {
    facebook: string | null;
    line: string | null;
    instagram: string | null;
  } | null;
  verificationStatus: ProfileVerificationStatus;
  privacySettings: {
    showPhone: boolean;
    showEmail: boolean;
    showAddress: boolean;
  };
  lastLogin: string | null;
  loginCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Profile gender enum
 */
export enum ProfileGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

/**
 * Profile verification status enum
 */
export enum ProfileVerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

/**
 * Profile statistics entity
 */
export interface ProfileStatsEntity {
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

/**
 * Paginated profiles result
 */
export type PaginatedProfilesEntity = PaginatedResult<ProfileEntity>;
