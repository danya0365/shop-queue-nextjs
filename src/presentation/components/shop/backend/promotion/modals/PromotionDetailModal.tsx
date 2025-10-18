"use client";

import type { PromotionData } from "@/src/presentation/presenters/shop/backend/PromotionsPresenter";
import React from "react";

interface PromotionDetailModalProps {
  promotion: PromotionData;
  onClose: () => void;
}

const formatDateTime = (isoString: string) => {
  return new Date(isoString).toLocaleString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (value?: number | null) => {
  if (value === null || value === undefined) {
    return "-";
  }
  return `฿${value.toLocaleString()}`;
};

const formatValue = (type: string, value: number) => {
  switch (type) {
    case "percentage":
      return `${value}%`;
    case "fixed_amount":
      return `฿${value.toLocaleString()}`;
    case "points_multiplier":
      return `x${value}`;
    case "bonus_points":
      return `+${value.toLocaleString()} คะแนน`;
    case "points_cashback":
      return `${value}% คืน`;
    default:
      return value.toString();
  }
};

const typeLabelMap: Record<string, string> = {
  percentage: "ส่วนลด %",
  fixed_amount: "ส่วนลดคงที่",
  buy_x_get_y: "ซื้อ X แถม Y",
  free_item: "ของแถม",
  points_multiplier: "ตัวคูณคะแนน",
  bonus_points: "โบนัสคะแนน",
  points_cashback: "คืนคะแนน/เงิน",
};

export function PromotionDetailModal({
  promotion,
  onClose,
}: PromotionDetailModalProps) {
  const conditionSections: Array<{
    title: string;
    description: string;
    content: unknown;
  }> = [
    {
      title: "ระบบสะสมคะแนน",
      description: "กำหนดวิธีการคำนวณคะแนนสะสมและการจำกัดต่าง ๆ",
      content: promotion.conditions?.points_config,
    },
    {
      title: "เงื่อนไขการเข้าร่วม",
      description: "กลุ่มลูกค้าที่จะได้รับโปรโมชั่นนี้",
      content: promotion.conditions?.eligibility,
    },
    {
      title: "เงื่อนไขพิเศษ",
      description: "โบนัสหรือกฎพิเศษเพิ่มเติม เช่น วันเกิด หรือการเชิญเพื่อน",
      content: promotion.conditions?.special_conditions,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              รายละเอียดโปรโมชั่น: {promotion.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ประเภท {typeLabelMap[promotion.type] ?? promotion.type}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="ปิดหน้าต่างรายละเอียด"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-6 py-5 space-y-6">
          {promotion.description && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900/60 dark:bg-blue-900/20 dark:text-blue-200">
              {promotion.description}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 px-4 py-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">ค่าสิทธิ์/ส่วนลด</p>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-300">
                {formatValue(promotion.type, promotion.value)}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 px-4 py-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">สถานะปัจจุบัน</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {promotion.status === "active"
                  ? "ใช้งาน"
                  : promotion.status === "inactive"
                  ? "ไม่ใช้งาน"
                  : promotion.status === "scheduled"
                  ? "กำหนดการ"
                  : promotion.status === "expired"
                  ? "หมดอายุ"
                  : "-"}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 px-4 py-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">เริ่มใช้งาน</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDateTime(promotion.startAt)}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 px-4 py-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">สิ้นสุด</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDateTime(promotion.endAt)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 px-4 py-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">ยอดซื้อขั้นต่ำ</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(promotion.minPurchaseAmount)}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 px-4 py-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">ส่วนลดสูงสุด</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatCurrency(promotion.maxDiscountAmount)}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 px-4 py-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">จำกัดจำนวนครั้ง</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {promotion.usageLimit ? `${promotion.usageLimit} ครั้ง` : "ไม่จำกัด"}
              </p>
            </div>
          </div>

          {promotion.conditions && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                เงื่อนไขโปรโมชั่น
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {conditionSections.map((section) => (
                  <div
                    key={section.title}
                    className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 px-4 py-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {section.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                      {section.content ? (
                        typeof section.content === "object" ? (
                          <pre className="whitespace-pre-wrap rounded bg-gray-50 dark:bg-gray-900/60 px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
                            {JSON.stringify(section.content, null, 2)}
                          </pre>
                        ) : (
                          <span>{String(section.content)}</span>
                        )
                      ) : (
                        <span className="text-xs text-gray-400">
                          ไม่ได้กำหนดเงื่อนไขในส่วนนี้
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
