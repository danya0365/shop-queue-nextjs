import BackendLayout from "@/src/presentation/components/layouts/backend/BackendLayout";
import { ShopsPresenterFactory } from "@/src/presentation/presenters/backend/shops/ShopsPresenter";
import { ShopsView } from "@/src/presentation/components/backend/shops/ShopsView";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the page
 */
export async function generateMetadata(): Promise<Metadata> {
  try {
    const presenter = await ShopsPresenterFactory.create();
    return presenter.getMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "จัดการร้านค้า | Shop Queue Admin",
      description: "ระบบจัดการร้านค้าสำหรับผู้ดูแลระบบ Shop Queue",
    };
  }
}

/**
 * Shops Management page - Server Component for SEO optimization
 */
export default async function ShopsPage() {
  try {
    const presenter = await ShopsPresenterFactory.create();
    const viewModel = await presenter.getViewModel();

    return (
      <BackendLayout>
        <ShopsView viewModel={viewModel} />
      </BackendLayout>
    );
  } catch (error) {
    console.error("Error fetching shops data:", error);

    return (
      <BackendLayout>
        <div className="min-h-screen backend-bg flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold backend-text mb-2">เกิดข้อผิดพลาด</h1>
            <p className="backend-text-muted mb-4">ไม่สามารถโหลดข้อมูลร้านค้าได้</p>
            <Link
              href="/backend"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              กลับแดชบอร์ด
            </Link>
          </div>
        </div>
      </BackendLayout>
    );
  }
}
