"use client";

import {
  OpeningHours,
  ShopCreateViewModel,
} from "@/src/presentation/presenters/dashboard/shop-create/ShopCreatePresenter";
import {
  ShopCreateData,
  useShopCreatePresenter,
} from "@/src/presentation/presenters/dashboard/shop-create/useShopCreatePresenter";
import { useToastStore } from "@/src/presentation/stores/toast-store";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { OperatingHoursTemplateSelector } from "./OperatingHoursTemplateSelector";

interface ShopCreateViewProps {
  viewModel: ShopCreateViewModel;
}

export function ShopCreateView({ viewModel }: ShopCreateViewProps) {
  const [state, actions] = useShopCreatePresenter();
  const { addToast } = useToastStore();

  // Use mock data as default values in local development
  const getDefaultFormData = (): ShopCreateData => {
    if (actions.isMockDataEnabled()) {
      const mockData = actions.getMockData();
      return {
        ...mockData,
        category: "",
      };
    }

    return {
      name: "",
      description: "",
      category: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      operatingHours: {
        monday: {
          openTime: "09:00",
          closeTime: "18:00",
          breakStart: "00:00",
          breakEnd: "00:00",
          closed: false,
          hasBreak: false,
          is24Hours: false,
          timezone: "Asia/Bangkok",
        },
        tuesday: {
          openTime: "09:00",
          closeTime: "18:00",
          breakStart: "00:00",
          breakEnd: "00:00",
          closed: false,
          hasBreak: false,
          is24Hours: false,
          timezone: "Asia/Bangkok",
        },
        wednesday: {
          openTime: "09:00",
          closeTime: "18:00",
          breakStart: "00:00",
          breakEnd: "00:00",
          closed: false,
          hasBreak: false,
          is24Hours: false,
          timezone: "Asia/Bangkok",
        },
        thursday: {
          openTime: "09:00",
          closeTime: "18:00",
          breakStart: "00:00",
          breakEnd: "00:00",
          closed: false,
          hasBreak: false,
          is24Hours: false,
          timezone: "Asia/Bangkok",
        },
        friday: {
          openTime: "09:00",
          closeTime: "18:00",
          breakStart: "00:00",
          breakEnd: "00:00",
          closed: false,
          hasBreak: false,
          is24Hours: false,
          timezone: "Asia/Bangkok",
        },
        saturday: {
          openTime: "09:00",
          closeTime: "18:00",
          breakStart: "00:00",
          breakEnd: "00:00",
          closed: false,
          hasBreak: false,
          is24Hours: false,
          timezone: "Asia/Bangkok",
        },
        sunday: {
          openTime: "09:00",
          closeTime: "18:00",
          breakStart: "00:00",
          breakEnd: "00:00",
          closed: true,
          hasBreak: false,
          is24Hours: false,
          timezone: "Asia/Bangkok",
        },
      },
    };
  };

  const [formData, setFormData] = useState<ShopCreateData>(
    getDefaultFormData()
  );
  const [showOperatingHours, setShowOperatingHours] = useState(false);

  useEffect(() => {
    if (state.error) {
      addToast({ type: "error", message: state.error });
    }
  }, [state.error, addToast]);

  const shopUsage = useMemo(() => {
    const current = viewModel.currentShopsCount ?? 0;
    const max = viewModel.maxShopsAllowed;
    const hasLimit = typeof max === "number" && max > 0;
    const percentage = hasLimit
      ? Math.min(100, Math.round((current / max) * 100))
      : 0;
    const remaining = hasLimit ? Math.max(0, max - current) : null;

    return {
      current,
      max,
      hasLimit,
      percentage,
      remaining,
      limitReached: hasLimit && remaining === 0,
    };
  }, [viewModel.currentShopsCount, viewModel.maxShopsAllowed]);

  const steps = useMemo(
    () => [
      {
        id: "basic",
        title: "ข้อมูลพื้นฐาน",
        description:
          "ระบุชื่อร้าน ประเภท และคำอธิบายเพื่อให้ทีมของคุณเข้าใจตรงกัน",
      },
      {
        id: "contact",
        title: "ข้อมูลติดต่อ",
        description:
          "อัปเดตช่องทางการติดต่อเพื่อให้ลูกค้าหรือระบบติดต่อคุณได้ง่าย",
      },
      {
        id: "hours",
        title: "เวลาทำการ",
        description:
          "ตั้งค่าชั่วโมงเปิดทำการหรือใช้เทมเพลตเพื่อเริ่มต้นอย่างรวดเร็ว",
      },
    ],
    []
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [localValidationErrors, setLocalValidationErrors] = useState<
    Record<string, string>
  >({});

  const getFieldError = (field: string): string | undefined => {
    return localValidationErrors[field] ?? state.validationErrors[field];
  };

  const clearLocalFieldError = (field: string) => {
    setLocalValidationErrors((prev) => {
      if (!(field in prev)) {
        return prev;
      }
      const nextErrors = { ...prev };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const nameError = getFieldError("name");
  const categoryError = getFieldError("category");
  const descriptionError = getFieldError("description");
  const phoneError = getFieldError("phone");
  const emailError = getFieldError("email");
  const addressError = getFieldError("address");
  const websiteError = getFieldError("website");

  const runStepValidation = (stepIndex: number): Record<string, string> => {
    const errors: Record<string, string> = {};

    switch (stepIndex) {
      case 0: {
        if (!formData.name.trim()) {
          errors.name = "กรุณาระบุชื่อร้านค้า";
        } else if (formData.name.length < 2) {
          errors.name = "ชื่อร้านค้าต้องมีอย่างน้อย 2 ตัวอักษร";
        }

        if (!formData.description.trim()) {
          errors.description = "กรุณาระบุคำอธิบายร้านค้า";
        } else if (formData.description.length < 10) {
          errors.description = "คำอธิบายต้องมีอย่างน้อย 10 ตัวอักษร";
        }

        if (!formData.category) {
          errors.category = "กรุณาเลือกประเภทร้านค้า";
        }
        break;
      }
      case 1: {
        if (!formData.phone.trim()) {
          errors.phone = "กรุณาระบุเบอร์โทรศัพท์";
        } else if (!/^[0-9-+().\s]+$/.test(formData.phone)) {
          errors.phone = "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง";
        }

        if (formData.address.trim() && formData.address.trim().length < 5) {
          errors.address = "ที่อยู่ต้องมีอย่างน้อย 5 ตัวอักษร";
        }

        if (
          formData.email.trim() &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
          errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
        }

        if (
          formData.website &&
          formData.website.trim() &&
          !/^https?:\/\/.+/.test(formData.website)
        ) {
          errors.website =
            "รูปแบบเว็บไซต์ไม่ถูกต้อง (ต้องขึ้นต้นด้วย http:// หรือ https://)";
        }
        break;
      }
      default:
        break;
    }

    return errors;
  };

  const handlePreviousStep = () => {
    setLocalValidationErrors({});
    actions.clearValidationErrors();
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const currentStepInfo = steps[currentStep];

  const handleInputChange = (field: keyof ShopCreateData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error when user starts typing
    clearLocalFieldError(field as string);
    if (state.validationErrors[field]) {
      actions.clearValidationErrors();
    }
  };

  const handleOperatingHoursChange = (
    day: string,
    field:
      | "openTime"
      | "closeTime"
      | "breakStart"
      | "breakEnd"
      | "closed"
      | "hasBreak"
      | "is24Hours"
      | "timezone",
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day as keyof typeof prev.operatingHours],
          [field]: value,
        },
      },
    }));
  };

  const handleTemplateSelect = (templateHours: OpeningHours[]) => {
    const newOperatingHours = { ...formData.operatingHours };

    templateHours.forEach((templateHour) => {
      const dayKey = templateHour.dayOfWeek as keyof typeof newOperatingHours;
      newOperatingHours[dayKey] = {
        openTime: templateHour.openTime || "09:00",
        closeTime: templateHour.closeTime || "18:00",
        breakStart: templateHour.breakStart || "00:00",
        breakEnd: templateHour.breakEnd || "00:00",
        closed: !templateHour.isOpen,
        hasBreak: !!(templateHour.breakStart && templateHour.breakEnd),
        is24Hours: templateHour.is24Hours || false,
        timezone: templateHour.timezone || "Asia/Bangkok",
      };
    });

    setFormData((prev) => ({
      ...prev,
      operatingHours: newOperatingHours,
    }));

    setShowOperatingHours(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = runStepValidation(currentStep);
    if (Object.keys(errors).length > 0) {
      setLocalValidationErrors(errors);
      return;
    }

    setLocalValidationErrors({});
    actions.clearValidationErrors();

    if (!isLastStep) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    await actions.createShop(formData);
  };

  // Show success message
  if (state.success) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-success-light rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-4">
              สร้างร้านค้าสำเร็จ! 🎉
            </h2>

            <p className="text-muted mb-8 text-lg">
              ร้านค้าของคุณถูกสร้างเรียบร้อยแล้ว กำลังนำคุณไปยังหน้าแดชบอร์ด...
            </p>

            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show limit reached message
  if (!viewModel.canCreateShop) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-warning-light rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-warning"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-4">
              ถึงขีดจำกัดแล้ว
            </h2>

            <p className="text-muted mb-8 text-lg">
              คุณมีร้านค้าครบ {viewModel.maxShopsAllowed} ร้านแล้ว
              กรุณาอัปเกรดแผนการใช้งานเพื่อสร้างร้านค้าเพิ่มเติม
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pricing"
                className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                อัปเกรดแผน
              </Link>
              <Link
                href="/dashboard"
                className="border border-border text-foreground px-8 py-3 rounded-lg font-medium hover:bg-muted-light transition-colors"
              >
                กลับแดชบอร์ด
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/dashboard"
              className="flex items-center text-muted hover:text-foreground transition-colors mr-4"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              กลับแดชบอร์ด
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            สร้างร้านค้าใหม่ 🏪
          </h1>
          <p className="text-muted">
            กรอกข้อมูลร้านค้าของคุณเพื่อเริ่มใช้งานระบบจัดการคิว
          </p>

          {/* Shop usage summary */}
          <div className="mt-6 rounded-2xl border border-border bg-muted-light p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  สถานะการใช้งานร้านค้า
                </p>
                <p className="mt-1 text-sm text-muted">
                  ติดตามจำนวนร้านค้าที่คุณสร้างไว้
                  เพื่อบริหารโควต้าได้อย่างชัดเจน
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <span className="text-2xl font-semibold text-foreground">
                  {shopUsage.hasLimit && shopUsage.max
                    ? `${shopUsage.current}/${shopUsage.max} ร้าน`
                    : `${shopUsage.current} ร้าน`}
                </span>
                {shopUsage.hasLimit ? (
                  <span className="rounded-full bg-info-light px-3 py-1 text-xs font-medium text-info-dark">
                    เหลือ {shopUsage.remaining} ร้านสำหรับแผนปัจจุบัน
                  </span>
                ) : (
                  <span className="rounded-full bg-success-light px-3 py-1 text-xs font-medium text-success-dark">
                    แผนปัจจุบันสร้างร้านค้าได้ไม่จำกัด
                  </span>
                )}
              </div>
            </div>

            {shopUsage.hasLimit && shopUsage.max ? (
              <>
                <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${shopUsage.percentage}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted">
                  <span>0 ร้าน</span>
                  <span>{shopUsage.percentage}% ของโควต้า</span>
                  <span>สูงสุด {shopUsage.max} ร้าน</span>
                </div>

                {shopUsage.limitReached && (
                  <div className="mt-4 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning-dark">
                    <div className="flex items-start gap-2">
                      <span className="text-lg" aria-hidden>
                        ⚠️
                      </span>
                      <div>
                        <p className="font-medium">ถึงขีดจำกัดแล้ว</p>
                        <p className="text-xs text-warning-dark/80">
                          คุณสร้างร้านค้าครบโควต้า หากต้องการสร้างเพิ่ม
                          กรุณาลบร้านที่ไม่ใช้หรืออัปเกรดแผนการใช้งาน
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-4 rounded-xl border border-success/40 bg-success/10 px-4 py-3 text-sm text-success-dark">
                <div className="flex items-start gap-2">
                  <span className="text-lg" aria-hidden>
                    🎉
                  </span>
                  <p className="text-sm">
                    คุณสามารถสร้างร้านค้าได้ไม่จำกัดจำนวนในแผนการใช้งานนี้
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {state.error && (
          <div className="mb-6 p-4 bg-error-light border border-error rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-error mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-error-dark">{state.error}</span>
            </div>
          </div>
        )}

        {/* Stepper */}
        <div className="mb-8 rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                ขั้นตอน {currentStep + 1} / {steps.length}
              </span>
              <h2 className="text-2xl font-semibold text-foreground">
                {currentStepInfo.title}
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                {currentStepInfo.description}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {steps.map((step, stepIndex) => {
                const isActive = stepIndex === currentStep;
                const isCompleted = stepIndex < currentStep;
                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors ${
                        isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : isCompleted
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-muted-light text-muted"
                      }`}
                    >
                      {stepIndex + 1}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isActive ? "text-foreground" : "text-muted"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {currentStep === 0 && (
            // Basic Information
            <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                ข้อมูลพื้นฐาน
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ชื่อร้านค้า *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full px-4 py-3 outline-none border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                      nameError ? "border-error" : "border-border"
                    }`}
                    placeholder="เช่น ร้านกาแฟดีดี"
                  />
                  {nameError && (
                    <p className="mt-1 text-sm text-error">{nameError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ประเภทร้านค้า *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className={`w-full px-4 py-3 outline-none border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                      categoryError ? "border-error" : "border-border"
                    }`}
                  >
                    <option value="">เลือกประเภทร้านค้า</option>
                    {viewModel.categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name} - {category.description}
                      </option>
                    ))}
                  </select>
                  {categoryError && (
                    <p className="mt-1 text-sm text-error">{categoryError}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  คำอธิบายร้านค้า *
                </label>
                <input
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className={`w-full px-4 py-3 outline-none border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                    descriptionError ? "border-error" : "border-border"
                  }`}
                  placeholder="อธิบายเกี่ยวกับร้านค้าของคุณ บริการที่ให้ และสิ่งที่ทำให้ร้านคุณพิเศษ"
                  maxLength={200}
                />
                {descriptionError && (
                  <p className="mt-1 text-sm text-error">{descriptionError}</p>
                )}
                <p className="mt-1 text-sm text-muted">
                  {formData.description.length}/200 ตัวอักษร
                </p>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            // Contact Information
            <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                ข้อมูลติดต่อ
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    เบอร์โทรศัพท์ *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`w-full px-4 py-3 outline-none border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                      phoneError ? "border-error" : "border-border"
                    }`}
                    placeholder="02-123-4567"
                  />
                  {phoneError && (
                    <p className="mt-1 text-sm text-error">{phoneError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    อีเมล (ไม่บังคับ)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full px-4 py-3 outline-none border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                      emailError ? "border-error" : "border-border"
                    }`}
                    placeholder="shop@example.com"
                  />
                  {emailError && (
                    <p className="mt-1 text-sm text-error">{emailError}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  ที่อยู่ (ไม่บังคับ)
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={2}
                  className={`w-full px-4 py-3 outline-none border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                    addressError ? "border-error" : "border-border"
                  }`}
                  placeholder="123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพฯ 10110"
                />
                {addressError && (
                  <p className="mt-1 text-sm text-error">{addressError}</p>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  เว็บไซต์ (ไม่บังคับ)
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className={`w-full px-4 py-3 outline-none border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                    websiteError ? "border-error" : "border-border"
                  }`}
                  placeholder="https://www.example.com"
                />
                {websiteError && (
                  <p className="mt-1 text-sm text-error">{websiteError}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            // Operating Hours
            <div className="bg-surface rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  เวลาทำการ
                </h2>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-muted">
                    (ไม่บังคับ - สามารถแก้ไขภายหลังได้)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowOperatingHours(!showOperatingHours)}
                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                  >
                    {showOperatingHours ? "ซ่อนเวลาทำการ" : "ตั้งเวลาทำการ"}
                  </button>
                </div>
              </div>

              {showOperatingHours ? (
                <>
                  <OperatingHoursTemplateSelector
                    onTemplateSelect={handleTemplateSelect}
                  />

                  <div className="mt-8 pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      แก้ไขเวลาทำการ (ถ้าต้องการ)
                    </h3>
                    <div className="space-y-6">
                      {Object.entries(formData.operatingHours).map(
                        ([day, hours]) => {
                          const dayNames = {
                            monday: "จันทร์",
                            tuesday: "อังคาร",
                            wednesday: "พุธ",
                            thursday: "พฤหัสบดี",
                            friday: "ศุกร์",
                            saturday: "เสาร์",
                            sunday: "อาทิตย์",
                          };

                          return (
                            <div key={day} className="flex flex-col space-y-3">
                              <div className="flex items-center">
                                <div className="w-20">
                                  <span className="text-sm font-medium text-foreground">
                                    {dayNames[day as keyof typeof dayNames]}
                                  </span>
                                </div>

                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={!hours.closed}
                                    onChange={(e) =>
                                      handleOperatingHoursChange(
                                        day,
                                        "closed",
                                        !e.target.checked
                                      )
                                    }
                                    className="rounded border-border text-primary focus:ring-primary"
                                    id={`${day}-open`}
                                  />
                                  <label
                                    htmlFor={`${day}-open`}
                                    className="text-sm text-muted ml-2"
                                  >
                                    เปิด
                                  </label>
                                </div>
                              </div>

                              {!hours.closed && (
                                <div className="ml-20 space-y-3">
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={hours.is24Hours}
                                      onChange={(e) =>
                                        handleOperatingHoursChange(
                                          day,
                                          "is24Hours",
                                          e.target.checked
                                        )
                                      }
                                      className="rounded border-border text-primary focus:ring-primary"
                                      id={`${day}-24hours`}
                                    />
                                    <label
                                      htmlFor={`${day}-24hours`}
                                      className="text-sm text-muted ml-2"
                                    >
                                      เปิด 24 ชั่วโมง
                                    </label>
                                  </div>

                                  {!hours.is24Hours && (
                                    <div className="flex items-center flex-wrap gap-3">
                                      <div className="w-12 text-sm text-muted">
                                        เปิด
                                      </div>
                                      <input
                                        type="time"
                                        value={hours.openTime}
                                        onChange={(e) =>
                                          handleOperatingHoursChange(
                                            day,
                                            "openTime",
                                            e.target.value
                                          )
                                        }
                                        className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                      />
                                      <div className="w-12 text-sm text-muted text-center">
                                        ถึง
                                      </div>
                                      <input
                                        type="time"
                                        value={hours.closeTime}
                                        onChange={(e) =>
                                          handleOperatingHoursChange(
                                            day,
                                            "closeTime",
                                            e.target.value
                                          )
                                        }
                                        className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                      />

                                      {/* Timezone selector */}
                                      <div className="w-24 text-sm text-muted text-center">
                                        TZ
                                      </div>
                                      <select
                                        value={hours.timezone || "Asia/Bangkok"}
                                        onChange={(e) =>
                                          handleOperatingHoursChange(
                                            day,
                                            "timezone",
                                            e.target.value
                                          )
                                        }
                                        className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                      >
                                        <option value="Asia/Bangkok">
                                          Asia/Bangkok (GMT+7)
                                        </option>
                                        <option value="Asia/Ho_Chi_Minh">
                                          Asia/Ho_Chi_Minh (GMT+7)
                                        </option>
                                        <option value="Asia/Jakarta">
                                          Asia/Jakarta (GMT+7)
                                        </option>
                                        <option value="Asia/Kuala_Lumpur">
                                          Asia/Kuala_Lumpur (GMT+8)
                                        </option>
                                        <option value="Asia/Singapore">
                                          Asia/Singapore (GMT+8)
                                        </option>
                                        <option value="Asia/Hong_Kong">
                                          Asia/Hong_Kong (GMT+8)
                                        </option>
                                        <option value="Asia/Shanghai">
                                          Asia/Shanghai (GMT+8)
                                        </option>
                                        <option value="Asia/Manila">
                                          Asia/Manila (GMT+8)
                                        </option>
                                        <option value="Asia/Tokyo">
                                          Asia/Tokyo (GMT+9)
                                        </option>
                                        <option value="Asia/Kolkata">
                                          Asia/Kolkata (GMT+5:30)
                                        </option>
                                      </select>
                                    </div>
                                  )}

                                  {!hours.is24Hours && (
                                    <div className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={hours.hasBreak}
                                        onChange={(e) =>
                                          handleOperatingHoursChange(
                                            day,
                                            "hasBreak",
                                            e.target.checked
                                          )
                                        }
                                        className="rounded border-border text-primary focus:ring-primary"
                                        id={`${day}-break`}
                                        disabled={hours.is24Hours}
                                      />
                                      <label
                                        htmlFor={`${day}-break`}
                                        className="text-sm text-muted ml-2"
                                      >
                                        มีเวลาพัก
                                      </label>
                                    </div>
                                  )}

                                  {!hours.is24Hours && hours.hasBreak && (
                                    <div className="flex items-center">
                                      <div className="w-12"></div>
                                      <input
                                        type="time"
                                        value={hours.breakStart}
                                        onChange={(e) =>
                                          handleOperatingHoursChange(
                                            day,
                                            "breakStart",
                                            e.target.value
                                          )
                                        }
                                        className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                      />
                                      <div className="w-12 text-sm text-muted text-center">
                                        ถึง
                                      </div>
                                      <input
                                        type="time"
                                        value={hours.breakEnd}
                                        onChange={(e) =>
                                          handleOperatingHoursChange(
                                            day,
                                            "breakEnd",
                                            e.target.value
                                          )
                                        }
                                        className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                      />
                                    </div>
                                  )}
                                </div>
                              )}

                              {hours.closed && (
                                <div className="ml-20">
                                  <span className="text-muted italic">ปิด</span>
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">⏰</div>
                  <p className="text-muted mb-2">ยังไม่ได้ตั้งเวลาทำการ</p>
                  <p className="text-sm text-muted">
                    คลิก &quot;ตั้งเวลาทำการ&quot; เพื่อเลือก template
                    หรือกำหนดเอง
                  </p>
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-3 text-sm font-medium text-muted hover:bg-muted-light transition-colors"
            >
              ยกเลิก
            </Link>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePreviousStep}
                disabled={isFirstStep || state.isLoading}
                className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                ย้อนกลับ
              </button>
              <button
                type="submit"
                disabled={state.isLoading}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60"
              >
                {state.isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                    กำลังดำเนินการ...
                  </>
                ) : isLastStep ? (
                  "สร้างร้านค้า"
                ) : (
                  "ขั้นตอนถัดไป"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
