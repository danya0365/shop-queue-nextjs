"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { SwitchProfileViewModel } from "@/src/presentation/presenters/account/SwitchProfilePresenter";
import { useProfileStore } from "@/src/presentation/stores/profile-store";

interface SwitchProfileViewProps {
  viewModel: SwitchProfileViewModel;
}

const roleLabelMap = {
  admin: "ผู้ดูแลระบบ",
  moderator: "ผู้ดูแล",
  user: "ผู้ใช้งาน",
} as const;

export function SwitchProfileView({ viewModel }: SwitchProfileViewProps) {
  const {
    switchProfile,
    loading,
    error,
  } = useProfileStore();
  const initialProfiles = useMemo(() => viewModel.profiles, [viewModel.profiles]);
  const [profiles, setProfiles] = useState(initialProfiles);
  const [activeProfileId, setActiveProfileId] = useState(viewModel.activeProfile?.id ?? null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setProfiles(viewModel.profiles);
    setActiveProfileId(viewModel.activeProfile?.id ?? null);
    useProfileStore.setState({
      profiles: viewModel.profiles,
      activeProfile: viewModel.activeProfile ?? null,
    });
  }, [viewModel.profiles, viewModel.activeProfile]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleSwitch = async (profileId: string) => {
    if (!viewModel.user) return;
    setLocalError(null);

    const success = await switchProfile(profileId, viewModel.user.id);
    if (success) {
      setProfiles((prev) =>
        prev.map((profile) => ({
          ...profile,
          isActive: profile.id === profileId,
        }))
      );
      setActiveProfileId(profileId);
      setSuccessMessage("เปลี่ยนโปรไฟล์หลักเรียบร้อยแล้ว");
    } else {
      setLocalError("ไม่สามารถเปลี่ยนโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const activeProfile = profiles.find((profile) => profile.id === activeProfileId) ?? null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">สลับโปรไฟล์การใช้งาน</h1>
            <p className="mt-2 text-muted-foreground">
              เลือกโปรไฟล์ที่จะใช้สำหรับการดำเนินงานในระบบ Shop Queue ได้อย่างรวดเร็ว
            </p>
          </div>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/70 transition-colors"
          >
            <span aria-hidden>←</span>
            กลับไปหน้าจัดการโปรไฟล์
          </Link>
        </div>

        {successMessage && (
          <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
            {successMessage}
          </div>
        )}

        {(localError || error) && (
          <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
            {localError || error}
          </div>
        )}

        {activeProfile ? (
          <div className="rounded-xl border border-primary/40 bg-primary/10 p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-primary">โปรไฟล์ที่ใช้งานอยู่</p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">{activeProfile.fullName || activeProfile.name}</h2>
                <p className="text-sm text-muted-foreground">
                  @{activeProfile.username} · {roleLabelMap[activeProfile.role]}
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary text-white px-4 py-2 text-sm font-medium">
                ใช้งานอยู่
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface p-6 text-center text-sm text-muted-foreground">
            ยังไม่มีโปรไฟล์ที่ถูกตั้งให้ใช้งานอยู่
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">โปรไฟล์ทั้งหมด</h2>
          <div className="grid gap-4">
            {profiles.map((profile) => {
              const isActive = profile.id === activeProfileId;
              return (
                <div
                  key={profile.id}
                  className={`rounded-xl border p-6 transition-all ${
                    isActive
                      ? "border-primary shadow-lg ring-1 ring-primary/40 bg-surface"
                      : "border-border bg-background hover:border-border-dark hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-gradient text-xl font-semibold text-white">
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-foreground">
                          {profile.fullName || profile.name}
                        </p>
                        <p className="text-sm text-muted-foreground">@{profile.username}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {roleLabelMap[profile.role]}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 md:w-56">
                      <button
                        type="button"
                        onClick={() => handleSwitch(profile.id)}
                        disabled={isActive || loading}
                        className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-primary text-white hover:bg-primary/90"
                        } ${loading ? "opacity-75" : ""}`}
                      >
                        {isActive ? "ใช้งานอยู่" : "ใช้โปรไฟล์นี้"}
                      </button>
                      {!isActive && (
                        <Link
                          href="/account"
                          className="w-full rounded-lg border border-border px-4 py-2 text-center text-sm font-medium text-foreground hover:bg-muted/70 transition-colors"
                        >
                          แก้ไขในหน้าจัดการโปรไฟล์
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
