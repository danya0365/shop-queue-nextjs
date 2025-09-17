import BackendLayout from "@/src/presentation/components/layouts/shop/backend/BackendLayout";
import { BackendDashboardView } from "@/src/presentation/components/shop/backend/dashboard/BackendDashboardView";
import { BackendDashboardPresenterFactory } from "@/src/presentation/presenters/shop/backend/DashboardPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface BackendDashboardPageProps {
  params: Promise<{ shopId: string }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({
  params,
}: BackendDashboardPageProps): Promise<Metadata> {
  const { shopId } = await params;
  const presenter = await BackendDashboardPresenterFactory.create();

  try {
    return presenter.generateMetadata(shopId);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "แดชบอร์ดจัดการร้าน | Shop Queue",
      description: "ระบบจัดการร้านค้าและติดตามสถิติการให้บริการแบบเรียลไทม์",
    };
  }
}

/**
 * Backend Dashboard page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function BackendDashboardPage({
  params,
}: BackendDashboardPageProps) {
  const { shopId } = await params;
  const presenter = await BackendDashboardPresenterFactory.create();

  try {
    // Get view model from presenter
    const initialViewModel = await presenter.getViewModel(shopId);
    const shopInfo = await presenter.getShopInfo(shopId);
    return (
      <BackendLayout shop={shopInfo}>
        <BackendDashboardView
          initialViewModel={initialViewModel}
          shopId={shopId}
        />
      </BackendLayout>
    );
  } catch (error) {
    console.error("Error fetching backend dashboard data:", error);

    // Fallback UI
    return (
      <BackendLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลแดชบอร์ดได้</p>
            <Link
              href="/"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </BackendLayout>
    );
  }
}
