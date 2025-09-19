"use client";

import type { CreateProfileDto } from "@/src/application/dtos/profile-dto";
import type { CreateEmployeeParams } from "@/src/application/dtos/shop/backend/employees-dto";
import { EmployeePermission } from "@/src/domain/entities/shop/backend/backend-employee.entity";
import { DepartmentSelectionDropdown } from "@/src/presentation/components/shop/backend/dropdown/DepartmentSelectionDropdown";
import { ProfileSelectionDropdown } from "@/src/presentation/components/shop/backend/dropdown/ProfileSelectionDropdown";
import { PermissionSelection } from "@/src/presentation/components/shop/backend/employee/PermissionSelection";
import { CreateProfileModal } from "@/src/presentation/components/shop/backend/profile/modals/CreateProfileModal";
import { useDepartmentFormState } from "@/src/presentation/hooks/shop/backend/useDepartmentFormState";
import {
  useDepartments,
  type Department,
} from "@/src/presentation/hooks/shop/backend/useDepartments";
import { useEmployeeFormState } from "@/src/presentation/hooks/shop/backend/useEmployeeFormState";
import {
  useProfiles,
  type Profile,
} from "@/src/presentation/hooks/shop/backend/useProfiles";
import { useState } from "react";

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employeeData: CreateEmployeeParams) => Promise<void>;
  loading?: boolean;
  shopId: string;
}

