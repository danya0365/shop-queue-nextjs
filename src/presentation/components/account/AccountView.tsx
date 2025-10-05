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

  // Calculate stats
  const totalProfiles = profiles.length;
  const activeProfilesCount = profiles.filter(p => p.isActive).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            สวัสดี, {user?.email?.split("@")[0] || "ผู้ใช้"}! 👋
          </h1>
          <p className="text-muted">
            {totalProfiles > 0
              ? "จัดการโปรไฟล์และการตั้งค่าบัญชีของคุณ"
              : "เริ่มต้นด้วยการสร้างโปรไฟล์แรกของคุณ"}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400 mr-2"
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
              <p className="text-green-800 dark:text-green-200">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400 mr-2"
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
              <p className="text-red-800 dark:text-red-200">{error}</p>
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
                {totalProfiles > 0 ? (
                  <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {/* Total Profiles Card */}
                      <div className="bg-surface rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted mb-1">โปรไฟล์ทั้งหมด</p>
                            <p className="text-3xl font-bold text-foreground">{totalProfiles}</p>
                            <p className="text-xs text-muted mt-1">โปรไฟล์ที่สร้างไว้</p>
                          </div>
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-blue-600 dark:text-blue-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Active Profile Card */}
                      <div className="bg-surface rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted mb-1">โปรไฟล์ที่ใช้งาน</p>
                            <p className="text-3xl font-bold text-foreground">{activeProfilesCount}</p>
                            <p className="text-xs text-muted mt-1">โปรไฟล์ที่เปิดใช้งาน</p>
                          </div>
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-green-600 dark:text-green-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Account Email Card */}
                      <div className="bg-surface rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-muted mb-1">อีเมลบัญชี</p>
                            <p className="text-lg font-semibold text-foreground truncate">{user.email}</p>
                            <p className="text-xs text-muted mt-1">บัญชีหลัก</p>
                          </div>
                          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0 ml-4">
                            <svg
                              className="w-6 h-6 text-purple-600 dark:text-purple-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Active Profile Section */}
                    {activeProfile && (
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold text-foreground">
                            โปรไฟล์ที่ใช้งานอยู่
                          </h2>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            ใช้งานอยู่
                          </span>
                        </div>
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
                          โปรไฟล์ทั้งหมด
                        </h2>
                        <button
                          onClick={() => setViewMode("create")}
                          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
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
                    </div>
                  </>
                ) : (
                  /* No Profiles State */
                  <div className="text-center py-16">
                    <div className="max-w-md mx-auto">
                      <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                          className="w-12 h-12 text-blue-600 dark:text-blue-400"
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
                      </div>

                      <h2 className="text-2xl font-bold text-foreground mb-4">
                        ยินดีต้อนรับสู่ Shop Queue!
                      </h2>

                      <p className="text-muted mb-8">
                        เริ่มต้นด้วยการสร้างโปรไฟล์แรกของคุณ
                        โปรไฟล์จะช่วยให้คุณจัดการข้อมูลส่วนตัวและการตั้งค่าต่างๆ ได้อย่างมีประสิทธิภาพ
                      </p>

                      <button
                        onClick={() => setViewMode("create")}
                        className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
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
                  </div>
                )}
              </>
            )}

            {viewMode === "create" && (
              <div className="max-w-2xl mx-auto">
                <CreateProfileForm
                  authId={user.id}
                  onSubmit={handleCreateProfile}
                  onCancel={handleCancelForm}
                  loading={loading}
                />
              </div>
            )}

            {viewMode === "edit" && editingProfile && (
              <div className="max-w-2xl mx-auto">
                <EditProfileForm
                  profile={editingProfile}
                  onSubmit={handleUpdateProfile}
                  onCancel={handleCancelForm}
                  loading={loading}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
