import BackendLayout from "@/src/presentation/components/layouts/shop/backend/BackendLayout";
import { DepartmentsView } from "@/src/presentation/components/shop/backend/department/DepartmentsView";
import { DepartmentsPresenterFactory } from "@/src/presentation/presenters/shop/backend/DepartmentsPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface DepartmentsPageProps {
  params: Promise<{ shopId: string }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({
  params,
}: DepartmentsPageProps): Promise<Metadata> {
  const { shopId } = await params;
  const presenter = await DepartmentsPresenterFactory.create();

  try {
    return presenter.generateMetadata(shopId);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "จัดการแผนก - เจ้าของร้าน | Shop Queue",
      description: "จัดการแผนกต่างๆ ในร้าน เพิ่ม แก้ไข และจัดสรรพนักงาน",
    };
  }
}

/**
 * Backend Departments page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function DepartmentsPage({
  params,
}: DepartmentsPageProps) {
  const { shopId } = await params;
  const presenter = await DepartmentsPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(shopId);
    const shopInfo = await presenter.getShopInfo(shopId);
    return (
      <BackendLayout shop={shopInfo}>
        <DepartmentsView initialViewModel={viewModel} shopId={shopId} />
      </BackendLayout>
    );
  } catch (error) {
    console.error("Error fetching departments data:", error);

    // Fallback UI
    return (
      <BackendLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลแผนกได้</p>
            <Link
              href={`/shop/${shopId}/backend`}
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