export function CreateEmployeeModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  shopId,
}: CreateEmployeeModalProps) {
  // Employee form state
  const {
    formData,
    errors,
    validateForm,
    updateField,
    clearError,
    resetForm: resetEmployeeForm,
  } = useEmployeeFormState();

  // Department form state
  const {
    formData: departmentFormData,
    errors: departmentErrors,
    validateForm: validateDepartmentForm,
    updateField: updateDepartmentField,
    resetForm: resetDepartmentForm,
  } = useDepartmentFormState();

  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showCreateDepartmentForm, setShowCreateDepartmentForm] =
    useState(false);
  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);

  const { createDepartment } = useDepartments(shopId);
  const { createProfile } = useProfiles();

  const validateEmployeeForm = () => {
    return validateForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmployeeForm()) {
      try {
        await onSubmit({
          shopId,
          employeeCode: formData.employeeCode,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          departmentId: formData.departmentId,
          position: formData.position,
          salary: formData.salary,
          status: formData.status,
          hireDate: formData.hireDate,
          profileId: formData.profileId,
          permissions: formData.permissions,
        });
        resetEmployeeForm();
        onClose();
      } catch (error) {
        console.error("Error creating employee:", error);
      }
    }
  };

  const handleDepartmentSelect = (department: Department) => {
    setSelectedDepartment(department);
    updateField("departmentId", department.id);
    clearError("department");
  };

  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile);
    updateField("profileId", profile.id);
    // Optionally pre-fill some fields from profile
    updateField("name", profile.name);
    updateField(
      "email",
      profile.username.includes("@") ? profile.username : ""
    );
    clearError("profile");
  };

  const handleCreateNewDepartment = () => {
    setShowCreateDepartmentForm(true);
    setSelectedDepartment(null);
    updateField("departmentId", "");
    resetDepartmentForm();
  };

  const handleCreateNewProfile = () => {
    setShowCreateProfileModal(true);
    setSelectedProfile(null);
    updateField("profileId", "");
  };

  const handleCreateDepartment = async () => {
    if (!validateDepartmentForm(shopId)) {
      return;
    }

    try {
      const newDepartment = await createDepartment({
        shopId: shopId,
        slug: departmentFormData.slug,
        name: departmentFormData.name,
        description: departmentFormData.description || undefined,
      });

      setSelectedDepartment(newDepartment);
      setShowCreateDepartmentForm(false);
      updateField("departmentId", newDepartment.id);
      clearError("department");
      resetDepartmentForm();
    } catch (error) {
      console.error("Error creating department:", error);
      alert("เกิดข้อผิดพลาดในการสร้างแผนกใหม่");
    }
  };

  const handleCreateProfile = async (profileData: CreateProfileDto) => {
    try {
      const newProfile = await createProfile(profileData);
      setShowCreateProfileModal(false);

      // Automatically select the newly created profile
      setSelectedProfile(newProfile);
      updateField("profileId", newProfile.id);
      clearError("profile");

      // Pre-fill some fields from profile
      updateField("name", newProfile.name);
      updateField(
        "email",
        newProfile.username.includes("@") ? newProfile.username : ""
      );
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    updateField(field, value);
  };

  const handlePermissionsChange = (permissions: EmployeePermission[]) => {
    updateField("permissions", permissions);
  };

  return (
    isOpen && (
      <>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col gap-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              เพิ่มพนักงานใหม่
            </h3>

            {/* Profile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                โปรไฟล์ <span className="text-red-500">*</span>
              </label>
              <div>
                <ProfileSelectionDropdown
                  selectedProfile={selectedProfile}
                  onProfileSelect={handleProfileSelect}
                  onCreateNewProfile={handleCreateNewProfile}
                  placeholder="เลือกโปรไฟล์..."
                  disabled={loading}
                />
                {errors.profile && (
                  <p className="text-sm text-red-500 mt-2">{errors.profile}</p>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ชื่อพนักงาน <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="กรอกชื่อพนักงาน"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Employee Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  รหัสพนักงาน <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.employeeCode}
                  onChange={(e) =>
                    handleInputChange("employeeCode", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.employeeCode
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="กรอกรหัสพนักงาน"
                />
                {errors.employeeCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.employeeCode}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  อีเมล
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.phone
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="0xx-xxx-xxxx"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  แผนก <span className="text-red-500">*</span>
                </label>
                {!showCreateDepartmentForm ? (
                  <div>
                    <DepartmentSelectionDropdown
                      shopId={shopId}
                      selectedDepartment={selectedDepartment}
                      onDepartmentSelect={handleDepartmentSelect}
                      onCreateNewDepartment={handleCreateNewDepartment}
                      placeholder="เลือกแผนก..."
                      disabled={loading}
                    />
                    {errors.department && (
                      <p className="text-sm text-red-500 mt-2">
                        {errors.department}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        สร้างแผนกใหม่
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowCreateDepartmentForm(false)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        disabled={loading}
                      >
                        ← เลือกแผนกที่มีอยู่แล้ว
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ชื่อแผนก <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={departmentFormData.name}
                        onChange={(e) =>
                          updateDepartmentField("name", e.target.value)
                        }
                        placeholder="กรอกชื่อแผนก"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          departmentErrors.name
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        disabled={loading}
                      />
                      {departmentErrors.name && (
                        <p className="text-sm text-red-500 mt-1">
                          {departmentErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Slug <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={departmentFormData.slug}
                        onChange={(e) =>
                          updateDepartmentField("slug", e.target.value)
                        }
                        placeholder="กรอก Slug"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          departmentErrors.slug
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        disabled={loading}
                      />
                      {departmentErrors.slug && (
                        <p className="text-sm text-red-500 mt-1">
                          {departmentErrors.slug}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        คำอธิบาย
                      </label>
                      <textarea
                        value={departmentFormData.description}
                        onChange={(e) =>
                          updateDepartmentField("description", e.target.value)
                        }
                        placeholder="กรอกคำอธิบาย"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          departmentErrors.description
                            ? "border-red-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        disabled={loading}
                      />
                      {departmentErrors.description && (
                        <p className="text-sm text-red-500 mt-1">
                          {departmentErrors.description}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowCreateDepartmentForm(false)}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        disabled={loading}
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="button"
                        onClick={handleCreateDepartment}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        สร้างแผนก
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ตำแหน่ง <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    handleInputChange("position", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.position
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="กรอกตำแหน่ง"
                />
                {errors.position && (
                  <p className="text-red-500 text-sm mt-1">{errors.position}</p>
                )}
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  เงินเดือน <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => handleInputChange("salary", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.salary
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="0"
                />
                {errors.salary && (
                  <p className="text-red-500 text-sm mt-1">{errors.salary}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  สถานะ
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="active">ทำงาน</option>
                  <option value="inactive">ไม่ทำงาน</option>
                  <option value="on_leave">ลา</option>
                </select>
              </div>

              {/* Hire Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  วันที่เริ่มงาน <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) =>
                    handleInputChange("hireDate", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.hireDate
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.hireDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.hireDate}</p>
                )}
              </div>

              {/* Permissions */}
              <div>
                <PermissionSelection
                  selectedPermissions={formData.permissions}
                  onPermissionChange={handlePermissionsChange}
                  disabled={loading}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "กำลังสร้าง..." : "เพิ่มพนักงาน"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Create Profile Modal */}
        <CreateProfileModal
          isOpen={showCreateProfileModal}
          onClose={() => setShowCreateProfileModal(false)}
          onSubmit={handleCreateProfile}
        />
      </>
    )
  );
}
