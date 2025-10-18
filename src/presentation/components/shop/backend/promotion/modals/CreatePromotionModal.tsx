"use client";

import {
  PromotionStatus,
  PromotionType,
} from "@/src/application/dtos/shop/backend/promotions-dto";
import type { PromotionConditions } from "@/src/domain/value-objects/promotion/promotion-conditions";
import React, { useMemo, useState } from "react";
import { PromotionConditionsForm } from "./PromotionConditionsForm";

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
  conditions?: PromotionConditions | null;
}

interface CreatePromotionModalProps {
  onClose: () => void;
  onSubmit: (data: CreatePromotionForm) => Promise<boolean>;
  loading?: boolean;
}

export function CreatePromotionModal({
  onClose,
  onSubmit,
  loading,
}: CreatePromotionModalProps) {
  const conditionSupportedTypes = useMemo(
    () => [
      PromotionType.POINTS_MULTIPLIER,
      PromotionType.BONUS_POINTS,
      PromotionType.POINTS_CASHBACK,
    ],
    []
  );

  const isConditionSupported = (type: PromotionType) =>
    conditionSupportedTypes.includes(type);

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
    conditions: null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "type") {
      const nextType = value as PromotionType;
      setForm((prev) => ({
        ...prev,
        type: nextType,
        conditions: isConditionSupported(nextType) ? prev.conditions ?? null : null,
      }));
      return;
    }

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

  const handleConditionsChange = (conditions: PromotionConditions | null) => {
    setForm((prev) => ({
      ...prev,
      conditions,
    }));
  };

  const promotionTypeOptions: { value: PromotionType; label: string }[] = [
    { value: PromotionType.PERCENTAGE, label: "ส่วนลด %" },
    { value: PromotionType.FIXED_AMOUNT, label: "ส่วนลดคงที่" },
    { value: PromotionType.BUY_X_GET_Y, label: "ซื้อ X แถม Y" },
    { value: PromotionType.FREE_ITEM, label: "ของแถม" },
    { value: PromotionType.POINTS_MULTIPLIER, label: "ตัวคูณคะแนน" },
    { value: PromotionType.BONUS_POINTS, label: "โบนัสคะแนน" },
    { value: PromotionType.POINTS_CASHBACK, label: "คืนคะแนน/เงิน" },
  ];

  const showConditionsSection = isConditionSupported(form.type);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
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
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  ประเภทโปรโมชั่น
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {promotionTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="rounded-md bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 px-3 py-2 text-xs text-blue-700 dark:text-blue-200">
                {form.type === PromotionType.POINTS_MULTIPLIER && (
                  <p>
                    ตัวคูณคะแนน: ใช้ค่านี้กำหนดตัวคูณคะแนน (เช่น 2 = คะแนนเพิ่ม 2 เท่าเมื่อเข้าเงื่อนไข)
                  </p>
                )}
                {form.type === PromotionType.BONUS_POINTS && (
                  <p>
                    โบนัสคะแนน: ใส่จำนวนคะแนนพิเศษที่ต้องการมอบให้ลูกค้าเมื่อเข้าเงื่อนไข
                  </p>
                )}
                {form.type === PromotionType.POINTS_CASHBACK && (
                  <p>
                    คืนคะแนน/เงิน: ใส่จำนวนคะแนนหรือเปอร์เซ็นต์ที่ต้องการคืนให้ลูกค้าเมื่อเข้าเงื่อนไข
                  </p>
                )}
                {![
                  PromotionType.POINTS_MULTIPLIER,
                  PromotionType.BONUS_POINTS,
                  PromotionType.POINTS_CASHBACK,
                ].includes(form.type) && (
                  <p>
                    เลือกประเภทโปรโมชั่นเพื่อกำหนดรูปแบบส่วนลดหรือสิทธิพิเศษที่ต้องการให้ลูกค้า
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                ค่าโปรโมชั่น
              </label>
              <input
                type="number"
                name="value"
                value={form.value}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min={0}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                ค่านี้หมายถึงจำนวนเงินหรือเปอร์เซ็นต์ส่วนลด สำหรับโปรโมชั่นคะแนนให้กรอกค่าตัวคูณหรือจำนวนโบนัสที่ต้องการ
              </p>
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

          {showConditionsSection && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
              <div>
                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                  เงื่อนไขการให้คะแนน
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  กำหนดรายละเอียดการสะสมคะแนนและคุณสมบัติของลูกค้าที่จะได้รับโปรโมชั่นนี้ให้ครบถ้วน เพื่อให้ระบบมอบคะแนนได้ถูกต้อง
                </p>
              </div>
              <PromotionConditionsForm
                value={form.conditions ?? null}
                onChange={handleConditionsChange}
              />
            </div>
          )}

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
