import { ProfileDto, CreateProfileInputDto, UpdateProfileInputDto } from '../../application/dtos/profile-dto';

/**
 * Profile store state interface
 */
export interface ProfileState {
  // State properties
  profiles: ProfileDto[];
  activeProfile: ProfileDto | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchProfiles: (authId: string) => Promise<ProfileDto[]>;
  fetchActiveProfile: (authId: string) => Promise<ProfileDto | null>;
  createProfile: (profile: CreateProfileInputDto) => Promise<ProfileDto>;
  updateProfile: (id: string, profile: UpdateProfileInputDto) => Promise<ProfileDto>;
  switchProfile: (id: string, authId: string) => Promise<boolean>;
  deleteProfile: (id: string) => Promise<boolean>;
  clearProfiles: () => void;
}
