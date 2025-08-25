import FrontendLayout from "@/src/presentation/components/layouts/front-end/FrontendLayout";
import { FeaturesView } from "@/src/presentation/components/features/FeaturesView";
import { FeaturesPresenterFactory } from "@/src/presentation/presenters/features/FeaturesPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page that shouldn't be statically optimized
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the features page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = await FeaturesPresenterFactory.create();

  try {
    return presenter.generateMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "ฟีเจอร์ | Shop Queue",
      description: "ค้นพบฟีเจอร์ครบครันของ Shop Queue ระบบจัดการคิวอัจฉริยะ การวิเคราะห์ขั้นสูง และเครื่องมือธุรกิจที่จะช่วยให้ร้านของคุณเติบโต",
    };
  }
}

/**
 * Features page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function FeaturesPage() {
  const presenter = await FeaturesPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();

    return (
      <FrontendLayout>
        <FeaturesView viewModel={viewModel} />
      </FrontendLayout>
    );
  } catch (error) {
    console.error("Error fetching features data:", error);

    // Fallback UI
    return (
      <FrontendLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลฟีเจอร์ได้</p>
            <Link
              href="/"
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
