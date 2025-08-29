import BackendLayout from "@/src/presentation/components/layouts/backend/BackendLayout";
import { CustomersView } from "@/src/presentation/components/backend/customers/CustomersView";
import { CustomersPresenterFactory } from "@/src/presentation/presenters/backend/customers/CustomersPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = await CustomersPresenterFactory.create();

  try {
    return presenter.getMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "จัดการลูกค้า | Shop Queue Admin",
      description: "ระบบจัดการลูกค้าและสมาชิกสำหรับผู้ดูแลระบบ Shop Queue",
    };
  }
}

/**
 * Customers page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function CustomersPage() {
  const presenter = await CustomersPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();

    return (
      <BackendLayout>
        <CustomersView viewModel={viewModel} />
      </BackendLayout>
    );
  } catch (error) {
    console.error("Error fetching customers data:", error);

    // Fallback UI
    return (
      <BackendLayout>
        <div className="min-h-screen backend-bg flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold backend-text mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="backend-text-muted mb-4">ไม่สามารถโหลดข้อมูลลูกค้าได้</p>
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
