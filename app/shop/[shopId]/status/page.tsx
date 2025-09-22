import FrontendLayout from "@/src/presentation/components/layouts/shop/frontend/FrontendLayout";
import { CustomerQueueStatusView } from "@/src/presentation/components/shop/frontend/CustomerQueueStatusView";
import { CustomerQueueStatusPresenterFactory } from "@/src/presentation/presenters/shop/frontend/CustomerQueueStatusPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface QueueStatusPageProps {
  params: Promise<{ shopId: string }>;
  searchParams: Promise<{ queue?: string }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({
  params,
}: QueueStatusPageProps): Promise<Metadata> {
  const { shopId } = await params;
  const presenter = await CustomerQueueStatusPresenterFactory.create();

  try {
    return presenter.generateMetadata(shopId);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "ติดตามสถานะคิว | Shop Queue",
      description: "ติดตามสถานะคิวของคุณและรับการแจ้งเตือนเมื่อใกล้ถึงคิว",
    };
  }
}

/**
 * Queue Status page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function CustomerQueueStatusPage({
  params,
  searchParams,
}: QueueStatusPageProps) {
  const { shopId } = await params;
  const { queue } = await searchParams;
  const presenter = await CustomerQueueStatusPresenterFactory.create();

  try {
    // Note: The 'queue' parameter from URL is still the queue number for user-friendly URLs
    // The presenter will handle converting queue number to queue ID internally if needed
    const viewModel = await presenter.getViewModel(shopId, queue);
    const shopInfo = await presenter.getShopInfo(shopId);
    return (
      <FrontendLayout shop={shopInfo}>
        <CustomerQueueStatusView initialViewModel={viewModel} shopId={shopId} />
      </FrontendLayout>
    );
  } catch (error) {
    console.error("Error fetching queue status data:", error);

    // Fallback UI
    return (
      <FrontendLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลสถานะคิวได้</p>
            <Link
              href={`/shop/${shopId}`}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </FrontendLayout>
    );
  }
}
