import FrontendLayout from "@/src/presentation/components/layouts/front-end/FrontendLayout";
import { HelpView } from "@/src/presentation/components/help/HelpView";
import { HelpPresenterFactory } from "@/src/presentation/presenters/help/HelpPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = await HelpPresenterFactory.create();

  try {
    return presenter.generateMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "ศูนย์ช่วยเหลือ | Shop Queue",
      description: "ศูนย์ช่วยเหลือและคำถามที่พบบ่อยสำหรับระบบคิวร้านค้าออนไลน์ Shop Queue",
    };
  }
}

/**
 * Help page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function HelpPage() {
  const presenter = await HelpPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();

    return (
      <FrontendLayout>
        <HelpView viewModel={viewModel} />
      </FrontendLayout>
    );
  } catch (error) {
    console.error("Error fetching help data:", error);

    // Fallback UI
    return (
      <FrontendLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลได้</p>
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
