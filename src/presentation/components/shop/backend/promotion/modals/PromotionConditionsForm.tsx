"use client";

import { useMemo } from "react";
import type {
  PromotionConditions,
  PromotionEligibility,
  PromotionEligibilityMinVisitsInPeriod,
  PromotionEligibilityTimeRange,
  PromotionPointsConfig,
  PromotionSpecialConditions,
  PromotionSpecialConditionsConsecutiveVisits,
  PromotionSpecialConditionsReferralBonus,
} from "@/src/domain/value-objects/promotion/promotion-conditions";

interface PromotionConditionsFormProps {
  value: PromotionConditions | null;
  onChange: (value: PromotionConditions | null) => void;
}

const DAYS_OF_WEEK: { value: string; label: string }[] = [
  { value: "monday", label: "วันจันทร์" },
  { value: "tuesday", label: "วันอังคาร" },
  { value: "wednesday", label: "วันพุธ" },
  { value: "thursday", label: "วันพฤหัสบดี" },
  { value: "friday", label: "วันศุกร์" },
  { value: "saturday", label: "วันเสาร์" },
  { value: "sunday", label: "วันอาทิตย์" },
];

const AWARD_TIMING_OPTIONS = [
  { value: "on_completion", label: "หลังปิดคิว" },
  { value: "on_payment", label: "หลังชำระเงิน" },
] as const;

const BASE_CALCULATION_OPTIONS = [
  { value: "purchase_amount", label: "ตามยอดซื้อ" },
  { value: "service_count", label: "ตามจำนวนบริการ" },
] as const;

