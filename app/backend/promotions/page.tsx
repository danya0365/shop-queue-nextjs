import BackendLayout from "@/src/presentation/components/layouts/backend/BackendLayout";
import { PromotionsView } from "@/src/presentation/components/backend/promotions/PromotionsView";
import { PromotionsPresenterFactory } from "@/src/presentation/presenters/backend/promotions/PromotionsPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = await PromotionsPresenterFactory.create();

  try {
    return presenter.getMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "จัดการโปรโมชั่น | Shop Queue Admin",
      description: "ระบบจัดการโปรโมชั่นและติดตามสถิติการใช้งานสำหรับผู้ดูแลระบบ Shop Queue",
    };
  }
}

/**
 * Promotions page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function PromotionsPage() {
  const presenter = await PromotionsPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();

    return (
      <BackendLayout>
        <PromotionsView viewModel={viewModel} />
      </BackendLayout>
    );
  } catch (error) {
    console.error("Error fetching promotions data:", error);

    // Fallback UI
    return (
      <BackendLayout>
        <div className="min-h-screen backend-bg flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold backend-text mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="backend-text-muted mb-4">ไม่สามารถโหลดข้อมูลโปรโมชั่นได้</p>
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
