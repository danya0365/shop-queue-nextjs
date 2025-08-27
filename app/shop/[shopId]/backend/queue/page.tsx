import BackendLayout from "@/src/presentation/components/layouts/shop/backend/BackendLayout";
import { QueueManagementView } from "@/src/presentation/components/shop/backend/QueueManagementView";
import { QueueManagementPresenterFactory } from "@/src/presentation/presenters/shop/backend/QueueManagementPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface QueueManagementPageProps {
  params: { shopId: string };
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: QueueManagementPageProps): Promise<Metadata> {
  const presenter = await QueueManagementPresenterFactory.create();

  try {
    return presenter.generateMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "จัดการคิว | Shop Queue",
      description: "ระบบจัดการคิวลูกค้าและติดตามสถานะการให้บริการ",
    };
  }
}

/**
 * Queue Management page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function QueueManagementPage({ params }: QueueManagementPageProps) {
  const { shopId } = params;
  const presenter = await QueueManagementPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(shopId);

    return (
      <BackendLayout shopId={shopId}>
        <QueueManagementView viewModel={viewModel} />
      </BackendLayout>
    );
  } catch (error) {
    console.error("Error fetching queue management data:", error);

    // Fallback UI
    return (
      <BackendLayout shopId={shopId}>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลคิวได้</p>
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
