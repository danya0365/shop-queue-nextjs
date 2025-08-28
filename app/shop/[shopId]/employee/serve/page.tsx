import EmployeeLayout from "@/src/presentation/components/layouts/shop/employee/EmployeeLayout";
import { EmployeeServeView } from "@/src/presentation/components/shop/employee/EmployeeServeView";
import { EmployeeServePresenterFactory } from "@/src/presentation/presenters/shop/employee/EmployeeServePresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface EmployeeServePageProps {
  params: Promise<{ shopId: string }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: EmployeeServePageProps): Promise<Metadata> {
  const { shopId } = await params;
  const presenter = await EmployeeServePresenterFactory.create();

  try {
    return presenter.generateMetadata(shopId);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "ให้บริการ - พนักงาน | Shop Queue",
      description: "หน้าจอการให้บริการและติดตามความคืบหน้าของคิว",
    };
  }
}

/**
 * Employee Serve page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function EmployeeServePage({ params }: EmployeeServePageProps) {
  const { shopId } = await params;
  const presenter = await EmployeeServePresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(shopId);

    return (
      <EmployeeLayout shopId={shopId}>
        <EmployeeServeView viewModel={viewModel} />
      </EmployeeLayout>
    );
  } catch (error) {
    console.error("Error fetching employee serve data:", error);

    // Fallback UI
    return (
      <EmployeeLayout shopId={shopId}>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลการให้บริการได้</p>
            <Link
              href={`/shop/${shopId}/employee`}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </EmployeeLayout>
    );
  }
}
