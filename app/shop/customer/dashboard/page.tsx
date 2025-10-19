import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ShopMarketplaceLayout } from "@/src/presentation/components/layouts/shop/marketplace";
import { ShopCustomerDashboardView } from "@/src/presentation/components/shop/customer/ShopCustomerDashboardView";
import { ShopCustomerDashboardPresenterFactory } from "@/src/presentation/presenters/shop/customer/ShopCustomerDashboardPresenter";
import {
  ShopMarketplaceLayoutPresenterFactory,
  type ShopMarketplaceLayoutViewModel,
} from "@/src/presentation/presenters/shop/marketplace/ShopMarketplaceLayoutPresenter";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const FALLBACK_LAYOUT_DATA: ShopMarketplaceLayoutViewModel = {
  categories: [],
  heroTitle: "ค้นหาร้านค้าที่ใช่สำหรับคุณ",
  heroDescription: "สำรวจร้านค้ามากมาย จองคิวและรับบริการได้ทันที",
  searchPlaceholder: "ค้นหาร้านค้า, บริการ, หรือสถานที่...",
};

export async function generateMetadata(): Promise<Metadata> {
  const presenter = await ShopCustomerDashboardPresenterFactory.create();

  try {
    const metadata = await presenter.generateMetadata();
    return metadata;
  } catch (error) {
    console.error(
      "Error generating metadata for customer marketplace dashboard:",
      error
    );
    return {
      title: "ร้านค้าที่ฉันเคยใช้บริการ | Shop Queue",
      description: "ติดตามร้านค้าที่คุณเคยใช้บริการและจองคิวอีกครั้ง",
    };
  }
}

type PageSearchParams = Record<string, string | string[] | undefined>;

interface ShopCustomerDashboardPageProps {
  searchParams?: PageSearchParams;
}

function parseNumberParam(
  value: string | string[] | undefined,
  fallback: number
) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default async function ShopCustomerDashboardPage({
  searchParams,
}: ShopCustomerDashboardPageProps) {
  const presenter = await ShopCustomerDashboardPresenterFactory.create();
  const layoutPresenter = await ShopMarketplaceLayoutPresenterFactory.create();

  let layoutData: ShopMarketplaceLayoutViewModel | null = null;

  try {
    layoutData = await layoutPresenter.getLayoutViewModel();
  } catch (layoutError) {
    console.error(
      "Error loading marketplace layout data for customer dashboard:",
      layoutError
    );
  }

  try {
    const page = parseNumberParam(searchParams?.page, 1);
    const limit = parseNumberParam(searchParams?.limit, 10);

    const viewModel = await presenter.getViewModel(page, limit);

    return (
      <ShopMarketplaceLayout
        layoutData={layoutData ?? FALLBACK_LAYOUT_DATA}
        showHero={false}
      >
        <ShopCustomerDashboardView viewModel={viewModel} />
      </ShopMarketplaceLayout>
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("ยังไม่ได้เข้าสู่ระบบ")
    ) {
      redirect("/auth/login");
    }

    console.error("Error loading customer marketplace dashboard:", error);

    return (
      <ShopMarketplaceLayout
        layoutData={layoutData ?? FALLBACK_LAYOUT_DATA}
        showHero={false}
      >
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-surface rounded-lg border border-border p-8 text-center">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-error"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-foreground mb-2">
                เกิดข้อผิดพลาด
              </h2>
              <p className="text-muted mb-6">
                ไม่สามารถโหลดข้อมูลประวัติร้านค้าได้ กรุณาลองใหม่อีกครั้ง
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/shop/customer/dashboard"
                  className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  ลองใหม่อีกครั้ง
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-4 py-2 bg-surface border border-border text-foreground rounded-md hover:bg-muted/50 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  กลับแดชบอร์ด
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ShopMarketplaceLayout>
    );
  }
}
