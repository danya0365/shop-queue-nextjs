"use client";

import type {
  EmployeeStatus,
  UpdateEmployeeParams,
} from "@/src/application/dtos/shop/backend/employees-dto";
import { EmployeePermission } from "@/src/domain/entities/shop/backend/backend-employee.entity";
import { DepartmentSelectionDropdown } from "@/src/presentation/components/shop/backend/dropdown/DepartmentSelectionDropdown";
import { PermissionSelection } from "@/src/presentation/components/shop/backend/employee/PermissionSelection";
import {
  useDepartments,
  type Department,
} from "@/src/presentation/hooks/shop/backend/useDepartments";
import type { Employee } from "@/src/presentation/presenters/shop/backend/EmployeesPresenter";
import { useEffect, useState } from "react";

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSubmit: (employeeData: UpdateEmployeeParams) => Promise<void>;
  loading?: boolean;
  shopId?: string;
}

export function EditEmployeeModal({
  isOpen,
  onClose,
  employee,
  onSubmit,
  loading = false,
  shopId,
}: EditEmployeeModalProps) {
  const [formData, setFormData] = useState({
    employeeCode: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    salary: 0,
    status: "active" as "active" | "inactive" | "on_leave" | "suspended",
    hireDate: "",
    permissions: [] as EmployeePermission[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [showCreateDepartmentForm, setShowCreateDepartmentForm] =
    useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newDepartmentSlug, setNewDepartmentSlug] = useState("");

  const { createDepartment } = useDepartments(shopId);

  useEffect(() => {
    if (employee) {
      setFormData({
        employeeCode: employee.employeeCode,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        position: employee.position,
        salary: employee.salary,
        status: employee.status,
        hireDate: employee.hireDate,
        permissions: employee.permissions || [],
      });

      // Set selected department if department exists
      if (employee.department) {
        setSelectedDepartment({
          id: "", // We don't have the ID, just use the name
          name: employee.department,
          description: undefined,
          employeeCount: 0,
          isActive: true,
          shopId: shopId || "",
        });
      }

      setErrors({});
    }
  }, [employee, shopId]);

  if (!employee) return null;

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

    if (!formData.department.trim() && !showCreateDepartmentForm) {
      newErrors.department = "กรุณาเลือกแผนกหรือสร้างแผนกใหม่";
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

    if (!validateForm()) return;

    if (!employee) return;

    try {
      // Prepare update data - convert department name to departmentId if needed
      const updateData: UpdateEmployeeParams = {
        id: employee.id,
        employeeCode: formData.employeeCode,
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        departmentId: selectedDepartment?.id || undefined,
        position: formData.position,
        shopId: shopId,
        status: formData.status as EmployeeStatus,
        hireDate: formData.hireDate,
        permissions: formData.permissions,
        salary: formData.salary || undefined,
      };

      console.log("Updating employee with permissions:", updateData);

      await onSubmit(updateData);
      onClose();
    } catch (error) {
      console.error("Error updating employee:", error);
      // You might want to show an error message to the user here
      alert("เกิดข้อผิดพลาดในการอัพเดตข้อมูลพนักงาน");
    }
  };

  const handleDepartmentSelect = (department: Department) => {
    setSelectedDepartment(department);
    setFormData((prev) => ({
      ...prev,
      department: department.name,
    }));
    // Clear department-related errors
    if (errors.department) {
      setErrors((prev) => ({
        ...prev,
        department: "",
      }));
    }
  };

  const handleCreateNewDepartment = () => {
    setShowCreateDepartmentForm(true);
    setSelectedDepartment(null);
    setNewDepartmentName("");
    setFormData((prev) => ({
      ...prev,
      department: "",
    }));
  };

  const handleCreateDepartment = async () => {
    const newErrors: Record<string, string> = {};

    if (!newDepartmentName.trim()) {
      newErrors.department = "กรุณากรอกชื่อแผนก";
      setErrors(newErrors);
      return;
    }

    try {
      const newDepartment = await createDepartment({
        name: newDepartmentName,
        slug: newDepartmentSlug,
        description: undefined,
        shopId: shopId || "",
      });

      setSelectedDepartment(newDepartment);
      setShowCreateDepartmentForm(false);
      setNewDepartmentName("");
      setFormData((prev) => ({
        ...prev,
        department: newDepartment.name,
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

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePermissionsChange = (permissions: EmployeePermission[]) => {
    setFormData((prev) => ({ ...prev, permissions }));
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            แก้ไขข้อมูลพนักงาน
          </h3>

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
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
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
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                placeholder="กรอกรหัสพนักงาน"
              />
              {errors.employeeCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.employeeCode}
                </p>
              )}
            </div>

            {/* Profile Information */}
            {employee.profile && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
                  ข้อมูลโปรไฟล์ผู้ใช้
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      ชื่อโปรไฟล์
                    </label>
                    <div className="text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                      {employee.profile.fullName || "-"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      ชื่อผู้ใช้
                    </label>
                    <div className="text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                      {employee.profile.username || "-"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      สถานะโปรไฟล์
                    </label>
                    <div className="text-sm">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          employee.profile.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {employee.profile.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      เบอร์โทรโปรไฟล์
                    </label>
                    <div className="text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                      {employee.profile.phone || "-"}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 italic mt-2">
                  ข้อมูลโปรไฟล์จะแสดงเพื่ออ้างอิงเท่านั้น
                  ไม่สามารถแก้ไขได้ในหน้านี้
                </div>
              </div>
            )}

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
                    shopId={shopId || ""}
                    selectedDepartment={selectedDepartment}
                    onDepartmentSelect={handleDepartmentSelect}
                    onCreateNewDepartment={handleCreateNewDepartment}
                    placeholder="เลือกแผนก..."
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
                      value={newDepartmentName}
                      onChange={(e) => setNewDepartmentName(e.target.value)}
                      placeholder="กรอกชื่อแผนก"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.department
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {errors.department && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.department}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newDepartmentSlug}
                      onChange={(e) => setNewDepartmentSlug(e.target.value)}
                      placeholder="กรอกชื่อแผนก"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.department
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
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
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateDepartment}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
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
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
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

            {/* Permissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                สิทธิ์การเข้าถึง
              </label>
              <PermissionSelection
                selectedPermissions={formData.permissions}
                onPermissionChange={handlePermissionsChange}
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
                className={`px-4 py-2 rounded-lg ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}
