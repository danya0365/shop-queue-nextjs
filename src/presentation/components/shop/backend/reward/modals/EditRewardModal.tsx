"use client";

import React from "react";
import type { RewardDTO } from "@/src/application/dtos/shop/backend/reward-dto";
import type { UpdateRewardFormData } from "@/src/presentation/presenters/shop/backend/useRewardsPresenter";

interface EditRewardModalProps {
  reward: RewardDTO;
  shopId: string;
  onClose: () => void;
  onSubmit: (data: UpdateRewardFormData) => Promise<boolean>;
  loading: boolean;
}

export function EditRewardModal({ reward, shopId, onClose, onSubmit, loading }: EditRewardModalProps) {
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

  const handleSubmit = async () => {
    const ok = await onSubmit(form);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">แก้ไขรางวัล</h3>
        <div className="space-y-3">
          <input
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ชื่อรางวัล"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="คำอธิบาย (ไม่บังคับ)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as EditForm["type"] })}
          >
            <option value="discount">ส่วนลด</option>
            <option value="free_item">ของฟรี</option>
            <option value="cashback">คืนเงิน</option>
            <option value="special_privilege">สิทธิพิเศษ</option>
          </select>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="แต้มที่ต้องใช้"
            value={form.pointsRequired}
            onChange={(e) => setForm({ ...form, pointsRequired: Number(e.target.value) })}
          />
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="มูลค่า"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
          />
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-700 dark:text-gray-300">เปิดใช้งาน</label>
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
              className="h-4 w-4"
            />
          </div>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="วันหมดอายุ"
            value={form.expiryDays}
            onChange={(e) => setForm({ ...form, expiryDays: Number(e.target.value) })}
          />
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="จำนวนครั้งที่ใช้ได้ (ไม่บังคับ)"
            value={form.usageLimit ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                usageLimit: e.target.value === "" ? undefined : Number(e.target.value),
              })
            }
          />
          <input
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ไอคอน (emoji)"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
          />
        </div>
        <div className="flex justify-end space-x-3 mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            ยกเลิก
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}
