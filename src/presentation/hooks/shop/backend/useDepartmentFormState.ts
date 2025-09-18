import { useState } from "react";

export interface DepartmentFormData {
  name: string;
  slug: string;
  description: string;
}

export interface DepartmentFormErrors {
  name?: string;
  slug?: string;
  description?: string;
  shopId?: string;
}

export function useDepartmentFormState() {
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: "",
    slug: "",
    description: "",
  });

  const [errors, setErrors] = useState<DepartmentFormErrors>({});

  const validateForm = (shopId?: string): boolean => {
    const newErrors: DepartmentFormErrors = {};

    if (!shopId) {
      newErrors.shopId = "ไม่พบข้อมูลร้านค้า กรุณารีเฟรชหน้าเว็บ";
    }

    if (!formData.name.trim()) {
      newErrors.name = "กรุณากรอกชื่อแผนก";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "กรุณากรอก slug";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      newErrors.slug = "Slug ต้องประกอบด้วยตัวพิมพ์เล็ก ตัวเลข และขีดกลางเท่านั้น";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: keyof DepartmentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const clearError = (field: keyof DepartmentFormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
    });
    setErrors({});
  };

  // Auto-generate slug from name
  const generateSlugFromName = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9ก-๙\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    
    updateField("name", name);
    updateField("slug", slug);
    
    if (errors.name) {
      clearError("name");
    }
    if (errors.slug) {
      clearError("slug");
    }
  };

  return {
    formData,
    errors,
    validateForm,
    updateField,
    clearError,
    resetForm,
    generateSlugFromName,
    setFormData,
    setErrors,
  };
}
