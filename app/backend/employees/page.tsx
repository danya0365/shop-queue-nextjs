import BackendLayout from "@/src/presentation/components/layouts/backend/BackendLayout";
import { EmployeesView } from "@/src/presentation/components/backend/employees/EmployeesView";
import { EmployeesPresenterFactory } from "@/src/presentation/presenters/backend/employees/EmployeesPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = await EmployeesPresenterFactory.create();

  try {
    return presenter.getMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "จัดการพนักงาน | Shop Queue Admin",
      description: "ระบบจัดการพนักงานและบุคลากรสำหรับผู้ดูแลระบบ Shop Queue",
    };
  }
}

/**
 * Employees page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function EmployeesPage() {
  const presenter = await EmployeesPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();

    return (
      <BackendLayout>
        <EmployeesView viewModel={viewModel} />
      </BackendLayout>
    );
  } catch (error) {
    console.error("Error fetching employees data:", error);

    // Fallback UI
    return (
      <BackendLayout>
        <div className="min-h-screen backend-bg flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold backend-text mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="backend-text-muted mb-4">ไม่สามารถโหลดข้อมูลพนักงานได้</p>
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
