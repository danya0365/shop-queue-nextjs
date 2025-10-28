"use client";

import { useMemo } from "react";
import type { CustomerPointsViewModel } from "@/src/presentation/presenters/shop/backend/CustomerPointsPresenter";

interface CustomerPointsHistoryModalProps {
  isOpen: boolean;
  customerId: string | null;
  customers: CustomerPointsViewModel["customerPoints"];
  onClose: () => void;
}

function formatDate(date: Date | string | undefined) {
  if (!date) return "-";
  const parsed = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsed);
}

export function CustomerPointsHistoryModal({
  isOpen,
  customerId,
  customers,
  onClose,
}: CustomerPointsHistoryModalProps) {
  const customer = useMemo(() => {
    if (!customerId) return null;
    return customers.find((item) => item.id === customerId) ?? null;
  }, [customerId, customers]);

  if (!isOpen || !customer) {
    return null;
  }

  const summaryCards = [
    {
      label: "แต้มสะสมทั้งหมด",
      value: customer.totalEarned,
      className:
        "border-green-100 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200",
    },
    {
      label: "แต้มคงเหลือ",
      value: customer.currentPoints,
      className:
        "border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-200",
    },
    {
      label: "แต้มที่ใช้ไป",
      value: customer.totalRedeemed,
      className:
        "border-red-100 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-4 text-white dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold">ประวัติแต้มลูกค้า</h3>
            <p className="text-sm text-slate-200">
              รายละเอียดแต้มสะสมของ {customer.customerName ?? "ลูกค้า"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white transition hover:bg-white/30"
          >
            ปิด
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {customer.customerName ?? "ไม่ทราบชื่อ"}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {customer.customerPhone ?? "ไม่ระบุเบอร์โทร"}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  อัปเดตล่าสุด: {formatDate(customer.updatedAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-white">
                  ระดับ {customer.membershipTier.toUpperCase()}
                </span>
                {customer.pointsToNextTier && customer.pointsToNextTier > 0 && (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200">
                    อีก {customer.pointsToNextTier.toLocaleString("th-TH")} แต้มสู่ระดับถัดไป
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100">
              สรุปการใช้งานแต้ม
            </h4>
            <div className="grid gap-4 md:grid-cols-3">
              {summaryCards.map((card) => (
                <div
                  key={card.label}
                  className={`rounded-lg border p-4 ${card.className}`}
                >
                  <p className="text-sm">{card.label}</p>
                  <p className="mt-2 text-2xl font-bold">
                    {card.value.toLocaleString("th-TH")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <span>รายละเอียดแต้ม</span>
              <span>
                สร้างเมื่อ: {formatDate(customer.createdAt)} • อัปเดตล่าสุด: {formatDate(customer.updatedAt)}
              </span>
            </div>
            <div className="grid gap-2 p-4 text-sm text-gray-700 dark:text-gray-200">
              <div className="flex items-center justify-between">
                <span>แต้มสะสมทั้งหมด</span>
                <span className="font-semibold text-green-600 dark:text-green-300">
                  {customer.totalEarned.toLocaleString("th-TH")} แต้ม
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>แต้มที่ใช้ไป</span>
                <span className="font-semibold text-red-600 dark:text-red-300">
                  {customer.totalRedeemed.toLocaleString("th-TH")} แต้ม
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>แต้มคงเหลือ</span>
                <span className="font-semibold text-blue-600 dark:text-blue-300">
                  {customer.currentPoints.toLocaleString("th-TH")} แต้ม
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
