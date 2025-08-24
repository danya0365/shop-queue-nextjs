"use client";

import { AuthUserDto } from "@/src/application/dtos/auth-dto";
import {
  CreateProfileInputDto,
  ProfileDto,
  UpdateProfileInputDto,
} from "@/src/application/dtos/profile-dto";
import { useProfileStore } from "@/src/presentation/stores/profile-store";
import { useEffect, useState } from "react";
import { CreateProfileForm } from "./CreateProfileForm";
import { EditProfileForm } from "./EditProfileForm";
import { ProfileCard } from "./ProfileCard";

interface AccountViewProps {
  user: AuthUserDto;
}

type ViewMode = "list" | "create" | "edit";

export function AccountView({ user }: AccountViewProps) {
  const {
    profiles,
    activeProfile,
    loading,
    error,
    fetchProfiles,
    fetchActiveProfile,
    createProfile,
    updateProfile,
    switchProfile,
    deleteProfile,
  } = useProfileStore();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingProfile, setEditingProfile] = useState<ProfileDto | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load profiles on component mount
  useEffect(() => {
    const loadProfiles = async () => {
      await Promise.all([fetchProfiles(user.id), fetchActiveProfile(user.id)]);
    };

    loadProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleCreateProfile = async (data: CreateProfileInputDto) => {
    try {
      await createProfile(data);
      setSuccessMessage("สร้างโปรไฟล์ใหม่เรียบร้อยแล้ว");
      setViewMode("list");
    } catch (error) {
      // Error is handled by the store
      console.error("Error creating profile:", error);
    }
  };

  const handleUpdateProfile = async (
    profileId: string,
    data: UpdateProfileInputDto
  ) => {
    try {
      await updateProfile(profileId, data);
      setSuccessMessage("อัปเดตโปรไฟล์เรียบร้อยแล้ว");
      setViewMode("list");
      setEditingProfile(null);
    } catch (error) {
      // Error is handled by the store
      console.error("Error updating profile:", error);
    }
  };

  const handleSwitchProfile = async (profileId: string) => {
    try {
      const success = await switchProfile(profileId, user.id);
      if (success) {
        setSuccessMessage("เปลี่ยนโปรไฟล์หลักเรียบร้อยแล้ว");
      }
    } catch (error) {
      // Error is handled by the store
      console.error("Error switching profile:", error);
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (
      window.confirm(
        "คุณแน่ใจหรือไม่ที่จะลบโปรไฟล์นี้? การกระทำนี้ไม่สามารถยกเลิกได้"
      )
    ) {
      try {
        const success = await deleteProfile(profileId);
        if (success) {
          setSuccessMessage("ลบโปรไฟล์เรียบร้อยแล้ว");
        }
      } catch (error) {
        // Error is handled by the store
        console.error("Error deleting profile:", error);
      }
    }
  };

  const handleEditProfile = (profile: ProfileDto) => {
    setEditingProfile(profile);
    setViewMode("edit");
  };

  const handleCancelForm = () => {
    setViewMode("list");
    setEditingProfile(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">จัดการบัญชี</h1>
          <p className="text-muted">จัดการโปรไฟล์และการตั้งค่าบัญชีของคุณ</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-success-light border border-success rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-success mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-success-dark">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-error-light border border-error rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-error mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-error-dark">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted">กำลังโหลด...</span>
          </div>
        )}

        {/* Content based on view mode */}
        {!loading && (
          <>
            {viewMode === "list" && (
              <>
                {/* Active Profile Section */}
                {activeProfile && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      โปรไฟล์ที่ใช้งานอยู่
                    </h2>
                    <ProfileCard
                      profile={activeProfile}
                      isActive={true}
                      onSwitch={handleSwitchProfile}
                      onEdit={handleEditProfile}
                      onDelete={handleDeleteProfile}
                    />
                  </div>
                )}

                {/* All Profiles Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">
                      โปรไฟล์ทั้งหมด ({profiles.length})
                    </h2>
                    <button
                      onClick={() => setViewMode("create")}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      สร้างโปรไฟล์ใหม่
                    </button>
                  </div>

                  {profiles.length === 0 ? (
                    <div className="text-center py-12 bg-surface rounded-lg border border-border">
                      <svg
                        className="w-16 h-16 text-muted mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        ไม่มีโปรไฟล์
                      </h3>
                      <p className="text-muted mb-4">
                        เริ่มต้นด้วยการสร้างโปรไฟล์แรกของคุณ
                      </p>
                      <button
                        onClick={() => setViewMode("create")}
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium"
                      >
                        สร้างโปรไฟล์ใหม่
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {profiles.map((profile) => (
                        <ProfileCard
                          key={profile.id}
                          profile={profile}
                          isActive={profile.id === activeProfile?.id}
                          onSwitch={handleSwitchProfile}
                          onEdit={handleEditProfile}
                          onDelete={handleDeleteProfile}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {viewMode === "create" && (
              <CreateProfileForm
                authId={user.id}
                onSubmit={handleCreateProfile}
                onCancel={handleCancelForm}
                loading={loading}
              />
            )}

            {viewMode === "edit" && editingProfile && (
              <EditProfileForm
                profile={editingProfile}
                onSubmit={handleUpdateProfile}
                onCancel={handleCancelForm}
                loading={loading}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
