import { ProfileGender, ProfileVerificationStatus } from "@/src/domain/entities/backend/backend-profile.entity";
import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";

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

export interface CreateProfileUseCaseInput {
  userId: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string | null;
  dateOfBirth?: string | null;
  gender?: ProfileGender | null;
  address?: string | null;
  bio?: string | null;
  preferences: {
    language: 'th' | 'en';
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  socialLinks?: {
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
  lastLogin?: string | null;
  loginCount?: number;
  isActive?: boolean;
}

export interface UpdateProfileUseCaseInput {
  id: string;
  userId?: string;
  name?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string | null;
  dateOfBirth?: string | null;
  gender?: ProfileGender | null;
  address?: string | null;
  bio?: string | null;
  preferences?: {
    language: 'th' | 'en';
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  socialLinks?: {
    facebook: string | null;
    line: string | null;
    instagram: string | null;
  } | null;
  verificationStatus?: ProfileVerificationStatus;
  privacySettings?: {
    showPhone: boolean;
    showEmail: boolean;
    showAddress: boolean;
  };
  lastLogin?: string | null;
  loginCount?: number;
  isActive?: boolean;
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

export type PaginatedProfilesDTO = PaginatedResult<ProfileDTO>;
