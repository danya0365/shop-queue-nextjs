import FrontendLayout from "@/src/presentation/components/layouts/front-end/FrontendLayout";
import { ShopCreateView } from "@/src/presentation/components/shop-create/ShopCreateView";
import { ShopCreatePresenterFactory } from "@/src/presentation/presenters/dashboard/shop-create/ShopCreatePresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = await ShopCreatePresenterFactory.create();

  try {
    return presenter.generateMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "สร้างร้านค้าใหม่ | Shop Queue",
      description: "สร้างร้านค้าใหม่และเริ่มใช้งานระบบจัดการคิวที่ทันสมัย",
    };
  }
}

/**
 * Shop Create page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function ShopCreatePage() {
  const presenter = await ShopCreatePresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();

    return <FrontendLayout><ShopCreateView viewModel={viewModel} /></FrontendLayout>;
  } catch (error) {
    console.error("Error fetching shop create data:", error);

    // Fallback UI
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลได้</p>
          <Link
            href="/dashboard"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            กลับแดชบอร์ด
          </Link>
        </div>
      </div>
    );
  }
}
