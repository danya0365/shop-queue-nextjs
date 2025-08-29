import BackendLayout from "@/src/presentation/components/layouts/backend/BackendLayout";
import { BackendDashboardView } from "@/src/presentation/components/backend/dashboard/BackendDashboardView";
import { BackendDashboardPresenterFactory } from "@/src/presentation/presenters/backend/dashboard/BackendDashboardPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = await BackendDashboardPresenterFactory.create();

  try {
    return presenter.generateMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "แดชบอร์ด | Shop Queue Admin",
      description: "ระบบจัดการแดชบอร์ดสำหรับผู้ดูแลระบบ Shop Queue",
    };
  }
}

/**
 * Backend Dashboard page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function BackendDashboardPage() {
  const presenter = await BackendDashboardPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();

    return (
      <BackendLayout>
        <BackendDashboardView viewModel={viewModel} />
      </BackendLayout>
    );
  } catch (error) {
    console.error("Error fetching backend dashboard data:", error);

    // Fallback UI
    return (
      <BackendLayout>
        <div className="min-h-screen backend-bg flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold backend-text mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="backend-text-muted mb-4">ไม่สามารถโหลดข้อมูลแดชบอร์ดได้</p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </BackendLayout>
    );
  }
}
