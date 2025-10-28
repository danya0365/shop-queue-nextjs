"use client";

import { useEffect, useMemo, useState } from "react";
import type { CustomerPointsViewModel } from "@/src/presentation/presenters/shop/backend/CustomerPointsPresenter";

type CustomerPointsItem = CustomerPointsViewModel["customerPoints"][number];

interface RedeemCustomerPointsModalProps {
  isOpen: boolean;
  customers: CustomerPointsItem[];
  selectedCustomerId: string | null;
  onClose: () => void;
  onSubmit: (input: {
    customerId: string;
    points: number;
    description: string;
    mode: "redeem";
  }) => Promise<boolean>;
  onSelectCustomer: (customerId: string | null) => void;
  isSubmitting: boolean;
  error?: string | null;
  clearError: () => void;
}

interface FormErrors {
  customerId?: string;
  points?: string;
}

export function RedeemCustomerPointsModal({
  isOpen,
  customers,
  selectedCustomerId,
  onClose,
  onSubmit,
  onSelectCustomer,
  isSubmitting,
  error,
  clearError,
}: RedeemCustomerPointsModalProps) {
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

  const maxRedeemablePoints = selectedCustomer?.currentPoints ?? 0;

  const validateForm = () => {
    const errors: FormErrors = {};

    if (!customerId) {
      errors.customerId = "กรุณาเลือกลูกค้า";
    }

    const numericPoints = Number(pointsValue);

    if (!Number.isFinite(numericPoints) || numericPoints <= 0) {
      errors.points = "จำนวนแต้มต้องมากกว่า 0";
    } else if (numericPoints > maxRedeemablePoints) {
      errors.points = "แต้มไม่เพียงพอ";
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
      mode: "redeem" as const,
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
    onSelectCustomer(value || null);
    setFormErrors((prev) => ({ ...prev, customerId: undefined }));
    clearError();
  };

  const handlePointsQuickSelect = (value: number) => {
    setPointsValue(String(value));
    setFormErrors((prev) => ({ ...prev, points: undefined }));
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

  const quickRedeemOptions = [50, 100, 200, 500].filter(
    (option) => option <= maxRedeemablePoints
  );

  const remainingPoints = maxRedeemablePoints - Number(pointsValue || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4 text-white dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold">ใช้แต้มลูกค้า</h3>
            <p className="text-sm text-rose-100">
              ตรวจสอบแต้มที่เหลือก่อนใช้ทุกครั้งเพื่อป้องกันข้อผิดพลาด
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
              เลือกลูกค้า <span className="text-red-500">*</span>
            </label>
            <select
              value={customerId}
              onChange={(event) => handleCustomerChange(event.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white ${
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
            <div className="rounded-lg border border-rose-100 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
              <div className="font-medium">ข้อมูลแต้มปัจจุบัน</div>
              <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                <div>
                  <span className="text-xs text-rose-600 dark:text-rose-300">แต้มปัจจุบัน</span>
                  <p className="text-base font-semibold">
                    {selectedCustomer.currentPoints.toLocaleString("th-TH")} แต้ม
                  </p>
                </div>
                <div>
                  <span className="text-xs text-rose-600 dark:text-rose-300">แต้มที่ใช้แล้ว</span>
                  <p className="text-base font-semibold">
                    {selectedCustomer.totalRedeemed.toLocaleString("th-TH")} แต้ม
                  </p>
                </div>
                <div>
                  <span className="text-xs text-rose-600 dark:text-rose-300">แต้มที่ได้รับทั้งหมด</span>
                  <p className="text-base font-semibold">
                    {selectedCustomer.totalEarned.toLocaleString("th-TH")} แต้ม
                  </p>
                </div>
                {Number(pointsValue) > 0 && (
                  <div>
                    <span className="text-xs text-rose-600 dark:text-rose-300">แต้มคงเหลือหลังการใช้</span>
                    <p className={`text-base font-semibold ${remainingPoints < 0 ? "text-red-600" : ""}`}>
                      {Math.max(remainingPoints, 0).toLocaleString("th-TH")} แต้ม
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                จำนวนแต้มที่ต้องการใช้ <span className="text-red-500">*</span>
              </label>
              {quickRedeemOptions.length > 0 && (
                <div className="flex gap-2">
                  {quickRedeemOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handlePointsQuickSelect(option)}
                      className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-200 dark:hover:bg-rose-900/40"
                    >
                      {option.toLocaleString("th-TH")} แต้ม
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="number"
              min={1}
              step={1}
              value={pointsValue}
              onChange={(event) => handlePointsChange(event.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white ${
                formErrors.points ? "border-red-500 focus:ring-red-500" : "border-gray-300"
              }`}
              placeholder="กรอกจำนวนแต้มที่ต้องการใช้"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="เช่น ใช้แต้มแลกรางวัลลูกค้า"
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
                "bg-red-600 hover:bg-red-700"
              } ${isSubmitting ? "opacity-70" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "กำลังบันทึก..." : "ใช้แต้ม"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
