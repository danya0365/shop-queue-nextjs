"use client";

import type { PromotionData } from "@/src/presentation/presenters/shop/backend/PromotionsPresenter";
import type {
  PromotionEligibility,
  PromotionPointsConfig,
  PromotionSpecialConditions,
} from "@/src/domain/value-objects/promotion/promotion-conditions";
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

const awardTimingLabel: Record<string, string> = {
  on_completion: "เมื่อปิดคิว",
  on_payment: "หลังชำระเงิน",
};

const baseCalculationLabel: Record<string, string> = {
  purchase_amount: "ตามยอดใช้จ่าย",
  service_count: "ตามจำนวนบริการ",
};

const thaiDays: Record<string, string> = {
  monday: "วันจันทร์",
  tuesday: "วันอังคาร",
  wednesday: "วันพุธ",
  thursday: "วันพฤหัสบดี",
  friday: "วันศุกร์",
  saturday: "วันเสาร์",
  sunday: "วันอาทิตย์",
};

const renderChipList = (items: string[]) => (
  <div className="flex flex-wrap gap-2">
    {items.map((item) => (
      <span
        key={item}
        className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
      >
        {item}
      </span>
    ))}
  </div>
);

const renderPointsConfig = (config?: PromotionPointsConfig | null) => {
  if (!config || Object.values(config).every((value) => value === null || value === undefined)) {
    return (
      <span className="text-xs text-gray-400">
        ยังไม่ได้กำหนดการคำนวณคะแนนเพิ่มเติม
      </span>
    );
  }

  const rows: Array<{ label: string; value: string }> = [];

  if (config.award_timing) {
    rows.push({
      label: "วิธีให้คะแนน",
      value: awardTimingLabel[config.award_timing] ?? config.award_timing,
    });
  }

  if (config.base_calculation) {
    rows.push({
      label: "วิธีคำนวณ",
      value: baseCalculationLabel[config.base_calculation] ?? config.base_calculation,
    });
  }

  if (config.max_points_per_transaction !== undefined && config.max_points_per_transaction !== null) {
    rows.push({
      label: "คะแนนสูงสุดต่อรายการ",
      value: `${config.max_points_per_transaction.toLocaleString()} แต้ม`,
    });
  }

  if (config.max_points_per_day !== undefined && config.max_points_per_day !== null) {
    rows.push({
      label: "คะแนนสูงสุดต่อวัน",
      value: `${config.max_points_per_day.toLocaleString()} แต้ม`,
    });
  }

  if (config.max_points_per_customer !== undefined && config.max_points_per_customer !== null) {
    rows.push({
      label: "คะแนนสูงสุดต่อสมาชิก",
      value: `${config.max_points_per_customer.toLocaleString()} แต้ม`,
    });
  }

  if (config.point_expiry_days !== undefined && config.point_expiry_days !== null) {
    rows.push({
      label: "วันหมดอายุของคะแนน",
      value: `${config.point_expiry_days} วัน`,
    });
  }

  if (rows.length === 0) {
    return (
      <span className="text-xs text-gray-400">
        ยังไม่ได้กำหนดรายละเอียดระบบสะสมคะแนน
      </span>
    );
  }

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-900/60">
          <span className="font-medium text-gray-600 dark:text-gray-300">{row.label}</span>
          <span className="text-gray-800 dark:text-gray-100">{row.value}</span>
        </div>
      ))}
    </div>
  );
};

