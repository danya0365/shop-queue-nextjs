"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "@/src/presentation/schemas/auth-schemas";

interface ChangePasswordFormProps {
  loading: boolean;
  error: string | null;
  onSubmit: (data: ChangePasswordFormData) => Promise<boolean>;
}

export function ChangePasswordForm({
  loading,
  error,
  onSubmit,
}: ChangePasswordFormProps) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleFormSubmit = async (data: ChangePasswordFormData) => {
    const success = await onSubmit(data);
    if (success) {
      reset();
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-error/50 bg-error/10 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-foreground mb-1"
          >
            รหัสผ่านใหม่
          </label>
          <div className="relative">
            <input
              {...register("newPassword")}
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              className={`
                w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground
                ${errors.newPassword ? "border-error" : "border-border"}
              `}
              placeholder="กรอกรหัสผ่านใหม่"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-xs text-muted hover:text-foreground"
              disabled={loading}
            >
              {showNewPassword ? "ซ่อน" : "แสดง"}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-sm text-error">{errors.newPassword.message}</p>
          )}
          <p className="mt-2 text-xs text-muted">
            รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษรและประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก และตัวเลข
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-foreground mb-1"
          >
            ยืนยันรหัสผ่านใหม่
          </label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className={`
                w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground
                ${errors.confirmPassword ? "border-error" : "border-border"}
              `}
              placeholder="ยืนยันรหัสผ่านใหม่"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-xs text-muted hover:text-foreground"
              disabled={loading}
            >
              {showConfirmPassword ? "ซ่อน" : "แสดง"}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-error">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "กำลังเปลี่ยนรหัสผ่าน..." : "เปลี่ยนรหัสผ่าน"}
          </button>
        </div>
      </form>
    </div>
  );
}
