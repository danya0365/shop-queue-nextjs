import FrontendLayout from "@/src/presentation/components/layouts/shop/frontend/FrontendLayout";
import { CustomerHistoryView } from "@/src/presentation/components/shop/frontend/CustomerHistoryView";
import { CustomerHistoryPresenterFactory } from "@/src/presentation/presenters/shop/frontend/CustomerHistoryPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface CustomerHistoryPageProps {
  params: { shopId: string };
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: CustomerHistoryPageProps): Promise<Metadata> {
  const presenter = await CustomerHistoryPresenterFactory.create();

  try {
    return presenter.generateMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "ประวัติการใช้บริการ - ลูกค้า | Shop Queue",
      description: "ดูประวัติการจองคิวและการใช้บริการของคุณ",
    };
  }
}

/**
 * Customer History page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function CustomerHistoryPage({ params }: CustomerHistoryPageProps) {
  const { shopId } = params;
  const presenter = await CustomerHistoryPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(shopId);

    return (
      <FrontendLayout shopId={shopId}>
        <CustomerHistoryView viewModel={viewModel} />
      </FrontendLayout>
    );
  } catch (error) {
    console.error("Error fetching customer history data:", error);

    // Fallback UI
    return (
      <FrontendLayout shopId={shopId}>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดประวัติการใช้บริการได้</p>
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
