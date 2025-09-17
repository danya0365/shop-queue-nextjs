"use client";

import type { CustomerDTO } from "@/src/application/dtos/shop/backend/customers-dto";
import { MembershipTier } from "@/src/domain/entities/shop/backend/backend-customer.entity";
import { useEffect, useState } from "react";

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerData: Partial<CustomerDTO>) => Promise<void>;
  customer: CustomerDTO | null;
  loading?: boolean;
}

export function EditCustomerModal({
  isOpen,
  onClose,
  onSubmit,
  customer,
  loading = false,
}: EditCustomerModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    membershipTier: MembershipTier;
    isActive: boolean;
  }>({
    name: "",
    email: "",
    phone: "",
    membershipTier: MembershipTier.REGULAR,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email || "",
        phone: customer.phone || "",
        membershipTier: customer.membershipTier,
        isActive: customer.isActive,
      });
      setErrors({});
    }
  }, [customer]);

  if (!isOpen || !customer) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "กรุณากรอกชื่อลูกค้า";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit({
        ...formData,
      });
      onClose();
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          แก้ไขข้อมูลลูกค้า
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ชื่อลูกค้า <span className="text-red-500">*</span>
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
              placeholder="กรอกชื่อลูกค้า"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
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

          {/* Membership Tier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ระดับสมาชิก
            </label>
            <select
              value={formData.membershipTier}
              onChange={(e) =>
                handleInputChange("membershipTier", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="regular">Regular</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
            </select>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange("isActive", e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="isActive"
              className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              ลูกค้าที่ยังใช้งานอยู่
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
