import BackendLayout from "@/src/presentation/components/layouts/shop/backend/BackendLayout";
import { OpeningHoursView } from "@/src/presentation/components/shop/backend/OpeningHoursView";
import { OpeningHoursPresenterFactory } from "@/src/presentation/presenters/shop/backend/OpeningHoursPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface OpeningHoursPageProps {
  params: Promise<{ shopId: string }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({
  params,
}: OpeningHoursPageProps): Promise<Metadata> {
  const { shopId } = await params;
  const presenter = await OpeningHoursPresenterFactory.create();

  try {
    return presenter.generateMetadata(shopId);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "จัดการเวลาเปิด-ปิด - เจ้าของร้าน | Shop Queue",
      description: "จัดการเวลาทำการของร้าน กำหนดวันเวลาเปิด-ปิด และเวลาพักเบรก",
    };
  }
}

/**
 * Backend Opening Hours page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function OpeningHoursPage({
  params,
}: OpeningHoursPageProps) {
  const { shopId } = await params;
  const presenter = await OpeningHoursPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(shopId);
    const shopInfo = await presenter.getShopInfo(shopId);
    return (
      <BackendLayout shop={shopInfo}>
        <OpeningHoursView viewModel={viewModel} />
      </BackendLayout>
    );
  } catch (error) {
    console.error("Error fetching opening hours data:", error);

    // Fallback UI
    return (
      <BackendLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลเวลาทำการได้</p>
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
