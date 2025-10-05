"use client";

import type { RewardDTO } from "@/src/application/dtos/shop/backend/reward-dto";
import { RewardType } from "@/src/domain/entities/backend/backend-reward.entity";
import type { UpdateRewardFormData } from "@/src/presentation/presenters/shop/backend/useRewardsPresenter";
import React from "react";

interface EditRewardModalProps {
  reward: RewardDTO;
  shopId: string;
  onClose: () => void;
  onSubmit: (data: UpdateRewardFormData) => Promise<boolean>;
  loading: boolean;
}

export function EditRewardModal({
  reward,
  shopId,
  onClose,
  onSubmit,
  loading,
}: EditRewardModalProps) {
  type EditForm = Omit<UpdateRewardFormData, "type"> & {
    type: NonNullable<UpdateRewardFormData["type"]>;
  };

  const [form, setForm] = React.useState<EditForm>({
    id: reward.id,
    name: reward.name,
    description: reward.description ?? "",
    type: reward.type,
    pointsRequired: reward.pointsRequired,
    value: reward.value,
    isAvailable: reward.isAvailable,
    expiryDays: reward.expiryDays,
    usageLimit: reward.usageLimit,
    icon: reward.icon ?? "🎁",
    shopId,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  type Fields = EditForm;
  const handleField = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string])
      setErrors((e) => ({ ...e, [key as string]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!(form.name ?? "").trim()) e.name = "กรุณากรอกชื่อรางวัล";
    if ((form.pointsRequired ?? 0) < 0)
      e.pointsRequired = "แต้มต้องมากกว่าหรือเท่ากับ 0";
    // Dynamic validation by type
    if (form.type === "discount") {
      if ((form.value ?? 0) <= 0 || (form.value ?? 0) > 100) {
        e.value = "เปอร์เซ็นต์ส่วนลดต้องอยู่ระหว่าง 1 ถึง 100";
      }
    } else if (form.type === "cashback" || form.type === "free_item") {
      if ((form.value ?? 0) < 0) {
        e.value = "มูลค่าต้องมากกว่าหรือเท่ากับ 0";
      }
    }
    const expiry = form.expiryDays ?? 0;
    if (expiry <= 0) e.expiryDays = "วันหมดอายุต้องมากกว่า 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await onSubmit(form);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            แก้ไขรางวัล
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            disabled={loading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ชื่อรางวัล <span className="text-red-500">*</span>
              </label>
              <input
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                placeholder="เช่น ส่วนลด 10%"
                value={form.name}
                onChange={(e) => handleField("name", e.target.value)}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ประเภทรางวัล
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={form.type}
                onChange={(e) =>
                  handleField("type", e.target.value as EditForm["type"])
                }
                disabled={loading}
              >
                <option value="discount">ส่วนลด</option>
                <option value="free_item">ของฟรี</option>
                <option value="cashback">คืนเงิน</option>
                <option value="special_privilege">สิทธิพิเศษ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                แต้มที่ต้องใช้ <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.pointsRequired
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                placeholder="เช่น 100"
                value={form.pointsRequired}
                onChange={(e) =>
                  handleField("pointsRequired", Number(e.target.value))
                }
                disabled={loading}
                min={0}
              />
              {errors.pointsRequired && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.pointsRequired}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {form.type === "discount" && "เปอร์เซ็นต์ส่วนลด (%)"}
                {form.type === "cashback" && "จำนวนเงินคืน (฿)"}
                {form.type === "free_item" && "มูลค่าสินค้าฟรีโดยประมาณ (฿)"}
                {form.type === "special_privilege" && "มูลค่า (ถ้ามี)"}
                {form.type !== "special_privilege" && (
                  <span className="text-red-500"> *</span>
                )}
              </label>
              <input
                type="number"
                step={form.type === "discount" ? 1 : 0.01}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.value
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                placeholder={
                  form.type === "discount"
                    ? "เช่น 10 (เป็นเปอร์เซ็นต์)"
                    : form.type === "cashback"
                    ? "เช่น 50 (เป็นจำนวนเงิน)"
                    : form.type === "free_item"
                    ? "เช่น 100 (เป็นจำนวนเงินโดยประมาณ)"
                    : "เว้นว่างได้"
                }
                value={form.value}
                onChange={(e) => handleField("value", Number(e.target.value))}
                disabled={loading}
                min={form.type === RewardType.DISCOUNT ? 1 : 0}
                max={form.type === RewardType.DISCOUNT ? 100 : undefined}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {form.type === RewardType.DISCOUNT &&
                  "ระบุเปอร์เซ็นต์ส่วนลด 1-100%"}
                {form.type === RewardType.CASHBACK &&
                  "ระบุจำนวนเงินที่จะคืนให้ลูกค้า (บาท)"}
                {form.type === "free_item" &&
                  "ระบุมูลค่าโดยประมาณของของฟรี (บาท)"}
                {form.type === "special_privilege" &&
                  "ไม่จำเป็นต้องระบุมูลค่า หากไม่มี"}
              </p>
              {errors.value && (
                <p className="text-sm text-red-500 mt-1">{errors.value}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                วันหมดอายุ (วัน) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.expiryDays
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                placeholder="เช่น 30"
                value={form.expiryDays}
                onChange={(e) =>
                  handleField("expiryDays", Number(e.target.value))
                }
                disabled={loading}
                min={0}
              />
              {errors.expiryDays && (
                <p className="text-sm text-red-500 mt-1">{errors.expiryDays}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                จำนวนครั้งที่ใช้ได้ (ไม่บังคับ)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="เว้นว่างได้"
                value={form.usageLimit ?? ""}
                onChange={(e) =>
                  handleField(
                    "usageLimit",
                    e.target.value === "" ? undefined : Number(e.target.value)
                  )
                }
                disabled={loading}
                min={0}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ใส่ 0 เพื่อกำหนดว่าไม่จำกัดจำนวนครั้งที่ใช้ได้
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                ไอคอน (emoji)
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="เช่น 🎁"
                value={form.icon}
                onChange={(e) => handleField("icon", e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                สถานะการใช้งาน
              </label>
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.isAvailable}
                  onChange={(e) => handleField("isAvailable", e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  disabled={loading}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  เปิดใช้งานรางวัลนี้
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              คำอธิบาย (ไม่บังคับ)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="รายละเอียดเพิ่มเติมของรางวัล..."
              rows={3}
              value={form.description}
              onChange={(e) => handleField("description", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              disabled={loading}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
              disabled={loading}
            >
              {loading && (
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              <span>บันทึกรางวัล</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
