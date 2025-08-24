import { IProfileService } from "@/src/application/interfaces/profile-service.interface";
import { Logger } from "@/src/domain/interfaces/logger";
import {
  CreateProfileInputDto,
  ProfileDto,
  UpdateProfileInputDto,
} from "../../application/dtos/profile-dto";
import { ProfileState } from "./profile-store.types";

/**
 * Factory function to create profile actions
 * Following SOLID principles with dependency injection
 */
export const createProfileActions = (
  profileService: IProfileService,
  logger: Logger,
  getState: () => ProfileState,
  setState: (state: Partial<ProfileState>) => void
) => ({
  fetchProfiles: async (authId: string): Promise<ProfileDto[]> => {
    setState({ loading: true, error: null });
    try {
      const profiles = await profileService.getProfilesByAuthId(authId);
      setState({ profiles, loading: false });
      return profiles;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch profiles";
      logger.error("Error fetching profiles:", error);
      setState({ error: errorMessage, loading: false });
      return [];
    }
  },

  fetchActiveProfile: async (authId: string): Promise<ProfileDto | null> => {
    setState({ loading: true, error: null });
    try {
      const activeProfile = await profileService.getActiveProfileByAuthId(
        authId
      );
      setState({ activeProfile, loading: false });
      return activeProfile;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch active profile";
      logger.error("Error fetching active profile:", error);
      setState({ error: errorMessage, loading: false });
      return null;
    }
  },

  createProfile: async (
    profile: CreateProfileInputDto
  ): Promise<ProfileDto> => {
    setState({ loading: true, error: null });
    try {
      const newProfile = await profileService.createProfile(profile);

      // Update the profiles list
      const currentProfiles = getState().profiles;
      setState({
        profiles: [...currentProfiles, newProfile],
        loading: false,
      });

      // If this is the first profile or it's set as active, update activeProfile
      if (newProfile.isActive || currentProfiles.length === 0) {
        setState({ activeProfile: newProfile });
      }

      return newProfile;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create profile";
      logger.error("Error creating profile:", error);
      setState({ error: errorMessage, loading: false });
      throw error;
    }
  },

  updateProfile: async (
    id: string,
    profile: UpdateProfileInputDto
  ): Promise<ProfileDto> => {
    setState({ loading: true, error: null });
    try {
      const updatedProfile = await profileService.updateProfile(id, profile);
      if (!updatedProfile) {
        throw new Error("Failed to update profile");
      }

      // Update the profiles list and active profile if needed
      const currentProfiles = getState().profiles.map((p) =>
        p.id === id ? updatedProfile : p
      );

      setState({ profiles: currentProfiles, loading: false });

      // If the updated profile is the active one, update activeProfile
      if (getState().activeProfile?.id === id) {
        setState({ activeProfile: updatedProfile });
      }

      return updatedProfile;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      logger.error("Error updating profile:", error);
      setState({ error: errorMessage, loading: false });
      throw error;
    }
  },

  switchProfile: async (id: string, authId: string): Promise<boolean> => {
    setState({ loading: true, error: null });
    try {
      // setActive returns void, so we just await it and continue
      await profileService.setActiveProfile(id, authId);

      // Update all profiles' isActive status
      const updatedProfiles = getState().profiles.map((profile) => ({
        ...profile,
        isActive: profile.id === id,
      }));

      // Find the newly active profile
      const newActiveProfile =
        updatedProfiles.find((profile) => profile.id === id) || null;

      setState({
        profiles: updatedProfiles,
        activeProfile: newActiveProfile,
        loading: false,
      });

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to switch profile";
      logger.error("Error switching profile:", error);
      setState({ error: errorMessage, loading: false });
      return false;
    }
  },

  deleteProfile: async (id: string): Promise<boolean> => {
    setState({ loading: true, error: null });
    try {
      // delete returns void, so we just await it and continue
      await profileService.deleteProfile({ id });

      // Remove the deleted profile from the list
      const updatedProfiles = getState().profiles.filter(
        (profile) => profile.id !== id
      );

      setState({
        profiles: updatedProfiles,
        // If we deleted the active profile, set activeProfile to null
        activeProfile:
          getState().activeProfile?.id === id ? null : getState().activeProfile,
        loading: false,
      });

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete profile";
      logger.error("Error deleting profile:", error);
      setState({ error: errorMessage, loading: false });
      return false;
    }
  },

  clearProfiles: (): void => {
    setState({ profiles: [], activeProfile: null, error: null });
  },
});
