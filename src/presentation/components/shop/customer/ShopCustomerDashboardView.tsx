"use client";

import Link from "next/link";

import type { ShopCustomerDashboardViewModel } from "@/src/presentation/presenters/shop/customer/ShopCustomerDashboardPresenter";

interface ShopCustomerDashboardViewProps {
  viewModel: ShopCustomerDashboardViewModel;
}

function formatThaiDateTime(isoString: string) {
  const date = isoString ? new Date(isoString) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getShopLinks(shopSlug: string, shopId: string) {
  const slugOrId = shopSlug || shopId;
  const basePath = `/shop/${encodeURIComponent(slugOrId)}`;

  return {
    shopLink: basePath,
    queueLink: `${basePath}/queue`,
  };
}

export function ShopCustomerDashboardView({
  viewModel,
}: ShopCustomerDashboardViewProps) {
  const { hero, stats, visitedShops, pagination, hasVisitedShops } = viewModel;

  return (
    <div className="space-y-8">
      <section className="marketplace-card gradient-border p-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-orange-500 font-semibold">
            สำหรับลูกค้า
          </p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {hero.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            {hero.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 p-4 shadow-sm">
              <p className="text-sm text-slate-500 dark:text-slate-400">จำนวนร้านที่เคยใช้บริการ</p>
              <p className="text-3xl font-semibold text-slate-900 dark:text-white mt-2">
                {stats.totalVisitedShops.toLocaleString("th-TH")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              ร้านที่เคยใช้บริการ
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              รายการร้านค้าทั้งหมดที่คุณเคยจองคิวและเข้าใช้บริการ
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center px-4 py-2 rounded-lg marketplace-button-primary text-white"
          >
            สำรวจร้านค้าใหม่
          </Link>
        </div>

        {!hasVisitedShops ? (
          <div className="marketplace-card border border-dashed border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 text-center py-16">
            <div className="text-5xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              ยังไม่มีประวัติการใช้บริการ
            </h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              เริ่มค้นหาร้านที่ถูกใจและจองคิวกับร้านค้าชั้นนำได้ในตลาดร้านค้าของเรา
            </p>
            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-flex items-center px-4 py-2 rounded-lg marketplace-button-primary text-white"
              >
                ไปยังตลาดร้านค้า
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {visitedShops.map((shop) => {
              const { shopLink, queueLink } = getShopLinks(shop.shopSlug, shop.shopId);

              return (
                <div
                  key={`${shop.shopId}-${shop.customerId}`}
                  className="marketplace-card bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {shop.shopName}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        เยี่ยมชมทั้งหมด {shop.totalVisits.toLocaleString("th-TH")}&nbsp;ครั้ง
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        เข้าใช้บริการล่าสุด
                      </span>
                      <span className="block mt-1 text-base font-medium text-slate-900 dark:text-white">
                        {formatThaiDateTime(shop.lastVisitedAt)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        เข้าใช้บริการครั้งแรก
                      </span>
                      <span className="block mt-1 text-base font-medium text-slate-900 dark:text-white">
                        {formatThaiDateTime(shop.firstVisitedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={shopLink}
                      className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      ดูหน้าร้าน
                    </Link>
                    <Link
                      href={queueLink}
                      className="inline-flex items-center px-4 py-2 rounded-lg marketplace-button-primary text-white"
                    >
                      จองคิวอีกครั้ง
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {hasVisitedShops && pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-200 dark:border-slate-800 pt-6">
            <div className="text-sm text-slate-600 dark:text-slate-300">
              แสดงหน้า {pagination.currentPage} จาก {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <Link
                aria-disabled={!pagination.hasPrev}
                className={`inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium transition-colors ${
                  pagination.hasPrev
                    ? "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    : "text-slate-400 dark:text-slate-500 cursor-not-allowed"
                }`}
                href={pagination.hasPrev ? `/shop/customer/dashboard?page=${pagination.currentPage - 1}` : "#"}
              >
                ก่อนหน้า
              </Link>
              <Link
                aria-disabled={!pagination.hasNext}
                className={`inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium transition-colors ${
                  pagination.hasNext
                    ? "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    : "text-slate-400 dark:text-slate-500 cursor-not-allowed"
                }`}
                href={pagination.hasNext ? `/shop/customer/dashboard?page=${pagination.currentPage + 1}` : "#"}
              >
                ถัดไป
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
