import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ShopMarketplaceLayout } from "@/src/presentation/components/layouts/shop/marketplace";
import { ShopMerchantDashboardView } from "@/src/presentation/components/shop/merchant/ShopMerchantDashboardView";
import {
  ShopMarketplaceLayoutPresenterFactory,
  type ShopMarketplaceLayoutViewModel,
} from "@/src/presentation/presenters/shop/marketplace/ShopMarketplaceLayoutPresenter";
import { ShopMerchantDashboardPresenterFactory } from "@/src/presentation/presenters/shop/merchant/ShopMerchantDashboardPresenter";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const FALLBACK_LAYOUT_DATA: ShopMarketplaceLayoutViewModel = {
  categories: [],
  heroTitle: "แดชบอร์ดร้านค้า",
  heroDescription: "จัดการร้านค้าและคิวของคุณในที่เดียว",
  searchPlaceholder: "ค้นหาร้านค้า, บริการ, หรือสถานที่...",
};

export async function generateMetadata(): Promise<Metadata> {
  const presenter = await ShopMerchantDashboardPresenterFactory.create();

  try {
    const metadata = await presenter.generateMetadata();
    return metadata;
  } catch (error) {
    console.error(
      "Error generating metadata for shop merchant dashboard:",
      error
    );
    return {
      title: "แดชบอร์ดร้านค้า | Shop Queue",
      description: "ภาพรวมการจัดการร้านค้าและระบบคิวของคุณ",
    };
  }
}

export default async function ShopMerchantDashboardPage() {
  const presenter = await ShopMerchantDashboardPresenterFactory.create();
  const layoutPresenter = await ShopMarketplaceLayoutPresenterFactory.create();

  let layoutData: ShopMarketplaceLayoutViewModel | null = null;

  try {
    layoutData = await layoutPresenter.getLayoutViewModel();
  } catch (error) {
    console.error(
      "Error loading marketplace layout data for shop merchant dashboard:",
      error
    );
  }

  try {
    const viewModel = await presenter.getViewModel();

    if (!viewModel || !viewModel.user) {
      redirect("/auth/login");
    }

    return (
      <ShopMarketplaceLayout
        layoutData={layoutData ?? FALLBACK_LAYOUT_DATA}
        showHero={false}
      >
        <ShopMerchantDashboardView viewModel={viewModel} />
      </ShopMarketplaceLayout>
    );
  } catch (error) {
    console.error("Error loading shop merchant dashboard data:", error);

    return (
      <ShopMarketplaceLayout
        layoutData={layoutData ?? FALLBACK_LAYOUT_DATA}
        showHero={false}
      >
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="marketplace-card bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-8 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <svg
                  className="w-8 h-8"
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
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                เกิดข้อผิดพลาด
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                ไม่สามารถโหลดข้อมูลแดชบอร์ดร้านค้าได้ กรุณาลองใหม่อีกครั้ง
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/shop/merchant/dashboard"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg marketplace-button-primary text-white"
                >
                  ลองใหม่อีกครั้ง
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  เข้าสู่ระบบใหม่
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ShopMarketplaceLayout>
    );
  }
}
