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

const dateToInputValue = (date: Date) => {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
};

interface PromotionTemplateDefinition {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  data: Partial<CreatePromotionForm> & {
    type: PromotionType;
  };
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

  const defaultStartAt = useMemo(() => dateToInputValue(new Date()), []);
  const defaultEndAt = useMemo(
    () => dateToInputValue(new Date(Date.now() + 86400000)),
    [],
  );

  const defaultFormValues = useMemo<CreatePromotionForm>(
    () => ({
      name: "",
      description: "",
      type: PromotionType.PERCENTAGE,
      value: 10,
      minPurchaseAmount: undefined,
      maxDiscountAmount: undefined,
      usageLimit: undefined,
      startAt: defaultStartAt,
      endAt: defaultEndAt,
      status: PromotionStatus.ACTIVE,
      conditions: null,
    }),
    [defaultStartAt, defaultEndAt],
  );

  const [form, setForm] = useState<CreatePromotionForm>({
    ...defaultFormValues,
  });
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  const promotionTemplates = useMemo<PromotionTemplateDefinition[]>(() => {
    const buildDate = (daysFromNow: number) =>
      dateToInputValue(new Date(Date.now() + daysFromNow * 86400000));

    return [
      {
        id: "weekday-double-points",
        name: "Happy Hour คะแนนคูณ 2",
        description: "กระตุ้นยอดช่วงบ่ายวันทำงานด้วยคะแนนพิเศษ",
        highlights: [
          "คะแนนเพิ่ม x2 เวลา 14:00-18:00 (จันทร์-ศุกร์)",
          "จำกัดสูงสุด 1,000 แต้มต่อรายการ",
        ],
        data: {
          name: "Happy Hour คะแนนคูณ 2",
          description:
            "รับคะแนนคูณสองในช่วงเวลา 14:00-18:00 ทุกวันจันทร์ถึงศุกร์",
          type: PromotionType.POINTS_MULTIPLIER,
          value: 2,
          minPurchaseAmount: 0,
          startAt: defaultStartAt,
          endAt: buildDate(30),
          status: PromotionStatus.ACTIVE,
          conditions: {
            points_config: {
              award_timing: "on_completion",
              base_calculation: "purchase_amount",
              max_points_per_transaction: 1000,
            },
            eligibility: {
              days_of_week: [
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
              ],
              time_range: { start: "14:00", end: "18:00" },
            },
          },
        },
      },
      {
        id: "premium-service-bonus",
        name: "โบนัสบริการพรีเมียม +150 แต้ม",
        description: "มอบคะแนนพิเศษสำหรับบริการมูลค่าสูง",
        highlights: [
          "โบนัส 150 แต้มเมื่อมียอดซื้อขั้นต่ำ 800 บาท",
          "จำกัดสำหรับบริการประเภทพรีเมียม",
        ],
        data: {
          name: "โบนัสบริการพรีเมียม",
          description:
            "รับโบนัส 150 แต้มเมื่อใช้บริการพรีเมียมและมียอดซื้อขั้นต่ำ 800 บาท",
          type: PromotionType.BONUS_POINTS,
          value: 150,
          minPurchaseAmount: 800,
          startAt: defaultStartAt,
          endAt: buildDate(45),
          status: PromotionStatus.ACTIVE,
          conditions: {
            points_config: {
              award_timing: "on_completion",
            },
            eligibility: {
              min_purchase_amount: 800,
              min_services: 1,
            },
          },
        },
      },
      {
        id: "vip-cashback",
        name: "Cashback 10% สำหรับสมาชิก Gold",
        description: "คืนคะแนนตามยอดใช้จ่ายให้ลูกค้า VIP",
        highlights: [
          "คืนคะแนน 10% สำหรับยอดใช้จ่ายตั้งแต่ 1,000 บาท",
          "เฉพาะสมาชิกระดับ Gold ขึ้นไป",
        ],
        data: {
          name: "Cashback สมาชิก Gold",
          description:
            "คืนคะแนน 10% จากยอดใช้จ่ายให้กับสมาชิกระดับ Gold และ Platinum",
          type: PromotionType.POINTS_CASHBACK,
          value: 10,
          minPurchaseAmount: 1000,
          startAt: defaultStartAt,
          endAt: buildDate(60),
          status: PromotionStatus.ACTIVE,
          conditions: {
            points_config: {
              award_timing: "on_completion",
              max_points_per_transaction: 500,
            },
            eligibility: {
              customer_tiers: ["gold", "platinum"],
              min_purchase_amount: 1000,
            },
          },
        },
      },
      {
        id: "one-point-per-baht",
        name: "1 แต้มต่อ 1 บาท",
        description: "สะสมแต้มจากทุกยอดใช้จ่ายแบบเข้าใจง่าย",
        highlights: [
          "คืนคะแนน 100% จากยอดซื้อทุกบริการ",
          "ไม่มีขั้นต่ำและใช้ได้กับลูกค้าทุกคน",
        ],
        data: {
          name: "สะสมแต้ม 1 ต่อ 1",
          description:
            "รับ 1 แต้มต่อยอดใช้จ่าย 1 บาทสำหรับลูกค้าทุกคนแบบไม่จำกัด",
          type: PromotionType.POINTS_CASHBACK,
          value: 100,
          minPurchaseAmount: 0,
          startAt: defaultStartAt,
          endAt: buildDate(90),
          status: PromotionStatus.ACTIVE,
          conditions: {
            points_config: {
              award_timing: "on_completion",
              base_calculation: "purchase_amount",
            },
          },
        },
      },
      {
        id: "launch-percentage",
        name: "เปิดร้านใหม่ ลด 15%",
        description: "ดึงลูกค้าใหม่ด้วยส่วนลดระยะสั้น",
        highlights: [
          "ส่วนลด 15% สำหรับทุกบริการ",
          "ใช้งานได้ 14 วัน พร้อมจำกัด 200 บาทต่อครั้ง",
        ],
        data: {
          name: "โปรโมชั่นเปิดฤดูกาล",
          description:
            "ส่วนลด 15% สำหรับทุกบริการในช่วงเปิดร้าน เพื่อดึงดูดลูกค้าใหม่",
          type: PromotionType.PERCENTAGE,
          value: 15,
          minPurchaseAmount: 0,
          maxDiscountAmount: 200,
          startAt: defaultStartAt,
          endAt: buildDate(14),
          status: PromotionStatus.ACTIVE,
          conditions: null,
        },
      },
    ];
  }, [defaultStartAt]);

