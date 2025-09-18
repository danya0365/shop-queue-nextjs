"use client";

import { CreateProfileDto } from "@/src/application/dtos/profile-dto";
import { ClientProfileSelectionPresenterFactory } from "@/src/presentation/presenters/shop/backend/ProfileSelectionPresenter";
import { useCallback, useEffect, useState } from "react";

const presenter = await ClientProfileSelectionPresenterFactory.create();

export interface Profile {
  authId: string;
  id: string;
  name: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  role: "user" | "moderator" | "admin";
  isActive: boolean;
  createdAt: string;
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const viewModel = await presenter.getViewModel();

      // Transform to view model
      const transformedProfiles = viewModel.profiles.map(
        (profile): Profile => ({
          authId: profile.authId,
          id: profile.id,
          name: profile.name,
          username: profile.username,
          fullName: profile.fullName,
          avatarUrl: profile.avatarUrl,
          role: profile.role,
          isActive: profile.isActive,
          createdAt: profile.createdAt,
        })
      );

      setProfiles(transformedProfiles);
    } catch (err) {
      console.error("Error fetching profiles:", err);
      setError("ไม่สามารถดึงข้อมูลโปรไฟล์ได้");
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProfiles = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);

      const viewModel = await presenter.getViewModel(query);

      // Transform to view model
      const transformedProfiles = viewModel.profiles.map(
        (profile): Profile => ({
          authId: profile.authId,
          id: profile.id,
          name: profile.name,
          username: profile.username,
          fullName: profile.fullName,
          avatarUrl: profile.avatarUrl,
          role: profile.role,
          isActive: profile.isActive,
          createdAt: profile.createdAt,
        })
      );

      setProfiles(transformedProfiles);
    } catch (err) {
      console.error("Error searching profiles:", err);
      setError("ไม่สามารถค้นหาโปรไฟล์ได้");
    } finally {
      setLoading(false);
    }
  }, []);

  const createProfile = useCallback(
    async (profileData: CreateProfileDto): Promise<Profile> => {
      try {
        setLoading(true);
        setError(null);

        const newProfile = await presenter.createProfile(profileData);

        // Transform to view model
        const transformedProfile: Profile = {
          authId: newProfile.authId,
          id: newProfile.id,
          name: newProfile.name,
          username: newProfile.username,
          fullName: newProfile.fullName,
          avatarUrl: newProfile.avatarUrl,
          role: newProfile.role,
          isActive: newProfile.isActive,
          createdAt: newProfile.createdAt,
        };

        // Update profiles list
        setProfiles((prev) => [...prev, transformedProfile]);

        return transformedProfile;
      } catch (err) {
        console.error("Error creating profile:", err);
        setError("ไม่สามารถสร้างโปรไฟล์ได้");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Load profiles on mount
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return {
    profiles,
    loading,
    error,
    fetchProfiles,
    searchProfiles,
    createProfile,
  };
}
