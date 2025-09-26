import { ShopsDashboardView } from "@/src/presentation/components/shop/dashboard/ShopsDashboardView";
import { ShopsDashboardPresenterFactory } from "@/src/presentation/presenters/shop/dashboard/ShopsDashboardPresenter";
import type { Metadata } from "next";
import FrontendLayout from "@/src/presentation/components/layouts/shop/frontend/FrontendLayout";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the page
 */
export async function generateMetadata(): Promise<Metadata> {
  try {
    const presenter = await ShopsDashboardPresenterFactory.create();
    return presenter.getMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "รวมร้านค้า | Shop Queue",
      description: "ระบบจัดการคิวร้านค้าทั้งหมดใน Shop Queue",
    };
  }
}

/**
 * Shops Dashboard page - Server Component for SEO optimization
 */
export default async function ShopsDashboardPage() {
  try {
    const presenter = await ShopsDashboardPresenterFactory.create();
    const viewModel = await presenter.getViewModel();

    return (
      <FrontendLayout>
        <ShopsDashboardView initialViewModel={viewModel} />
      </FrontendLayout>
    );
  } catch (error) {
    console.error("Error fetching shops data:", error);

    return (
      <FrontendLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">เกิดข้อผิดพลาด</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">ไม่สามารถโหลดข้อมูลร้านค้าได้</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        </div>
      </FrontendLayout>
    );
  }
}
