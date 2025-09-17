import BackendLayout from "@/src/presentation/components/layouts/shop/backend/BackendLayout";
import { RewardsView } from "@/src/presentation/components/shop/backend/reward/RewardsView";
import { RewardsPresenterFactory } from "@/src/presentation/presenters/shop/backend/RewardsPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface RewardsPageProps {
  params: Promise<{ shopId: string }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({
  params,
}: RewardsPageProps): Promise<Metadata> {
  const { shopId } = await params;
  const presenter = await RewardsPresenterFactory.create();

  try {
    return presenter.generateMetadata(shopId);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "จัดการรางวัล - เจ้าของร้าน | Shop Queue",
      description: "จัดการรางวัลและแต้มสะสม สร้างโปรแกรมสมาชิกที่น่าสนใจ",
    };
  }
}

/**
 * Backend Rewards page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function RewardsPage({ params }: RewardsPageProps) {
  const { shopId } = await params;
  const presenter = await RewardsPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(shopId);
    const shopInfo = await presenter.getShopInfo(shopId);
    return (
      <BackendLayout shop={shopInfo}>
        <RewardsView shopId={shopId} initialViewModel={viewModel} />
      </BackendLayout>
    );
  } catch (error) {
    console.error("Error fetching rewards data:", error);

    // Fallback UI
    return (
      <BackendLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลรางวัลได้</p>
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
