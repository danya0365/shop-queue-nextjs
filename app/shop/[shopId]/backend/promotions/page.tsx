import BackendLayout from "@/src/presentation/components/layouts/shop/backend/BackendLayout";
import { PromotionsView } from "@/src/presentation/components/shop/backend/PromotionsView";
import { PromotionsPresenterFactory } from "@/src/presentation/presenters/shop/backend/PromotionsPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface PromotionsPageProps {
  params: Promise<{ shopId: string }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({
  params,
}: PromotionsPageProps): Promise<Metadata> {
  const { shopId } = await params;
  const presenter = await PromotionsPresenterFactory.create();

  try {
    return presenter.generateMetadata(shopId);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "จัดการโปรโมชั่น - เจ้าของร้าน | Shop Queue",
      description:
        "จัดการโปรโมชั่นและส่วนลด สร้างแคมเปญส่งเสริมการขายที่น่าสนใจ",
    };
  }
}

/**
 * Backend Promotions page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function PromotionsPage({ params }: PromotionsPageProps) {
  const { shopId } = await params;
  const presenter = await PromotionsPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(shopId);
    const shopInfo = await presenter.getShopInfo(shopId);
    return (
      <BackendLayout shop={shopInfo}>
        <PromotionsView shopId={shopId} initialViewModel={viewModel} />
      </BackendLayout>
    );
  } catch (error) {
    console.error("Error fetching promotions data:", error);

    // Fallback UI
    return (
      <BackendLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลโปรโมชั่นได้</p>
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
