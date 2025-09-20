import FrontendLayout from "@/src/presentation/components/layouts/shop/frontend/FrontendLayout";
import { CustomerRewardsView } from "@/src/presentation/components/shop/frontend/CustomerRewardsView";
import { CustomerRewardsPresenterFactory } from "@/src/presentation/presenters/shop/frontend/CustomerRewardsPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface CustomerRewardsPageProps {
  params: Promise<{ shopId: string }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({
  params,
}: CustomerRewardsPageProps): Promise<Metadata> {
  const { shopId } = await params;
  const presenter = await CustomerRewardsPresenterFactory.create();

  try {
    return presenter.generateMetadata(shopId);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "รางวัลและแต้มสะสม - ลูกค้า | Shop Queue",
      description: "ดูแต้มสะสม แลกของรางวัล และติดตามสิทธิประโยชน์ต่างๆ",
    };
  }
}

/**
 * Customer Rewards page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function CustomerRewardsPage({
  params,
}: CustomerRewardsPageProps) {
  const { shopId } = await params;
  const presenter = await CustomerRewardsPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(shopId);
    const shopInfo = await presenter.getShopInfo(shopId);
    return (
      <FrontendLayout shop={shopInfo}>
        <CustomerRewardsView shopId={shopId} initialViewModel={viewModel} />
      </FrontendLayout>
    );
  } catch (error) {
    console.error("Error fetching customer rewards data:", error);

    // Fallback UI
    return (
      <FrontendLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลรางวัลได้</p>
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
