"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import type {
  CustomerVisitedShopsViewModel,
  VisitedShopItem,
} from "@/src/presentation/presenters/shop/frontend/CustomerVisitedShopsPresenter";

interface CustomerVisitedShopsViewProps {
  viewModel: CustomerVisitedShopsViewModel;
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

function getShopLinks(shop: VisitedShopItem) {
  const slugOrId = shop.shopSlug || shop.shopId;
  const basePath = `/shop/${encodeURIComponent(slugOrId)}`;

  return {
    shopLink: basePath,
    queueLink: `${basePath}/queue`,
  };
}

export function CustomerVisitedShopsView({
  viewModel,
}: CustomerVisitedShopsViewProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageLink = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const visitedShops = useMemo(
    () => viewModel.visitedShops,
    [viewModel.visitedShops]
  );
  const { pagination } = viewModel;

  const canGoPrev = pagination.hasPrev && pagination.currentPage > 1;
  const canGoNext =
    pagination.hasNext && pagination.currentPage < pagination.totalPages;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              ร้านค้าที่คุณเคยใช้บริการ
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              รวมประวัติร้านค้าทั้งหมดที่ {viewModel.profileName}{" "}
              เคยเข้าใช้บริการ พร้อมจำนวนครั้งและวันที่เข้าใช้ล่าสุด
            </p>
          </div>

          {visitedShops.length === 0 ? (
            <div className="bg-background rounded-lg border border-border p-8 text-center">
              <div className="text-6xl mb-4">🛍️</div>
              <p className="text-muted-foreground mb-6">
                ยังไม่มีประวัติการใช้บริการร้านค้า
              </p>
              <Link
                href="/shop"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
              >
                สำรวจตลาดร้านค้า
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visitedShops.map((item) => {
                const { shopLink, queueLink } = getShopLinks(item);

                return (
                  <div
                    key={`${item.shopId}-${item.customerId}`}
                    className="bg-background rounded-lg border border-border p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {item.shopName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          เยี่ยมชมทั้งหมด{" "}
                          {item.totalVisits.toLocaleString("th-TH")}&nbsp;ครั้ง
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground mb-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>เข้าใช้บริการล่าสุด</span>
                        <span>{formatThaiDateTime(item.lastVisitedAt)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>เข้าใช้บริการครั้งแรก</span>
                        <span>{formatThaiDateTime(item.firstVisitedAt)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={shopLink}
                        className="flex-1 bg-blue-500 text-white text-center py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        ดูหน้าร้าน
                      </Link>
                      <Link
                        href={queueLink}
                        className="flex-1 bg-green-500 text-white text-center py-2 px-3 rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
                      >
                        จองคิวอีกครั้ง
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {viewModel.hasVisitedShops && pagination.totalPages > 1 && (
            <div className="mt-6 pt-6 border-t border-border flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-muted-foreground">
                แสดงหน้า {pagination.currentPage} จาก {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <Link
                  aria-disabled={!canGoPrev}
                  className={`inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                    canGoPrev
                      ? "border-border text-foreground hover:bg-muted/80"
                      : "border-border/60 text-muted-foreground cursor-not-allowed"
                  }`}
                  href={
                    canGoPrev ? createPageLink(pagination.currentPage - 1) : "#"
                  }
                  prefetch={false}
                >
                  ก่อนหน้า
                </Link>
                <Link
                  aria-disabled={!canGoNext}
                  className={`inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                    canGoNext
                      ? "border-border text-foreground hover:bg-muted/80"
                      : "border-border/60 text-muted-foreground cursor-not-allowed"
                  }`}
                  href={
                    canGoNext ? createPageLink(pagination.currentPage + 1) : "#"
                  }
                  prefetch={false}
                >
                  ถัดไป
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
