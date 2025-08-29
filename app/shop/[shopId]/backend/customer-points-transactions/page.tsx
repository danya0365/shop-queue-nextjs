import BackendLayout from "@/src/presentation/components/layouts/shop/backend/BackendLayout";
import { CustomerPointsTransactionsView } from "@/src/presentation/components/shop/backend/CustomerPointsTransactionsView";
import { CustomerPointsTransactionsPresenterFactory } from "@/src/presentation/presenters/shop/backend/CustomerPointsTransactionsPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface CustomerPointsTransactionsPageProps {
  params: Promise<{ shopId: string }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: CustomerPointsTransactionsPageProps): Promise<Metadata> {
  const { shopId } = await params;
  const presenter = await CustomerPointsTransactionsPresenterFactory.create();

  try {
    return presenter.generateMetadata(shopId);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "ประวัติการใช้แต้ม - เจ้าของร้าน | Shop Queue",
      description: "ดูประวัติการทำรายการแต้มลูกค้า การได้รับแต้ม การใช้แต้ม และสถิติการใช้งาน",
    };
  }
}

/**
 * Backend Customer Points Transactions page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function CustomerPointsTransactionsPage({ params }: CustomerPointsTransactionsPageProps) {
  const { shopId } = await params;
  const presenter = await CustomerPointsTransactionsPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(shopId);

    return (
      <BackendLayout shopId={shopId}>
        <CustomerPointsTransactionsView viewModel={viewModel} />
      </BackendLayout>
    );
  } catch (error) {
    console.error("Error fetching customer points transactions data:", error);

    // Fallback UI
    return (
      <BackendLayout shopId={shopId}>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลประวัติการใช้แต้มได้</p>
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
