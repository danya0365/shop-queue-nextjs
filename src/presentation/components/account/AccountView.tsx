"use client";

import { AuthUserDto } from "@/src/application/dtos/auth-dto";
import {
  CreateProfileInputDto,
  ProfileDto,
  UpdateProfileInputDto,
} from "@/src/application/dtos/profile-dto";
import { ChangePasswordForm } from "@/src/presentation/components/account/ChangePasswordForm";
import { ChangePasswordFormData } from "@/src/presentation/schemas/auth-schemas";
import { useAuthStore } from "@/src/presentation/stores/auth-store";
import { useProfileStore } from "@/src/presentation/stores/profile-store";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { updatePassword } = useAuthStore();

  const metadataEntries = useMemo(
    () => Object.entries(user.userMetadata ?? {}),
    [user.userMetadata]
  );

  const appMetadataEntries = useMemo(
    () => Object.entries(user.appMetadata ?? {}),
    [user.appMetadata]
  );

  const sortedProfiles = useMemo(() => {
    if (!activeProfile) {
      return profiles;
    }
    const others = profiles.filter(
      (profile) => profile.id !== activeProfile.id
    );
    return [activeProfile, ...others];
  }, [activeProfile, profiles]);

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

  const handleChangePassword = async (
    data: ChangePasswordFormData
  ): Promise<boolean> => {
    setIsPasswordSaving(true);
    setPasswordError(null);
    try {
      const result = await updatePassword(data.newPassword);

      if (result.error) {
        setPasswordError(result.error.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้");
        return false;
      }

      setSuccessMessage("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
      return true;
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const handleCancelForm = () => {
    setViewMode("list");
    setEditingProfile(null);
  };

  // Calculate stats
  const totalProfiles = profiles.length;
  const activeProfilesCount = profiles.filter((p) => p.isActive).length;
  const activeProfilesPercentage =
    totalProfiles > 0
      ? Math.round((activeProfilesCount / totalProfiles) * 100)
      : 0;

  const accountStatusLabel = user.emailConfirmedAt
    ? "ยืนยันแล้ว"
    : "รอการยืนยัน";
  const accountStatusTone = user.emailConfirmedAt
    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200"
    : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200";

  const formatDateTime = (value?: string | null) => {
    if (!value) {
      return "—";
    }

    try {
      return new Intl.DateTimeFormat("th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value));
    } catch (err) {
      console.error("Error formatting date", err);
      return value;
    }
  };

  const mapMetadataValue = (value: unknown) => {
    if (value === null || value === undefined) {
      return { text: "—", multiline: false };
    }

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return { text: String(value), multiline: false };
    }

    return { text: JSON.stringify(value, null, 2), multiline: true };
  };

  const activityTimeline = useMemo(
    () =>
      [
        {
          label: "สร้างบัญชี",
          value: user.createdAt,
          description: "สร้างบัญชี Shop Queue สำเร็จ",
        },
        {
          label: "ยืนยันอีเมล",
          value: user.emailConfirmedAt ?? null,
          description: "ยืนยันตัวตนผ่านอีเมล",
        },
        {
          label: "เข้าสู่ระบบล่าสุด",
          value: user.lastSignInAt ?? null,
          description: "กิจกรรมล่าสุด",
        },
        {
          label: "อัปเดตข้อมูล",
          value: user.updatedAt,
          description: "เปลี่ยนแปลงข้อมูลบัญชี",
        },
      ].filter((item) => Boolean(item.value)),
    [user.createdAt, user.emailConfirmedAt, user.lastSignInAt, user.updatedAt]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              บัญชีของคุณ
            </span>
            <h1 className="mt-3 text-3xl font-bold text-foreground">
              แดชบอร์ดบัญชี
            </h1>
            <p className="mt-2 text-muted">
              ภาพรวมข้อมูลจาก Supabase Auth
              พร้อมการจัดการโปรไฟล์และสถานะความปลอดภัยของบัญชีในศูนย์เดียว
            </p>
          </div>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">อีเมลบัญชี</p>
                <p className="mt-1 truncate text-lg font-semibold text-foreground">
                  {user.email}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${accountStatusTone}`}
              >
                {accountStatusLabel}
              </span>
            </div>
            <dl className="mt-6 space-y-3 text-sm text-muted">
              <div className="flex items-center justify-between">
                <dt>เข้าสู่ระบบล่าสุด</dt>
                <dd className="font-medium text-foreground">
                  {formatDateTime(user.lastSignInAt)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>สร้างบัญชีเมื่อ</dt>
                <dd className="font-medium text-foreground">
                  {formatDateTime(user.createdAt)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>อัปเดตล่าสุด</dt>
                <dd className="font-medium text-foreground">
                  {formatDateTime(user.updatedAt)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-sm dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            <span className="ml-2 text-muted">กำลังโหลด...</span>
          </div>
        )}

        {!loading && (
          <>
            {viewMode === "list" && (
              <div className="space-y-10">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                    <p className="text-sm text-muted">สถานะบัญชี</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-2xl font-semibold text-foreground">
                        {accountStatusLabel}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${accountStatusTone}`}
                      >
                        {user.emailConfirmedAt
                          ? "ยืนยันอีเมลแล้ว"
                          : "รอการยืนยัน"}
                      </span>
                    </div>
                    <p className="mt-4 text-xs text-muted">
                      ปรับปรุงล่าสุด {formatDateTime(user.updatedAt)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                    <p className="text-sm text-muted">เข้าสู่ระบบล่าสุด</p>
                    <p className="mt-3 text-2xl font-semibold text-foreground">
                      {formatDateTime(user.lastSignInAt)}
                    </p>
                    <p className="mt-4 text-xs text-muted">
                      ผ่านบัญชี {user.email}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                    <p className="text-sm text-muted">สร้างบัญชีเมื่อ</p>
                    <p className="mt-3 text-2xl font-semibold text-foreground">
                      {formatDateTime(user.createdAt)}
                    </p>
                    <p className="mt-4 text-xs text-muted">
                      รหัสผู้ใช้ {user.id}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted">
                        โปรไฟล์ที่ผูกกับบัญชี
                      </p>
                      <span className="text-xs text-muted">
                        ใช้งาน {activeProfilesCount}/{totalProfiles}
                      </span>
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-foreground">
                      {totalProfiles}
                    </p>
                    <div className="mt-4 h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${activeProfilesPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                  <div className="space-y-8">
                    <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                      <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-foreground">
                            รายละเอียดบัญชี
                          </h2>
                          <p className="mt-1 text-sm text-muted">
                            ข้อมูลจากตาราง `auth.users` ที่ผูกกับบัญชี Shop
                            Queue ของคุณ
                          </p>
                        </div>
                        <Link
                          href="/switch-profile"
                          className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/20"
                        >
                          จัดการการเชื่อมต่อโปรไฟล์
                        </Link>
                      </div>

                      <dl className="mt-6 grid gap-6 md:grid-cols-2">
                        <div>
                          <dt className="text-sm text-muted">ไอดีผู้ใช้</dt>
                          <dd className="mt-1 break-all text-base font-semibold text-foreground">
                            {user.id}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted">บทบาท</dt>
                          <dd className="mt-1 text-base font-semibold text-foreground">
                            {user.role ?? "ผู้ใช้งานทั่วไป"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted">อีเมล</dt>
                          <dd className="mt-1 truncate text-base font-semibold text-foreground">
                            {user.email}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted">เบอร์โทรศัพท์</dt>
                          <dd className="mt-1 text-base font-semibold text-foreground">
                            {user.phone ?? "ยังไม่ได้ระบุ"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted">การยืนยันอีเมล</dt>
                          <dd className="mt-1 text-base font-semibold text-foreground">
                            {user.emailConfirmedAt
                              ? formatDateTime(user.emailConfirmedAt)
                              : "ยังไม่ยืนยัน"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-muted">Audience</dt>
                          <dd className="mt-1 text-base font-semibold text-foreground">
                            {user.aud ?? "ไม่ระบุ"}
                          </dd>
                        </div>
                      </dl>
                    </section>

                    <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-foreground">
                        ความปลอดภัยและกิจกรรม
                      </h2>
                      <p className="mt-1 text-sm text-muted">
                        ตรวจสอบสถานะความปลอดภัยและกิจกรรมล่าสุดเพื่อป้องกันการเข้าถึงที่ไม่พึงประสงค์
                      </p>

                      <div className="mt-6 space-y-6">
                        <div className="rounded-xl border border-border bg-muted-light p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                การยืนยันอีเมล
                              </p>
                              <p className="mt-1 text-xs text-muted">
                                {user.emailConfirmedAt
                                  ? "บัญชีนี้ได้รับการยืนยันแล้ว"
                                  : "กรุณายืนยันอีเมลเพื่อเพิ่มความปลอดภัย"}
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${accountStatusTone}`}
                            >
                              {user.emailConfirmedAt
                                ? "ยืนยันแล้ว"
                                : "ยังไม่ยืนยัน"}
                            </span>
                          </div>
                        </div>

                        <div className="rounded-xl border border-border bg-muted-light p-5">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="max-w-sm">
                              <p className="text-sm font-semibold text-foreground">
                                เปลี่ยนรหัสผ่าน
                              </p>
                              <p className="mt-1 text-xs text-muted">
                                สร้างรหัสผ่านใหม่เพื่อเพิ่มความปลอดภัยให้บัญชีของคุณ
                              </p>
                            </div>
                            <div className="w-full max-w-md">
                              <ChangePasswordForm
                                loading={isPasswordSaving}
                                error={passwordError}
                                onSubmit={handleChangePassword}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            กิจกรรมล่าสุด
                          </p>
                          {activityTimeline.length > 0 ? (
                            <ol className="mt-4 space-y-3">
                              {activityTimeline.map((item, index) => (
                                <li
                                  key={`${item.label}-${item.value}`}
                                  className="flex items-start gap-3"
                                >
                                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                    {index + 1}
                                  </span>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">
                                      {item.label}
                                    </p>
                                    <p className="text-xs text-muted">
                                      {item.description}
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-foreground/70">
                                      {formatDateTime(item.value)}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ol>
                          ) : (
                            <p className="mt-3 text-sm text-muted">
                              ยังไม่มีประวัติกิจกรรมล่าสุด
                            </p>
                          )}
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-8">
                    <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-foreground">
                        ข้อมูลเมตา
                      </h2>
                      <p className="mt-1 text-sm text-muted">
                        ตรวจสอบค่า `user_metadata` และ `app_metadata`
                        ที่แนบมากับบัญชีเพื่อการดีบักหรือการปรับแต่งประสบการณ์ผู้ใช้
                      </p>

                      <div className="mt-6 space-y-6 text-sm">
                        {metadataEntries.length === 0 &&
                          appMetadataEntries.length === 0 && (
                            <p className="text-muted">
                              ยังไม่มีข้อมูลเมตาที่กำหนดไว้สำหรับบัญชีนี้
                            </p>
                          )}

                        {metadataEntries.length > 0 && (
                          <div className="space-y-3">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
                              User Metadata
                            </h3>
                            <div className="space-y-2">
                              {metadataEntries.map(([key, value]) => {
                                const mapped = mapMetadataValue(value);
                                return (
                                  <div
                                    key={`user-metadata-${key}`}
                                    className="rounded-lg border border-border bg-muted-light p-3"
                                  >
                                    <p className="text-xs font-semibold text-muted">
                                      {key}
                                    </p>
                                    {mapped.multiline ? (
                                      <pre className="mt-1 whitespace-pre-wrap text-xs text-foreground/80">
                                        {mapped.text}
                                      </pre>
                                    ) : (
                                      <p className="mt-1 text-sm text-foreground">
                                        {mapped.text}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {appMetadataEntries.length > 0 && (
                          <div className="space-y-3">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
                              App Metadata
                            </h3>
                            <div className="space-y-2">
                              {appMetadataEntries.map(([key, value]) => {
                                const mapped = mapMetadataValue(value);
                                return (
                                  <div
                                    key={`app-metadata-${key}`}
                                    className="rounded-lg border border-border bg-muted-light p-3"
                                  >
                                    <p className="text-xs font-semibold text-muted">
                                      {key}
                                    </p>
                                    {mapped.multiline ? (
                                      <pre className="mt-1 whitespace-pre-wrap text-xs text-foreground/80">
                                        {mapped.text}
                                      </pre>
                                    ) : (
                                      <p className="mt-1 text-sm text-foreground">
                                        {mapped.text}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  </div>
                </div>

                <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                  <div className="flex flex-col gap-4 border-b border-border/60 pb-6 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        โปรไฟล์ที่เชื่อมต่อกับบัญชี
                      </h2>
                      <p className="mt-1 text-sm text-muted">
                        สลับโปรไฟล์เพื่อจัดการข้อมูลร้านค้า การจองคิว
                        และสิทธิ์การเข้าถึงได้รวดเร็ว
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setViewMode("create")}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
                      >
                        <svg
                          className="h-4 w-4"
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

                  <div className="mt-6 space-y-4">
                    {totalProfiles > 0 ? (
                      sortedProfiles.map((profile) => (
                        <ProfileCard
                          key={profile.id}
                          profile={profile}
                          isActive={profile.id === activeProfile?.id}
                          onSwitch={handleSwitchProfile}
                          onEdit={handleEditProfile}
                          onDelete={handleDeleteProfile}
                        />
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-8 text-center">
                        <h3 className="text-lg font-semibold text-foreground">
                          ยังไม่มีโปรไฟล์ที่เชื่อมต่อ
                        </h3>
                        <p className="mt-2 text-sm text-muted">
                          สร้างโปรไฟล์แรกของคุณเพื่อเชื่อมต่อกับร้านค้าและข้อมูลลูกค้าได้เร็วขึ้น
                        </p>
                        <button
                          onClick={() => setViewMode("create")}
                          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
                        >
                          <svg
                            className="h-4 w-4"
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
                    )}
                  </div>
                </section>
              </div>
            )}

            {viewMode === "create" && (
              <div className="mx-auto max-w-3xl">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">
                      สร้างโปรไฟล์ใหม่
                    </h2>
                    <p className="text-sm text-muted">
                      เชื่อมต่อบัญชีของคุณกับโปรไฟล์ลูกค้าหรือลูกค้าองค์กรเพื่อใช้งานบริการของร้านค้า
                    </p>
                  </div>
                  <button
                    onClick={handleCancelForm}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                  >
                    กลับสู่แดชบอร์ด
                  </button>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                  <CreateProfileForm
                    authId={user.id}
                    onSubmit={handleCreateProfile}
                    onCancel={handleCancelForm}
                    loading={loading}
                  />
                </div>
              </div>
            )}

            {viewMode === "edit" && editingProfile && (
              <div className="mx-auto max-w-3xl">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">
                      แก้ไขโปรไฟล์
                    </h2>
                    <p className="text-sm text-muted">
                      ปรับปรุงข้อมูลโปรไฟล์เพื่อให้สอดคล้องกับทีมและการทำงานในปัจจุบัน
                    </p>
                  </div>
                  <button
                    onClick={handleCancelForm}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                  >
                    กลับสู่แดชบอร์ด
                  </button>
                </div>
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                  <EditProfileForm
                    profile={editingProfile}
                    onSubmit={handleUpdateProfile}
                    onCancel={handleCancelForm}
                    loading={loading}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
