import BackendLayout from "@/src/presentation/components/layouts/shop/backend/BackendLayout";
import { PaymentsView } from "@/src/presentation/components/shop/backend/PaymentsView";
import { PaymentsPresenterFactory } from "@/src/presentation/presenters/shop/backend/PaymentsPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface PaymentsPageProps {
  params: Promise<{ shopId: string }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({
  params,
}: PaymentsPageProps): Promise<Metadata> {
  const { shopId } = await params;
  const presenter = await PaymentsPresenterFactory.create();

  try {
    return presenter.generateMetadata(shopId);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "จัดการการชำระเงิน | Shop Queue",
      description: "ระบบจัดการการชำระเงินและติดตามสถานะการชำระเงินของลูกค้า",
    };
  }
}

/**
 * Payments Management page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function PaymentsPage({ params }: PaymentsPageProps) {
  const { shopId } = await params;
  const presenter = await PaymentsPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(shopId);
    const shopInfo = await presenter.getShopInfo(shopId);
    return (
      <BackendLayout shop={shopInfo}>
        <PaymentsView shopId={shopId} initialViewModel={viewModel} />
      </BackendLayout>
    );
  } catch (error) {
    console.error("Error fetching payments data:", error);

    // Fallback UI
    return (
      <BackendLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลการชำระเงินได้</p>
            <Link
              href={`/shop/${shopId}/backend`}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              กลับแดชบอร์ด
            </Link>
          </div>
        </div>
      </BackendLayout>
    );
  }
}
