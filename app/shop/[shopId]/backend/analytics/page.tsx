import BackendLayout from "@/src/presentation/components/layouts/shop/backend/BackendLayout";
import { AnalyticsView } from "@/src/presentation/components/shop/backend/AnalyticsView";
import { AnalyticsPresenterFactory } from "@/src/presentation/presenters/shop/backend/AnalyticsPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface AnalyticsPageProps {
  params: Promise<{ shopId: string }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: AnalyticsPageProps): Promise<Metadata> {
  const { shopId } = await params;
  const presenter = await AnalyticsPresenterFactory.create();

  try {
    return presenter.generateMetadata(shopId);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "รายงานและวิเคราะห์ - เจ้าของร้าน | Shop Queue",
      description: "ดูรายงานยอดขาย สถิติการใช้งาน และวิเคราะห์ประสิทธิภาพของร้าน",
    };
  }
}

/**
 * Backend Analytics page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { shopId } = await params;
  const presenter = await AnalyticsPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(shopId);

    return (
      <BackendLayout shopId={shopId}>
        <AnalyticsView viewModel={viewModel} />
      </BackendLayout>
    );
  } catch (error) {
    console.error("Error fetching analytics data:", error);

    // Fallback UI
    return (
      <BackendLayout shopId={shopId}>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลรายงานได้</p>
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
