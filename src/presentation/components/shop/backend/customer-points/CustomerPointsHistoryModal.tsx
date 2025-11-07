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
  typeFilter: "all" | CustomerPointTransactionItem["type"];
  dateRange: "all" | "30d" | "90d" | "365d";
  onChangeTypeFilter: (value: "all" | CustomerPointTransactionItem["type"]) => void;
  onChangeDateRange: (value: "all" | "30d" | "90d" | "365d") => void;
  onResetFilters: () => void;
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
  typeFilter,
  dateRange,
  onChangeTypeFilter,
  onChangeDateRange,
  onResetFilters,
  onClose,
}: CustomerPointsHistoryModalProps) {
  const customer = useMemo(() => {
    if (!customerId) return null;
    return customers.find((item) => item.id === customerId) ?? null;
  }, [customerId, customers]);

  const totals = useMemo(() => {
    return transactions.reduce(
      (
        acc,
        transaction,
      ) => {
        if (transaction.type === "earned") {
          acc.earned += transaction.points;
        } else if (transaction.type === "redeemed") {
          acc.redeemed += Math.abs(transaction.points);
        } else if (transaction.type === "expired") {
          acc.expired += Math.abs(transaction.points);
        }
        acc.net = acc.earned - acc.redeemed - acc.expired;
        return acc;
      },
      {
        earned: 0,
        redeemed: 0,
        expired: 0,
        net: 0,
      }
    );
  }, [transactions]);

  const typeOptions: Array<{ value: typeof typeFilter; label: string }> = [
    { value: "all", label: "ทุกประเภท" },
    { value: "earned", label: "ได้รับแต้ม" },
    { value: "redeemed", label: "ใช้แต้ม" },
    { value: "expired", label: "แต้มหมดอายุ" },
  ];

  const dateOptions: Array<{ value: typeof dateRange; label: string }> = [
    { value: "30d", label: "30 วัน" },
    { value: "90d", label: "90 วัน" },
    { value: "365d", label: "1 ปี" },
    { value: "all", label: "ทั้งหมด" },
  ];

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

              <div className="flex flex-col gap-4 border-b border-gray-100 bg-white/60 px-4 py-4 dark:border-gray-800 dark:bg-gray-900/40 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {typeOptions.map((option) => {
                    const isActive = option.value === typeFilter;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => onChangeTypeFilter(option.value)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          isActive
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {dateOptions.map((option) => {
                    const isActive = option.value === dateRange;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => onChangeDateRange(option.value)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          isActive
                            ? "bg-slate-900 text-white shadow-sm dark:bg-slate-600"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={onResetFilters}
                    className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    รีเซ็ตตัวกรอง
                  </button>
                </div>
              </div>

              <div className="grid gap-3 border-b border-gray-100 bg-white/70 px-4 py-4 text-sm dark:border-gray-800 dark:bg-gray-900/40 md:grid-cols-4">
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700 dark:border-green-900/40 dark:bg-green-900/30 dark:text-green-200">
                  <p className="text-xs uppercase tracking-wide">แต้มสะสม</p>
                  <p className="mt-1 text-lg font-semibold">{totals.earned.toLocaleString("th-TH")}</p>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600 dark:border-red-900/40 dark:bg-red-900/30 dark:text-red-200">
                  <p className="text-xs uppercase tracking-wide">แต้มใช้ไป</p>
                  <p className="mt-1 text-lg font-semibold">{totals.redeemed.toLocaleString("th-TH")}</p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/30 dark:text-amber-200">
                  <p className="text-xs uppercase tracking-wide">แต้มหมดอายุ</p>
                  <p className="mt-1 text-lg font-semibold">{totals.expired.toLocaleString("th-TH")}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 dark:border-slate-900/40 dark:bg-slate-900/40 dark:text-slate-200">
                  <p className="text-xs uppercase tracking-wide">สุทธิ</p>
                  <p className={`mt-1 text-lg font-semibold ${
                    totals.net >= 0 ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"
                  }`}>
                    {totals.net >= 0 ? "+" : "-"}
                    {Math.abs(totals.net).toLocaleString("th-TH")}
                  </p>
                </div>
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
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {formatTransactionType(transaction.type)}
                          </p>
                          {transaction.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {transaction.description}
                            </p>
                          )}
                          {transaction.relatedQueueId && (
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              อ้างอิงคิว: {transaction.relatedQueueId}
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
