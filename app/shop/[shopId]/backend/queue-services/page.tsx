import BackendLayout from "@/src/presentation/components/layouts/shop/backend/BackendLayout";
import { QueueServicesView } from "@/src/presentation/components/shop/backend/QueueServicesView";
import { QueueServicesPresenterFactory } from "@/src/presentation/presenters/shop/backend/QueueServicesPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface QueueServicesPageProps {
  params: Promise<{ shopId: string }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: QueueServicesPageProps): Promise<Metadata> {
  const { shopId } = await params;
  const presenter = await QueueServicesPresenterFactory.create();

  try {
    return presenter.generateMetadata(shopId);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "จัดการคิวบริการ - เจ้าของร้าน | Shop Queue",
      description: "จัดการคิวบริการของร้าน ตั้งค่าความจุ เวลารอ และสถานะบริการต่างๆ",
    };
  }
}

/**
 * Backend Queue Services page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function QueueServicesPage({ params }: QueueServicesPageProps) {
  const { shopId } = await params;
  const presenter = await QueueServicesPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(shopId);

    return (
      <BackendLayout shopId={shopId}>
        <QueueServicesView viewModel={viewModel} />
      </BackendLayout>
    );
  } catch (error) {
    console.error("Error fetching queue services data:", error);

    // Fallback UI
    return (
      <BackendLayout shopId={shopId}>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลคิวบริการได้</p>
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
