"use client";

import {
  PromotionStatus,
  PromotionType,
} from "@/src/application/dtos/shop/backend/promotions-dto";
import React, { useState } from "react";

export interface CreatePromotionForm {
  name: string;
  description?: string;
  type: PromotionType;
  value: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  startAt: string;
  endAt: string;
  status?: PromotionStatus;
  conditions?: Record<string, string>[];
}

interface CreatePromotionModalProps {
  shopId: string;
  onClose: () => void;
  onSubmit: (data: CreatePromotionForm) => Promise<boolean>;
  loading?: boolean;
}

export function CreatePromotionModal({
  shopId,
  onClose,
  onSubmit,
  loading,
}: CreatePromotionModalProps) {
  const [form, setForm] = useState<CreatePromotionForm>({
    name: "",
    description: "",
    type: PromotionType.PERCENTAGE,
    value: 10,
    minPurchaseAmount: undefined,
    maxDiscountAmount: undefined,
    usageLimit: undefined,
    startAt: new Date().toISOString().slice(0, 16),
    endAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    status: PromotionStatus.ACTIVE,
    conditions: [],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "value" || name.includes("Amount") || name === "usageLimit"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          สร้างโปรโมชั่น
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                ชื่อโปรโมชั่น
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                ประเภท
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={PromotionType.PERCENTAGE}>ส่วนลด %</option>
                <option value={PromotionType.FIXED_AMOUNT}>ส่วนลดคงที่</option>
                <option value={PromotionType.BUY_X_GET_Y}>ซื้อ X แถม Y</option>
                <option value={PromotionType.FREE_ITEM}>ของแถม</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                ค่าส่วนลด
              </label>
              <input
                type="number"
                name="value"
                value={form.value}
                onChange={handleChange}
                min={0}
                step={1}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                สถานะ
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={PromotionStatus.ACTIVE}>ใช้งาน</option>
                <option value={PromotionStatus.INACTIVE}>ไม่ใช้งาน</option>
                <option value={PromotionStatus.SCHEDULED}>กำหนดการ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                ยอดซื้อขั้นต่ำ (บาท)
              </label>
              <input
                type="number"
                name="minPurchaseAmount"
                value={form.minPurchaseAmount ?? ""}
                onChange={handleChange}
                min={0}
                step={1}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                ส่วนลดสูงสุด (บาท)
              </label>
              <input
                type="number"
                name="maxDiscountAmount"
                value={form.maxDiscountAmount ?? ""}
                onChange={handleChange}
                min={0}
                step={1}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                จำกัดการใช้ (ครั้ง)
              </label>
              <input
                type="number"
                name="usageLimit"
                value={form.usageLimit ?? ""}
                onChange={handleChange}
                min={0}
                step={1}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                เริ่มต้น
              </label>
              <input
                type="datetime-local"
                name="startAt"
                value={form.startAt}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                สิ้นสุด
              </label>
              <input
                type="datetime-local"
                name="endAt"
                value={form.endAt}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              คำอธิบาย
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              disabled={loading}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
