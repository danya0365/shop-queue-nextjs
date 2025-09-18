"use client";

import type { CreateProfileDto } from "@/src/application/dtos/profile-dto";
import { useProfileFormState } from "@/src/presentation/hooks/shop/backend/useProfileFormState";
import { useAuthStore } from "@/src/presentation/stores/auth-store";

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (profileData: CreateProfileDto) => Promise<void>;
  loading?: boolean;
}

export function CreateProfileModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}: CreateProfileModalProps) {
  const { formData, errors, validateForm, updateField, resetForm } = useProfileFormState();
  const { authAccount } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onSubmit({
          authId: authAccount!.id,
          name: formData.name,
          username: formData.username,
          bio: formData.bio || undefined,
          avatarUrl: formData.avatarUrl || undefined,
          isActive: formData.isActive,
        });
        resetForm();
        onClose();
      } catch (error) {
        console.error("Error creating profile:", error);
        alert("เกิดข้อผิดพลาดในการสร้างโปรไฟล์ใหม่");
      }
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    updateField(field, value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          สร้างโปรไฟล์ใหม่
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ชื่อโปรไฟล์ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="กรอกชื่อโปรไฟล์"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ชื่อผู้ใช้ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="กรอกชื่อผู้ใช้"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ประวัติ
            </label>
            <textarea
              value={formData.bio || ""}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="กรอกประวัติโปรไฟล์ (ไม่จำเป็น)"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL รูปประจำตัว
            </label>
            <input
              type="url"
              value={formData.avatarUrl || ""}
              onChange={(e) => handleInputChange("avatarUrl", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="กรอก URL รูปประจำตัว (ไม่จำเป็น)"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange("isActive", e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              เปิดใช้งานโปรไฟล์
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "กำลังสร้าง..." : "สร้างโปรไฟล์"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
