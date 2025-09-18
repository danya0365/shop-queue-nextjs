"use client";

import type { CreateEmployeeParams } from "@/src/application/dtos/shop/backend/employees-dto";
import { EmployeeStatus } from "@/src/application/dtos/shop/backend/employees-dto";
import { DepartmentSelectionDropdown } from "@/src/presentation/components/shop/backend/dropdown/DepartmentSelectionDropdown";
import { ProfileSelectionDropdown } from "@/src/presentation/components/shop/backend/dropdown/ProfileSelectionDropdown";
import {
  useDepartments,
  type Department,
} from "@/src/presentation/hooks/shop/backend/useDepartments";
import {
  useProfiles,
  type Profile,
} from "@/src/presentation/hooks/shop/backend/useProfiles";
import { useAuthStore } from "@/src/presentation/stores/auth-store";
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
  const [formData, setFormData] = useState({
    employeeCode: "",
    name: "",
    email: "",
    phone: "",
    departmentId: "",
    position: "",
    salary: 0,
    status: EmployeeStatus.ACTIVE,
    hireDate: "",
    profileId: "", // Added profileId field
  });
  const [formDataProfile, setFormDataProfile] = useState({
    name: "",
    username: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showCreateDepartmentForm, setShowCreateDepartmentForm] =
    useState(false);
  const [showCreateProfileForm, setShowCreateProfileForm] = useState(false);

  const { createDepartment } = useDepartments(shopId);
  const { authAccount } = useAuthStore();
  const { createProfile } = useProfiles();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "กรุณากรอกชื่อพนักงาน";
    }

    if (!formData.employeeCode.trim()) {
      newErrors.employeeCode = "กรุณากรอกรหัสพนักงาน";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    if (
      formData.phone &&
      !/^0[0-9]{9}$/.test(formData.phone.replace(/[-\s]/g, ""))
    ) {
      newErrors.phone = "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง";
    }

    if (!formData.departmentId.trim() && !showCreateDepartmentForm) {
      newErrors.department = "กรุณาเลือกแผนกหรือสร้างแผนกใหม่";
    }

    // Validate profile selection
    if (!formData.profileId && !showCreateProfileForm) {
      newErrors.profile = "กรุณาเลือกโปรไฟล์หรือสร้างโปรไฟล์ใหม่";
    }

    if (!formData.position.trim()) {
      newErrors.position = "กรุณากรอกตำแหน่ง";
    }

    if (formData.salary <= 0) {
      newErrors.salary = "กรุณากรอกเงินเดือนที่มากกว่า 0";
    }

    if (!formData.hireDate) {
      newErrors.hireDate = "กรุณาเลือกวันที่เริ่มงาน";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onSubmit({
          employeeCode: formData.employeeCode,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          departmentId: formData.departmentId,
          position: formData.position,
          salary: formData.salary,
          status: formData.status,
          hireDate: formData.hireDate,
          profileId: formData.profileId, // Added profileId
        });
        onClose();
      } catch (error) {
        console.error("Error creating employee:", error);
      }
    }
  };

  const handleDepartmentSelect = (department: Department) => {
    setSelectedDepartment(department);
    setFormData((prev) => ({
      ...prev,
      departmentId: department.id,
    }));
    // Clear department-related errors
    if (errors.department) {
      setErrors((prev) => ({
        ...prev,
        department: "",
      }));
    }
  };

  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile);
    setFormData((prev) => ({
      ...prev,
      profileId: profile.id,
      // Optionally pre-fill some fields from profile
      name: profile.name,
      email: profile.username.includes("@") ? profile.username : "",
    }));
    // Clear profile-related errors
    if (errors.profile) {
      setErrors((prev) => ({
        ...prev,
        profile: "",
      }));
    }
  };

  const handleCreateNewDepartment = () => {
    setShowCreateDepartmentForm(true);
    setSelectedDepartment(null);
    setFormData((prev) => ({
      ...prev,
      departmentId: "",
    }));
  };

  const handleCreateNewProfile = () => {
    setShowCreateProfileForm(true);
    setSelectedProfile(null);
    setFormData((prev) => ({
      ...prev,
      profileId: "",
    }));
  };

  const handleCreateDepartment = async () => {
    const newErrors: Record<string, string> = {};

    if (!formData.departmentId.trim()) {
      newErrors.department = "กรุณากรอกชื่อแผนก";
      setErrors(newErrors);
      return;
    }

    try {
      const newDepartment = await createDepartment({
        name: formData.departmentId,
        description: undefined,
        shopId: shopId || "",
      });

      setSelectedDepartment(newDepartment);
      setShowCreateDepartmentForm(false);
      setFormData((prev) => ({
        ...prev,
        departmentId: newDepartment.id,
      }));

      // Clear department-related errors
      if (errors.department) {
        setErrors((prev) => ({
          ...prev,
          department: "",
        }));
      }
    } catch (error) {
      console.error("Error creating department:", error);
      alert("เกิดข้อผิดพลาดในการสร้างแผนกใหม่");
    }
  };

  const handleCreateProfile = async () => {
    const newErrors: Record<string, string> = {};

    if (!authAccount) {
      newErrors.profile = "กรุณาเข้าสู่ระบบ";
      setErrors(newErrors);
      return;
    }

    // Validate profile form
    if (!formDataProfile.name.trim()) {
      newErrors.profileName = "กรุณากรอกชื่อโปรไฟล์";
      setErrors(newErrors);
      return;
    }

    if (!formDataProfile.username.trim()) {
      newErrors.profileUsername = "กรุณากรอกชื่อผู้ใช้";
      setErrors(newErrors);
      return;
    }

    try {
      const newProfile = await createProfile({
        authId: authAccount.id,
        name: formDataProfile.name,
        username: formDataProfile.username,
        bio: undefined,
        avatarUrl: undefined,
        isActive: true,
      });

      setSelectedProfile(newProfile);
      setShowCreateProfileForm(false);
      setFormData((prev) => ({
        ...prev,
        profileId: newProfile.id,
      }));

      // Clear profile-related errors
      if (errors.profile || errors.profileName || errors.profileUsername) {
        setErrors((prev) => ({
          ...prev,
          profile: "",
          profileName: "",
          profileUsername: "",
        }));
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("เกิดข้อผิดพลาดในการสร้างโปรไฟล์ใหม่");
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleInputChangeProfile = (field: string, value: string | number) => {
    setFormDataProfile((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            เพิ่มพนักงานใหม่
          </h3>

          {/* Profile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              โปรไฟล์ <span className="text-red-500">*</span>
            </label>
            {!showCreateProfileForm ? (
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
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    สร้างโปรไฟล์ใหม่
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowCreateProfileForm(false)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    disabled={loading}
                  >
                    ← เลือกโปรไฟล์ที่มีอยู่แล้ว
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ชื่อโปรไฟล์ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formDataProfile.name}
                      onChange={(e) =>
                        handleInputChangeProfile("name", e.target.value)
                      }
                      placeholder="กรอกชื่อ"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.profileName
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      disabled={loading}
                    />
                    {errors.profileName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.profileName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ชื่อผู้ใช้ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formDataProfile.username}
                      onChange={(e) =>
                        handleInputChangeProfile("username", e.target.value)
                      }
                      placeholder="example@email.com"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.profileUsername
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      disabled={loading}
                    />
                    {errors.profileUsername && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.profileUsername}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateProfileForm(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    disabled={loading}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateProfile}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    สร้างโปรไฟล์
                  </button>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                      value={formData.departmentId}
                      onChange={(e) =>
                        handleInputChange("departmentId", e.target.value)
                      }
                      placeholder="กรอกชื่อแผนก"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.department
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      disabled={loading}
                    />
                    {errors.department && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.department}
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
                onChange={(e) => handleInputChange("position", e.target.value)}
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
                onChange={(e) =>
                  handleInputChange("salary", Number(e.target.value))
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.salary
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="0"
                min="0"
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
                onChange={(e) => handleInputChange("hireDate", e.target.value)}
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
    )
  );
}
