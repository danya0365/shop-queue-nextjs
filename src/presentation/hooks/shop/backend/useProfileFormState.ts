import { useState } from "react";

export interface ProfileFormData {
  authId: string;
  username: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  isActive?: boolean;
}

export interface ProfileFormErrors {
  authId?: string;
  name?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  isActive?: string;
}

export function useProfileFormState() {
  const [formData, setFormData] = useState<ProfileFormData>({
    authId: "",
    name: "",
    username: "",
    bio: "",
    avatarUrl: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<ProfileFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ProfileFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "กรุณากรอกชื่อโปรไฟล์";
    }

    if (!formData.username.trim()) {
      newErrors.username = "กรุณากรอกชื่อผู้ใช้";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: keyof ProfileFormData, value: string | boolean | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const clearError = (field: keyof ProfileFormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const resetForm = () => {
    setFormData({
      authId: "",
      name: "",
      username: "",
      bio: "",
      avatarUrl: "",
      isActive: true,
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    validateForm,
    updateField,
    clearError,
    resetForm,
    setFormData,
    setErrors,
  };
}