const renderEligibility = (eligibility?: PromotionEligibility | null) => {
  if (!eligibility || Object.values(eligibility).every((value) => value === null || value === undefined)) {
    return (
      <span className="text-xs text-gray-400">ยังไม่ได้กำหนดเงื่อนไขการเข้าร่วม</span>
    );
  }

  const blocks: React.ReactNode[] = [];

  if (eligibility.min_purchase_amount !== undefined && eligibility.min_purchase_amount !== null) {
    blocks.push(
      <div key="min_purchase" className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-900/60">
        <p className="font-medium text-gray-600 dark:text-gray-300">ยอดขั้นต่ำที่ต้องใช้</p>
        <p className="text-gray-900 dark:text-gray-100">{`฿${eligibility.min_purchase_amount.toLocaleString()}`}</p>
      </div>,
    );
  }

  if (eligibility.min_services !== undefined && eligibility.min_services !== null) {
    blocks.push(
      <div key="min_services" className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-900/60">
        <p className="font-medium text-gray-600 dark:text-gray-300">จำนวนบริการขั้นต่ำ</p>
        <p className="text-gray-900 dark:text-gray-100">{`${eligibility.min_services} รายการ`}</p>
      </div>,
    );
  }

  if (eligibility.specific_services && eligibility.specific_services.length) {
    blocks.push(
      <div key="specific_services" className="space-y-1 text-xs">
        <p className="font-medium text-gray-600 dark:text-gray-300">บริการที่ร่วมรายการ</p>
        {renderChipList(eligibility.specific_services)}
      </div>,
    );
  }

  if (eligibility.customer_tiers && eligibility.customer_tiers.length) {
    blocks.push(
      <div key="customer_tiers" className="space-y-1 text-xs">
        <p className="font-medium text-gray-600 dark:text-gray-300">ระดับสมาชิกที่ร่วมรายการ</p>
        {renderChipList(eligibility.customer_tiers.map((tier) => tier.charAt(0).toUpperCase() + tier.slice(1))) }
      </div>,
    );
  }

  if (eligibility.days_of_week && eligibility.days_of_week.length) {
    blocks.push(
      <div key="days_of_week" className="space-y-1 text-xs">
        <p className="font-medium text-gray-600 dark:text-gray-300">วันที่ร่วมรายการ</p>
        {renderChipList(eligibility.days_of_week.map((day) => thaiDays[day.toLowerCase()] ?? day))}
      </div>,
    );
  }

  if (eligibility.time_range && eligibility.time_range.start && eligibility.time_range.end) {
    blocks.push(
      <div key="time_range" className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-900/60">
        <p className="font-medium text-gray-600 dark:text-gray-300">ช่วงเวลา</p>
        <p className="text-gray-900 dark:text-gray-100">{`${eligibility.time_range.start} - ${eligibility.time_range.end}`}</p>
      </div>,
    );
  }

  if (eligibility.first_time_only) {
    blocks.push(
      <div key="first_time" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
        ใช้ได้สำหรับลูกค้าที่ใช้บริการครั้งแรกเท่านั้น
      </div>,
    );
  }

  if (eligibility.min_visits_in_period && eligibility.min_visits_in_period.visits && eligibility.min_visits_in_period.days) {
    blocks.push(
      <div key="min_visits" className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-900/60">
        <p className="font-medium text-gray-600 dark:text-gray-300">ลูกค้าประจำ</p>
        <p className="text-gray-900 dark:text-gray-100">
          {`ต้องมาใช้บริการอย่างน้อย ${eligibility.min_visits_in_period.visits} ครั้งภายใน ${eligibility.min_visits_in_period.days} วัน`}
        </p>
      </div>,
    );
  }

  if (blocks.length === 0) {
    return (
      <span className="text-xs text-gray-400">ยังไม่ได้กำหนดเงื่อนไขการเข้าร่วมเพิ่มเติม</span>
    );
  }

  return <div className="space-y-3">{blocks}</div>;
};

const renderSpecialConditions = (special?: PromotionSpecialConditions | null) => {
  if (!special || Object.values(special).every((value) => value === null || value === undefined)) {
    return (
      <span className="text-xs text-gray-400">ยังไม่ได้กำหนดเงื่อนไขพิเศษ</span>
    );
  }

  const blocks: React.ReactNode[] = [];

  if (special.birthday_bonus) {
    blocks.push(
      <div key="birthday" className="rounded-lg border border-pink-200 bg-pink-50 px-3 py-2 text-xs text-pink-700 dark:border-pink-700 dark:bg-pink-900/30 dark:text-pink-200">
        มอบคะแนนโบนัสในเดือนเกิดของลูกค้า
      </div>,
    );
  }

  if (special.consecutive_visits) {
    blocks.push(
      <div key="consecutive" className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-900/60">
        <p className="font-medium text-gray-600 dark:text-gray-300">โบนัสจากการมาอย่างต่อเนื่อง</p>
        <p className="text-gray-900 dark:text-gray-100">
          {`ต้องมาอย่างน้อย ${special.consecutive_visits.required} ครั้งติดต่อกัน ได้โบนัส x${special.consecutive_visits.bonus_multiplier}`}
        </p>
      </div>,
    );
  }

  if (special.referral_bonus) {
    blocks.push(
      <div key="referral" className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-xs dark:border-gray-700 dark:bg-gray-900/60">
        <p className="font-medium text-gray-600 dark:text-gray-300">โบนัสการแนะนำเพื่อน</p>
        <p className="text-gray-900 dark:text-gray-100">
          {`ผู้แนะนำได้รับ ${special.referral_bonus.referrer_points.toLocaleString()} แต้ม ผู้ถูกแนะนำได้รับ ${special.referral_bonus.referee_points.toLocaleString()} แต้ม`}
        </p>
      </div>,
    );
  }

  if (blocks.length === 0) {
    return (
      <span className="text-xs text-gray-400">ยังไม่ได้กำหนดเงื่อนไขพิเศษเพิ่มเติม</span>
    );
  }

  return <div className="space-y-3">{blocks}</div>;
};

export function PromotionDetailModal({
  promotion,
  onClose,
}: PromotionDetailModalProps) {
  const conditionSections: Array<{
    title: string;
    description: string;
    render: () => React.ReactNode;
  }> = [
    {
      title: "ระบบสะสมคะแนน",
      description: "กำหนดวิธีการคำนวณคะแนนสะสมและการจำกัดต่าง ๆ",
      render: () => renderPointsConfig(promotion.conditions?.points_config ?? null),
    },
    {
      title: "เงื่อนไขการเข้าร่วม",
      description: "กลุ่มลูกค้าที่จะได้รับโปรโมชั่นนี้",
      render: () => renderEligibility(promotion.conditions?.eligibility ?? null),
    },
    {
      title: "เงื่อนไขพิเศษ",
      description: "โบนัสหรือกฎพิเศษเพิ่มเติม เช่น วันเกิด หรือการเชิญเพื่อน",
      render: () => renderSpecialConditions(promotion.conditions?.special_conditions ?? null),
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
                      {section.render()}
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
