import { EmployeePermission } from "@/src/domain/entities/shop/backend/backend-employee.entity";
import { EmployeeStatus } from "@/src/application/dtos/shop/backend/employees-dto";
import { useState } from "react";

export interface EmployeeFormData {
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  position: string;
  salary: number;
  status: EmployeeStatus;
  hireDate: string;
  profileId: string;
  permissions: EmployeePermission[];
}

export interface EmployeeFormErrors {
  employeeCode?: string;
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  profile?: string;
  position?: string;
  salary?: string;
  hireDate?: string;
}

export function useEmployeeFormState() {
  const [formData, setFormData] = useState<EmployeeFormData>({
    employeeCode: "",
    name: "",
    email: "",
    phone: "",
    departmentId: "",
    position: "",
    salary: 0,
    status: EmployeeStatus.ACTIVE,
    hireDate: "",
    profileId: "",
    permissions: [],
  });

  const [errors, setErrors] = useState<EmployeeFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: EmployeeFormErrors = {};

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

    if (!formData.departmentId) {
      newErrors.department = "กรุณาเลือกแผนก";
    }

    if (!formData.profileId) {
      newErrors.profile = "กรุณาเลือกโปรไฟล์";
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

    if (!formData.profileId) {
      newErrors.profile = "กรุณาเลือกโปรไฟล์";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (
    field: keyof EmployeeFormData,
    value: string | number | EmployeePermission[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    // Map formData field names to error field names
    const errorField =
      field === "departmentId"
        ? "department"
        : field === "profileId"
        ? "profile"
        : field;
    if (errors[errorField as keyof EmployeeFormErrors]) {
      setErrors((prev) => ({ ...prev, [errorField]: "" }));
    }
  };

  const clearError = (field: keyof EmployeeFormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const resetForm = () => {
    setFormData({
      employeeCode: "",
      name: "",
      email: "",
      phone: "",
      departmentId: "",
      position: "",
      salary: 0,
      status: EmployeeStatus.ACTIVE,
      hireDate: "",
      profileId: "",
      permissions: [],
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
