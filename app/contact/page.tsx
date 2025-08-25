import FrontendLayout from "@/src/presentation/components/layouts/front-end/FrontendLayout";
import { ContactView } from "@/src/presentation/components/contact/ContactView";
import { ContactPresenterFactory } from "@/src/presentation/presenters/contact/ContactPresenter";
import type { Metadata } from "next";
import Link from "next/link";

// Tell Next.js this is a dynamic page that shouldn't be statically optimized
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the contact page
 */
export async function generateMetadata(): Promise<Metadata> {
  const presenter = await ContactPresenterFactory.create();

  try {
    return presenter.generateMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata
    return {
      title: "ติดต่อเรา | Shop Queue",
      description: "ติดต่อทีมงาน Shop Queue สำหรับการสนับสนุน คำถาม หรือขอข้อมูลเพิ่มเติม พร้อมให้บริการทุกวัน",
    };
  }
}

/**
 * Contact page - Server Component for SEO optimization
 * Uses presenter pattern following Clean Architecture
 */
export default async function ContactPage() {
  const presenter = await ContactPresenterFactory.create();

  try {
    // Get view model from presenter
    const viewModel = await presenter.getViewModel();

    return (
      <FrontendLayout>
        <ContactView viewModel={viewModel} />
      </FrontendLayout>
    );
  } catch (error) {
    console.error("Error fetching contact data:", error);

    // Fallback UI
    return (
      <FrontendLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลติดต่อได้</p>
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
