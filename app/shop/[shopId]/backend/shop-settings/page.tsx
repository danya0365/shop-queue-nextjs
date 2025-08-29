import BackendLayout from "@/src/presentation/components/layouts/shop/backend/BackendLayout";
import { ShopSettingsView } from "@/src/presentation/components/shop/backend/ShopSettingsView";
import { ShopSettingsPresenterFactory } from "@/src/presentation/presenters/shop/backend/ShopSettingsPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface ShopSettingsPageProps {
  params: Promise<{ shopId: string }>;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: ShopSettingsPageProps): Promise<Metadata> {
  const { shopId } = await params;
  const presenter = await ShopSettingsPresenterFactory.create();

  try {
    return presenter.generateMetadata(shopId);
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "ตั้งค่าร้าน - เจ้าของร้าน | Shop Queue",
      description: "จัดการการตั้งค่าร้าน ข้อมูลพื้นฐาน ระบบคิว การชำระเงิน และฟีเจอร์ต่างๆ",
    };
  }
}

/**
 * Backend Shop Settings page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function ShopSettingsPage({ params }: ShopSettingsPageProps) {
  const { shopId } = await params;
  const presenter = await ShopSettingsPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel(shopId);

    return (
      <BackendLayout shopId={shopId}>
        <ShopSettingsView viewModel={viewModel} />
      </BackendLayout>
    );
  } catch (error) {
    console.error("Error fetching shop settings data:", error);

    // Fallback UI
    return (
      <BackendLayout shopId={shopId}>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลการตั้งค่าร้านได้</p>
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
