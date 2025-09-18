"use client";

import type { CreateDepartmentDTO } from "@/src/application/dtos/shop/backend/department-dto";
import { useState } from "react";

interface CreateDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (departmentData: CreateDepartmentDTO) => Promise<void>;
  loading?: boolean;
  shopId?: string;
}

export function CreateDepartmentModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  shopId,
}: CreateDepartmentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!shopId) {
      newErrors.shopId = "ไม่พบข้อมูลร้านค้า กรุณารีเฟรชหน้าเว็บ";
    }

    if (!formData.name.trim()) {
      newErrors.name = "กรุณากรอกชื่อแผนก";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "กรุณากรอก slug";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      newErrors.slug =
        "Slug ต้องประกอบด้วยตัวพิมพ์เล็ก ตัวเลข และขีดกลางเท่านั้น";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onSubmit({
          shopId: shopId!,
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
        });
        onClose();
        // Reset form
        setFormData({
          name: "",
          slug: "",
          description: "",
        });
        setErrors({});
      } catch (error) {
        console.error("Error creating department:", error);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: value
        .toLowerCase()
        .replace(/[^a-z0-9ก-๙\s]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim(),
    }));
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          เพิ่มแผนกใหม่
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.shopId && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm">{errors.shopId}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ชื่อแผนก <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="กรอกชื่อแผนก"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange("slug", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                errors.slug
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="slug-for-department"
            />
            {errors.slug && (
              <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Slug จะถูกใช้ใน URL ตัวอย่าง: your-shop.com/departments/slug
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              คำอธิบาย
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="กรอกคำอธิบายเกี่ยวกับแผนก (ไม่บังคับ)"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              disabled={loading}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "กำลังสร้าง..." : "สร้างแผนก"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
