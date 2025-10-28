"use client";

import { useEffect, useMemo, useState } from "react";
import type { CustomerPointsViewModel } from "@/src/presentation/presenters/shop/backend/CustomerPointsPresenter";
import { CustomerPointsMode } from "@/src/presentation/presenters/shop/backend/useCustomerPointsPresenter";

type CustomerPointsItem = CustomerPointsViewModel["customerPoints"][number];

interface AddCustomerPointsModalProps {
  isOpen: boolean;
  mode: CustomerPointsMode;
  customers: CustomerPointsItem[];
  selectedCustomerId: string | null;
  onClose: () => void;
  onSubmit: (input: {
    customerId: string;
    points: number;
    description: string;
    mode: CustomerPointsMode;
  }) => Promise<boolean>;
  onSelectCustomer: (customerId: string) => void;
  onModeChange: (mode: CustomerPointsMode) => void;
  isSubmitting: boolean;
  error?: string | null;
  clearError: () => void;
}

interface FormErrors {
  customerId?: string;
  points?: string;
}

export function AddCustomerPointsModal({
  isOpen,
  mode,
  customers,
  selectedCustomerId,
  onClose,
  onSubmit,
  onSelectCustomer,
  onModeChange,
  isSubmitting,
  error,
  clearError,
}: AddCustomerPointsModalProps) {
  const [customerId, setCustomerId] = useState<string>("");
  const [pointsValue, setPointsValue] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isOpen) {
      setCustomerId(selectedCustomerId ?? "");
      setPointsValue("");
      setDescription("");
      setFormErrors({});
      clearError();
    } else {
      setCustomerId("");
      setPointsValue("");
      setDescription("");
      setFormErrors({});
    }
  }, [isOpen, selectedCustomerId, clearError]);

  const selectedCustomer = useMemo(() => {
    if (!customerId) return null;
    return customers.find((customer) => customer.id === customerId) ?? null;
  }, [customerId, customers]);

  const modeLabel = mode === "add" ? "เพิ่มแต้ม" : "ใช้แต้ม";

  const validateForm = () => {
    const errors: FormErrors = {};

    if (!customerId) {
      errors.customerId = "กรุณาเลือกลูกค้า";
    }

    const numericPoints = Number(pointsValue);
    if (!Number.isFinite(numericPoints) || numericPoints <= 0) {
      errors.points = "จำนวนแต้มต้องมากกว่า 0";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      customerId,
      points: Number(pointsValue),
      description: description.trim(),
      mode,
    };

    const success = await onSubmit(payload);
    if (success) {
      setPointsValue("");
      setDescription("");
      setFormErrors({});
    }
  };

  const handleCustomerChange = (value: string) => {
    setCustomerId(value);
    onSelectCustomer(value);
    setFormErrors((prev) => ({ ...prev, customerId: undefined }));
    clearError();
  };

  const handleModeChange = (newMode: CustomerPointsMode) => {
    onModeChange(newMode);
    setFormErrors({});
    clearError();
  };

  const handlePointsChange = (value: string) => {
    if (Number(value) < 0) {
      setPointsValue(value);
      return;
    }
    setPointsValue(value);
    setFormErrors((prev) => ({ ...prev, points: undefined }));
    clearError();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold">{modeLabel}ลูกค้า</h3>
            <p className="text-sm text-blue-100">
              จัดการแต้มสะสมลูกค้าได้อย่างรวดเร็วและปลอดภัย
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white transition hover:bg-white/30"
          >
            ปิด
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              โหมดการทำรายการ
            </label>
            <div className="flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => handleModeChange("add")}
                className={`flex-1 px-4 py-2 text-sm font-medium transition ${
                  mode === "add"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                เพิ่มแต้ม
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("redeem")}
                className={`flex-1 px-4 py-2 text-sm font-medium transition ${
                  mode === "redeem"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                ใช้แต้ม
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              เลือกลูกค้า <span className="text-red-500">*</span>
            </label>
            <select
              value={customerId}
              onChange={(event) => handleCustomerChange(event.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white ${
                formErrors.customerId
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">เลือกชื่อลูกค้า</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.customerName} ({customer.customerPhone || "ไม่ระบุ"})
                </option>
              ))}
            </select>
            {formErrors.customerId && (
              <p className="mt-1 text-sm text-red-500">{formErrors.customerId}</p>
            )}
          </div>

          {selectedCustomer && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
              <div className="font-medium">ข้อมูลแต้มปัจจุบัน</div>
              <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                <div>
                  <span className="text-xs text-blue-600 dark:text-blue-300">แต้มปัจจุบัน</span>
                  <p className="text-base font-semibold">
                    {selectedCustomer.currentPoints.toLocaleString("th-TH")}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-blue-600 dark:text-blue-300">แต้มรวมที่ได้รับ</span>
                  <p className="text-base font-semibold">
                    {selectedCustomer.totalEarned.toLocaleString("th-TH")}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-blue-600 dark:text-blue-300">แต้มที่ใช้แล้ว</span>
                  <p className="text-base font-semibold">
                    {selectedCustomer.totalRedeemed.toLocaleString("th-TH")}
                  </p>
                </div>
                {selectedCustomer.pointsToNextTier && selectedCustomer.pointsToNextTier > 0 && (
                  <div>
                    <span className="text-xs text-blue-600 dark:text-blue-300">แต้มถึงระดับถัดไป</span>
                    <p className="text-base font-semibold">
                      อีก {selectedCustomer.pointsToNextTier.toLocaleString("th-TH")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              จำนวนแต้ม <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={pointsValue}
              onChange={(event) => handlePointsChange(event.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white ${
                formErrors.points ? "border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
              placeholder="กรอกจำนวนแต้ม"
            />
            {formErrors.points && (
              <p className="mt-1 text-sm text-red-500">{formErrors.points}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              หมายเหตุเพิ่มเติม
            </label>
            <textarea
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                clearError();
              }}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder={mode === "add" ? "เช่น เพิ่มแต้มจากการซื้อสินค้า" : "เช่น ใช้แต้มแลกรางวัล"}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              disabled={isSubmitting}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
                mode === "add"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-red-600 hover:bg-red-700"
              } ${isSubmitting ? "opacity-70" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "กำลังบันทึก..." : modeLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
