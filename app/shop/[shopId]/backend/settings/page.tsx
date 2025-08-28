import BackendLayout from "@/src/presentation/components/layouts/shop/backend/BackendLayout";
import { SettingsView } from "@/src/presentation/components/shop/backend/SettingsView";
import { SettingsPresenterFactory } from "@/src/presentation/presenters/shop/backend/SettingsPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface SettingsPageProps {
  params: Promise<{ shopId: string }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: SettingsPageProps): Promise<Metadata> {
  const { shopId } = await params;
  const presenter = await SettingsPresenterFactory.create();

  try {
    return presenter.generateMetadata(shopId);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "ตั้งค่าระบบ - เจ้าของร้าน | Shop Queue",
      description: "จัดการการตั้งค่าร้าน ระบบคิว การชำระเงิน และการแจ้งเตือน",
    };
  }
}

/**
 * Backend Settings page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function SettingsPage({ params }: SettingsPageProps) {
  const { shopId } = await params;
  const presenter = await SettingsPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(shopId);

    return (
      <BackendLayout shopId={shopId}>
        <SettingsView viewModel={viewModel} />
      </BackendLayout>
    );
  } catch (error) {
    console.error("Error fetching settings data:", error);

    // Fallback UI
    return (
      <BackendLayout shopId={shopId}>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลการตั้งค่าได้</p>
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