export function PromotionConditionsForm({
  value,
  onChange,
}: PromotionConditionsFormProps) {
  const pointsConfig = value?.points_config;
  const eligibility = value?.eligibility;
  const specialConditions = value?.special_conditions;

  const conditionsEnabled = useMemo(
    () => ({
      points: Boolean(pointsConfig),
      eligibility: Boolean(eligibility),
      special: Boolean(specialConditions),
    }),
    [pointsConfig, eligibility, specialConditions]
  );

  const updateConditions = (next: PromotionConditions | null) => {
    if (!next || Object.keys(next).length === 0) {
      onChange(null);
      return;
    }
    onChange(next);
  };

  const withSection = <K extends keyof PromotionConditions>(
    section: K,
    updater: (
      current: PromotionConditions[K]
    ) => PromotionConditions[K]
  ) => {
    const current = value ?? {};
    const updatedSection = updater(current[section]);
    if (updatedSection === undefined || updatedSection === null) {
      const { [section]: removedSection, ...rest } = current;
      void removedSection;
      updateConditions(
        Object.keys(rest).length ? (rest as PromotionConditions) : null
      );
      return;
    }
    updateConditions({
      ...current,
      [section]: updatedSection,
    } as PromotionConditions);
  };

  const toggleSection = (section: keyof PromotionConditions, enabled: boolean) => {
    if (enabled) {
      switch (section) {
        case "points_config":
          withSection(section, () => (pointsConfig ?? {} as PromotionPointsConfig));
          break;
        case "eligibility":
          withSection(section, () => (eligibility ?? {} as PromotionEligibility));
          break;
        case "special_conditions":
          withSection(section, () => (specialConditions ?? {} as PromotionSpecialConditions));
          break;
        default:
          break;
      }
    } else {
      withSection(section, () => undefined as unknown as PromotionConditions[typeof section]);
    }
  };

  const parseInteger = (input: string): number | null => {
    if (input.trim() === "") return null;
    const parsed = Number.parseInt(input, 10);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const parseFloatValue = (input: string): number | null => {
    if (input.trim() === "") return null;
    const parsed = Number.parseFloat(input);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const handleCommaSeparatedChange = (
    section: keyof PromotionEligibility,
    rawValue: string
  ) => {
    const items = rawValue
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const nextValue = items.length ? items : null;
    withSection("eligibility", (current) => ({
      ...(current ?? {}),
      [section]: nextValue,
    }));
  };

  const handleDaysOfWeekChange = (day: string, checked: boolean) => {
    const currentDays = new Set(eligibility?.days_of_week ?? []);
    if (checked) {
      currentDays.add(day);
    } else {
      currentDays.delete(day);
    }
    const nextArray = currentDays.size ? Array.from(currentDays) : null;
    withSection("eligibility", (current) => ({
      ...(current ?? {}),
      days_of_week: nextArray,
    }));
  };

  const handleTimeRangeChange = (
    field: keyof PromotionEligibilityTimeRange,
    valueInput: string
  ) => {
    const timeRange: PromotionEligibilityTimeRange | null =
      valueInput.trim() === "" && !eligibility?.time_range
        ? null
        : {
            ...(eligibility?.time_range ?? { start: "", end: "" }),
            [field]: valueInput,
          };
    const cleaned =
      timeRange && !timeRange.start && !timeRange.end ? null : timeRange;
    withSection("eligibility", (current) => ({
      ...(current ?? {}),
      time_range: cleaned,
    }));
  };

  const handleMinVisitsChange = (
    field: keyof PromotionEligibilityMinVisitsInPeriod,
    valueInput: string
  ) => {
    const visits: PromotionEligibilityMinVisitsInPeriod | null =
      valueInput.trim() === "" && !eligibility?.min_visits_in_period
        ? null
        : {
            ...(eligibility?.min_visits_in_period ?? { visits: 0, days: 0 }),
            [field]: parseInteger(valueInput) ?? 0,
          };
    const cleaned =
      visits && visits.visits === 0 && visits.days === 0 ? null : visits;
    withSection("eligibility", (current) => ({
      ...(current ?? {}),
      min_visits_in_period: cleaned,
    }));
  };

  const handleConsecutiveVisitsChange = (
    field: keyof PromotionSpecialConditionsConsecutiveVisits,
    valueInput: string
  ) => {
    const consecutive: PromotionSpecialConditionsConsecutiveVisits | null =
      valueInput.trim() === "" && !specialConditions?.consecutive_visits
        ? null
        : {
            ...(specialConditions?.consecutive_visits ?? {
              required: 0,
              bonus_multiplier: 1,
            }),
            [field]:
              field === "bonus_multiplier"
                ? parseFloatValue(valueInput) ?? 0
                : parseInteger(valueInput) ?? 0,
          };
    const cleaned =
      consecutive &&
      consecutive.required === 0 &&
      (consecutive.bonus_multiplier === null || consecutive.bonus_multiplier === 0)
        ? null
        : consecutive;
    withSection("special_conditions", (current) => ({
      ...(current ?? {}),
      consecutive_visits: cleaned,
    }));
  };

  const handleReferralBonusChange = (
    field: keyof PromotionSpecialConditionsReferralBonus,
    valueInput: string
  ) => {
    const referral: PromotionSpecialConditionsReferralBonus | null =
      valueInput.trim() === "" && !specialConditions?.referral_bonus
        ? null
        : {
            ...(specialConditions?.referral_bonus ?? {
              referrer_points: 0,
              referee_points: 0,
            }),
            [field]: parseInteger(valueInput) ?? 0,
          };
    const cleaned =
      referral && referral.referrer_points === 0 && referral.referee_points === 0
        ? null
        : referral;
    withSection("special_conditions", (current) => ({
      ...(current ?? {}),
      referral_bonus: cleaned,
    }));
  };

  const handlePointsConfigChange = <K extends keyof PromotionPointsConfig>(
    field: K,
    valueInput: string | number | null
  ) => {
    const nextValue =
      typeof valueInput === "string"
        ? valueInput
        : typeof valueInput === "number"
        ? valueInput
        : null;
    withSection("points_config", (current) => ({
      ...(current ?? {}),
      [field]: valueInput === null ? null : nextValue,
    }));
  };

  const renderToggleRow = (
    id: string,
    label: string,
    description: string,
    enabled: boolean,
    onToggle: (checked: boolean) => void
  ) => (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <label className="inline-flex items-center cursor-pointer">
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={enabled}
          onChange={(event) => onToggle(event.target.checked)}
        />
        <span
          className={`relative inline-block h-6 w-11 rounded-full transition-colors ${
            enabled
              ? "bg-blue-600 dark:bg-blue-500"
              : "bg-gray-200 dark:bg-gray-600"
          }`}
        >
          <span
            className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </span>
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {renderToggleRow(
          "conditions-points-toggle",
          "ระบบสะสมคะแนน",
          "กำหนดการคำนวณและจำกัดคะแนนที่สามารถได้รับ",
          conditionsEnabled.points,
          (checked) => toggleSection("points_config", checked)
        )}

        {conditionsEnabled.points && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                วิธีให้คะแนน
              </label>
              <select
                value={pointsConfig?.award_timing ?? ""}
                onChange={(event) =>
                  handlePointsConfigChange("award_timing", event.target.value || null)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">-- เลือก --</option>
                {AWARD_TIMING_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                วิธีคำนวณ
              </label>
              <select
                value={pointsConfig?.base_calculation ?? ""}
                onChange={(event) =>
                  handlePointsConfigChange("base_calculation", event.target.value || null)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">-- เลือก --</option>
                {BASE_CALCULATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                คะแนนสูงสุดต่อรายการ
              </label>
              <input
                type="number"
                min={0}
                value={pointsConfig?.max_points_per_transaction ?? ""}
                onChange={(event) =>
                  handlePointsConfigChange(
                    "max_points_per_transaction",
                    parseInteger(event.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                คะแนนสูงสุดต่อวัน
              </label>
              <input
                type="number"
                min={0}
                value={pointsConfig?.max_points_per_day ?? ""}
                onChange={(event) =>
                  handlePointsConfigChange(
                    "max_points_per_day",
                    parseInteger(event.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                คะแนนสูงสุดต่อสมาชิก
              </label>
              <input
                type="number"
                min={0}
                value={pointsConfig?.max_points_per_customer ?? ""}
                onChange={(event) =>
                  handlePointsConfigChange(
                    "max_points_per_customer",
                    parseInteger(event.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                จำนวนวันก่อนคะแนนหมดอายุ
              </label>
              <input
                type="number"
                min={0}
                value={pointsConfig?.point_expiry_days ?? ""}
                onChange={(event) =>
                  handlePointsConfigChange(
                    "point_expiry_days",
                    parseInteger(event.target.value)
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {renderToggleRow(
          "conditions-eligibility-toggle",
          "เงื่อนไขการเข้าร่วม",
          "กำหนดคุณสมบัติของลูกค้าที่มีสิทธิ์ได้รับโปรโมชั่น",
          conditionsEnabled.eligibility,
          (checked) => toggleSection("eligibility", checked)
        )}

        {conditionsEnabled.eligibility && (
          <div className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  ยอดซื้อขั้นต่ำ (บาท)
                </label>
                <input
                  type="number"
                  min={0}
                  value={eligibility?.min_purchase_amount ?? ""}
                  onChange={(event) =>
                    withSection("eligibility", (current) => ({
                      ...(current ?? {}),
                      min_purchase_amount: parseInteger(event.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  จำนวนบริการขั้นต่ำ
                </label>
                <input
                  type="number"
                  min={0}
                  value={eligibility?.min_services ?? ""}
                  onChange={(event) =>
                    withSection("eligibility", (current) => ({
                      ...(current ?? {}),
                      min_services: parseInteger(event.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  บริการที่เข้าร่วม (UUID คั่นด้วยจุลภาค)
                </label>
                <textarea
                  rows={2}
                  value={(eligibility?.specific_services ?? []).join(", ")}
                  onChange={(event) =>
                    handleCommaSeparatedChange(
                      "specific_services",
                      event.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="uuid-1, uuid-2"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  หากเว้นว่างไว้ ระบบจะนับทุกบริการ
                </p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  ระดับสมาชิก (คั่นด้วยจุลภาค)
                </label>
                <textarea
                  rows={2}
                  value={(eligibility?.customer_tiers ?? []).join(", ")}
                  onChange={(event) =>
                    handleCommaSeparatedChange(
                      "customer_tiers",
                      event.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="bronze, silver, gold"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  หากเว้นว่างไว้ ระบบจะนับทุกระดับสมาชิก
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                วันที่เข้าร่วมได้
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {DAYS_OF_WEEK.map((day) => {
                  const checked = eligibility?.days_of_week?.includes(day.value) ?? false;
                  return (
                    <label
                      key={day.value}
                      className={`flex items-center justify-center rounded-lg border px-2 py-1 text-sm cursor-pointer transition-colors ${
                        checked
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/40 dark:text-blue-200"
                          : "border-gray-300 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={checked}
                        onChange={(event) =>
                          handleDaysOfWeekChange(day.value, event.target.checked)
                        }
                      />
                      {day.label}
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                หากไม่เลือก ระบบจะนับทุกวัน
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  เวลาเริ่ม (รูปแบบ HH:MM)
                </label>
                <input
                  type="time"
                  value={eligibility?.time_range?.start ?? ""}
                  onChange={(event) =>
                    handleTimeRangeChange("start", event.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  เวลาสิ้นสุด (รูปแบบ HH:MM)
                </label>
                <input
                  type="time"
                  value={eligibility?.time_range?.end ?? ""}
                  onChange={(event) =>
                    handleTimeRangeChange("end", event.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={eligibility?.first_time_only ?? false}
                  onChange={(event) =>
                    withSection("eligibility", (current) => ({
                      ...(current ?? {}),
                      first_time_only: event.target.checked ? true : null,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  เฉพาะลูกค้าใช้บริการครั้งแรก
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  จำนวนครั้งที่ต้องใช้บริการ (ภายในช่วงเวลา)
                </label>
                <input
                  type="number"
                  min={0}
                  value={eligibility?.min_visits_in_period?.visits ?? ""}
                  onChange={(event) =>
                    handleMinVisitsChange("visits", event.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  จำนวนวันภายในช่วงเวลา
                </label>
                <input
                  type="number"
                  min={0}
                  value={eligibility?.min_visits_in_period?.days ?? ""}
                  onChange={(event) =>
                    handleMinVisitsChange("days", event.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {renderToggleRow(
          "conditions-special-toggle",
          "เงื่อนไขพิเศษ",
          "ตั้งค่าการมอบคะแนนพิเศษ เช่น วันเกิด การแนะนำเพื่อน",
          conditionsEnabled.special,
          (checked) => toggleSection("special_conditions", checked)
        )}

        {conditionsEnabled.special && (
          <div className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
            <div className="flex items-center space-x-3">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={specialConditions?.birthday_bonus ?? false}
                  onChange={(event) =>
                    withSection("special_conditions", (current) => ({
                      ...(current ?? {}),
                      birthday_bonus: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  ให้คะแนนพิเศษสำหรับเดือนเกิด
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  จำนวนครั้งที่ต้องใช้บริการต่อเนื่อง
                </label>
                <input
                  type="number"
                  min={0}
                  value={specialConditions?.consecutive_visits?.required ?? ""}
                  onChange={(event) =>
                    handleConsecutiveVisitsChange("required", event.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  ตัวคูณโบนัส
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  value={specialConditions?.consecutive_visits?.bonus_multiplier ?? ""}
                  onChange={(event) =>
                    handleConsecutiveVisitsChange("bonus_multiplier", event.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  คะแนนสำหรับผู้แนะนำ
                </label>
                <input
                  type="number"
                  min={0}
                  value={specialConditions?.referral_bonus?.referrer_points ?? ""}
                  onChange={(event) =>
                    handleReferralBonusChange("referrer_points", event.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                  คะแนนสำหรับผู้ถูกแนะนำ
                </label>
                <input
                  type="number"
                  min={0}
                  value={specialConditions?.referral_bonus?.referee_points ?? ""}
                  onChange={(event) =>
                    handleReferralBonusChange("referee_points", event.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
