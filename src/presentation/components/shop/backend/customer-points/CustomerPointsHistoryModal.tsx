"use client";

import { useMemo } from "react";
import type {
  CustomerPointTransactionItem,
  CustomerPointsViewModel,
} from "@/src/presentation/presenters/shop/backend/CustomerPointsPresenter";
import type { PaginationMeta } from "@/src/domain/interfaces/pagination-types";

interface CustomerPointsHistoryModalProps {
  isOpen: boolean;
  customerId: string | null;
  customers: CustomerPointsViewModel["customerPoints"];
  transactions: CustomerPointTransactionItem[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  onReload: (options?: { page?: number }) => void;
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

function formatTransactionType(type: CustomerPointTransactionItem["type"]) {
  const map = {
    earned: "ได้รับแต้ม",
    redeemed: "ใช้แต้ม",
    expired: "แต้มหมดอายุ",
    adjusted: "ปรับแต้ม",
  } as const;
  return map[type] ?? type;
}

function formatPointsValue(transaction: CustomerPointTransactionItem) {
  const sign = transaction.type === "redeemed" || transaction.type === "expired" ? "-" : "+";
  return `${sign}${Math.abs(transaction.points).toLocaleString("th-TH")} แต้ม`;
}

function formatDateWithTime(date: Date | string | undefined) {
  if (!date) return "-";
  const parsed = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

export function CustomerPointsHistoryModal({
  isOpen,
  customerId,
  customers,
  transactions,
  pagination,
  loading,
  error,
  onReload,
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

          <div className="space-y-4">
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

            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <span>ประวัติการเคลื่อนไหว</span>
                <button
                  type="button"
                  onClick={() => onReload({ page: pagination?.currentPage ?? 1 })}
                  className="text-xs font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400"
                  disabled={loading}
                >
                  โหลดซ้ำ
                </button>
              </div>

              <div className="relative min-h-[180px]">
                {loading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      กำลังโหลดประวัติแต้ม...
                    </span>
                  </div>
                )}

                {error && !loading ? (
                  <div className="p-6 text-center text-sm text-red-500">
                    <p className="mb-3">{error}</p>
                    <button
                      type="button"
                      onClick={() => onReload({ page: pagination?.currentPage ?? 1 })}
                      className="rounded-md bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                    >
                      ลองอีกครั้ง
                    </button>
                  </div>
                ) : null}

                {!loading && !error && transactions.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-500">
                    <div className="mb-3 text-3xl">🗒️</div>
                    <p>ยังไม่มีประวัติการเคลื่อนไหวของแต้ม</p>
                  </div>
                ) : null}

                {!loading && !error && transactions.length > 0 ? (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {formatTransactionType(transaction.type)}
                          </p>
                          {transaction.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {transaction.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            วันที่ทำรายการ: {formatDateWithTime(transaction.transactionDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-semibold ${
                              transaction.type === "redeemed" || transaction.type === "expired"
                                ? "text-red-600 dark:text-red-300"
                                : "text-green-600 dark:text-green-300"
                            }`}
                          >
                            {formatPointsValue(transaction)}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            บันทึกเมื่อ: {formatDateWithTime(transaction.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              {pagination && (pagination.totalPages > 1 || pagination.hasPrevPage || pagination.hasNextPage) ? (
                <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <button
                    type="button"
                    onClick={() => onReload({ page: Math.max(1, pagination.currentPage - 1) })}
                    disabled={!pagination.hasPrevPage || loading}
                    className="rounded-md px-3 py-1 font-medium transition disabled:cursor-not-allowed disabled:text-gray-400 enabled:hover:bg-gray-200 dark:enabled:hover:bg-gray-700"
                  >
                    ก่อนหน้า
                  </button>
                  <span>
                    หน้า {pagination.currentPage} / {pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => onReload({ page: pagination.currentPage + 1 })}
                    disabled={!pagination.hasNextPage || loading}
                    className="rounded-md px-3 py-1 font-medium transition disabled:cursor-not-allowed disabled:text-gray-400 enabled:hover:bg-gray-200 dark:enabled:hover:bg-gray-700"
                  >
                    ถัดไป
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
