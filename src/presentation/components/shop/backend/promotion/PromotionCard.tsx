"use client";

import type { PromotionData } from "@/src/presentation/presenters/shop/backend/PromotionsPresenter";
import React from "react";

interface PromotionCardProps {
  promotion: PromotionData;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onView: () => void;
}

const PROMOTION_TYPE_CONFIG: Record<
  string,
  { label: string; badgeClass: string }
> = {
  percentage: {
    label: "ส่วนลด %",
    badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  fixed_amount: {
    label: "ส่วนลดคงที่",
    badgeClass: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  buy_x_get_y: {
    label: "ซื้อ X แถม Y",
    badgeClass:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  free_item: {
    label: "ของแถม",
    badgeClass:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  points_multiplier: {
    label: "ตัวคูณคะแนน",
    badgeClass:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  },
  bonus_points: {
    label: "โบนัสคะแนน",
    badgeClass:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  },
  points_cashback: {
    label: "คืนคะแนน/เงิน",
    badgeClass:
      "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  },
};

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  active: {
    label: "ใช้งาน",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  inactive: {
    label: "ไม่ใช้งาน",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  },
  expired: {
    label: "หมดอายุ",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  scheduled: {
    label: "กำหนดการ",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
};

const getStatusBadge = (status: string | null) => {
  const fallback = STATUS_CONFIG.inactive;
  const config =
    (status && STATUS_CONFIG[status]) !== undefined
      ? STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
      : fallback;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};

const formatValue = (type: string, value: number) => {
  if (type === "percentage") {
    return `${value}%`;
  }
  if (type === "fixed_amount") {
    return `฿${value.toLocaleString()}`;
  }
  if (type === "points_multiplier") {
    return `x${value}`;
  }
  if (type === "bonus_points") {
    return `+${value.toLocaleString()} คะแนน`;
  }
  if (type === "points_cashback") {
    return `${value}% คืน`;
  }
  return value.toString();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export function PromotionCard({
  promotion,
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
}: PromotionCardProps) {
  const conditionTags = [
    promotion.conditions?.points_config ? "การคำนวณคะแนน" : null,
    promotion.conditions?.eligibility ? "คุณสมบัติผู้ได้รับ" : null,
    promotion.conditions?.special_conditions ? "โบนัสพิเศษ" : null,
  ].filter(Boolean) as string[];

  const hasMinPurchase =
    promotion.minPurchaseAmount !== null &&
    promotion.minPurchaseAmount !== undefined;
  const hasMaxDiscount =
    promotion.maxDiscountAmount !== null &&
    promotion.maxDiscountAmount !== undefined;
  const hasUsageLimit =
    promotion.usageLimit !== null && promotion.usageLimit !== undefined;

  const typeConfig =
    PROMOTION_TYPE_CONFIG[promotion.type] ?? {
      label: promotion.type,
      badgeClass:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      role="button"
      tabIndex={0}
      onClick={onView}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onView();
        }
      }}
    >
      {/* Promotion Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="text-3xl mr-3">🏷️</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {promotion.name}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig.badgeClass}`}
            >
              {typeConfig.label}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onEdit();
            }}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Promotion Description */}
      {promotion.description && (
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          {promotion.description}
        </p>
      )}

      {/* Promotion Details */}
      <div className="space-y-4">
        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
              ค่าโปรโมชั่น
            </p>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-200">
              {formatValue(promotion.type, promotion.value)}
            </p>
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-300">
            {typeConfig.label}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {hasMinPurchase && (
            <div className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 px-3 py-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ยอดซื้อขั้นต่ำ
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                ฿{promotion.minPurchaseAmount!.toLocaleString()}
              </p>
            </div>
          )}

          {hasMaxDiscount && (
            <div className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 px-3 py-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ส่วนลดสูงสุด
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                ฿{promotion.maxDiscountAmount!.toLocaleString()}
              </p>
            </div>
          )}

          <div className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 px-3 py-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ระยะเวลาโปรโมชั่น
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatDate(promotion.startAt)} - {formatDate(promotion.endAt)}
            </p>
          </div>

          {hasUsageLimit && (
            <div className="rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 px-3 py-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                จำกัดการใช้ต่อโปรโมชั่น
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {promotion.usageLimit} ครั้ง
              </p>
            </div>
          )}
        </div>

        {conditionTags.length > 0 && (
          <div className="rounded-lg border border-amber-200 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-3">
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-200 mb-2">
              เงื่อนไขสะสมคะแนนที่เปิดใช้งาน
            </p>
            <div className="flex flex-wrap gap-2">
              {conditionTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-white/90 dark:bg-amber-900/60 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-200 border border-amber-200 dark:border-amber-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          {getStatusBadge(promotion.status)}
          <button
            onClick={(event) => {
              event.stopPropagation();
              onToggleStatus();
            }}
            className={`text-sm font-medium ${
              promotion.status === "active"
                ? "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                : "text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            }`}
          >
            {promotion.status === "active" ? "ปิดใช้งาน" : "เปิดใช้งาน"}
          </button>
        </div>
      </div>
    </div>
  );
}