  const getPromotionTypeLabel = (type: PromotionType) =>
    promotionTypeOptions.find((option) => option.value === type)?.label ?? type;

  const applyTemplate = (template: PromotionTemplateDefinition) => {
    setForm((prev) => {
      const nextType = template.data.type ?? prev.type;
      const nextConditions =
        template.data.conditions !== undefined
          ? template.data.conditions
          : isConditionSupported(nextType)
          ? prev.conditions
          : null;

      return {
        ...prev,
        ...template.data,
        type: nextType,
        startAt: template.data.startAt ?? prev.startAt,
        endAt: template.data.endAt ?? prev.endAt,
        conditions: nextConditions,
      };
    });
    setActiveTemplateId(template.id);
  };

  const resetForm = () => {
    setForm({
      ...defaultFormValues,
    });
    setActiveTemplateId(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setActiveTemplateId(null);
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
    setActiveTemplateId(null);
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                เทมเพลตยอดนิยม
              </h4>
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                รีเซ็ตเป็นค่าเริ่มต้น
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {promotionTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`rounded-xl border p-4 shadow-sm transition-all ${
                    activeTemplateId === template.id
                      ? "border-blue-500 bg-blue-50/70 dark:border-blue-400 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {template.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {template.description}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                      {getPromotionTypeLabel(template.data.type)}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-300">
                    {template.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2">
                        <span className="mt-0.5 text-blue-500">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className={`mt-4 w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                      activeTemplateId === template.id
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
                    }`}
                  >
                    {activeTemplateId === template.id
                      ? "กำลังใช้งานเทมเพลตนี้"
                      : "ใช้เทมเพลตนี้"}
                  </button>
                </div>
              ))}
            </div>
          </div>

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
