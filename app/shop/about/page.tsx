import { ShopMarketplaceLayout } from "@/src/presentation/components/layouts/shop/marketplace";
import { ShopAboutView } from "@/src/presentation/components/shop/about/ShopAboutView";
import { ShopAboutPresenterFactory } from "@/src/presentation/presenters/shop/about/ShopAboutPresenter";
import { ShopMarketplaceLayoutPresenterFactory } from "@/src/presentation/presenters/shop/marketplace/ShopMarketplaceLayoutPresenter";
import type { Metadata } from "next";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the about page
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "เกี่ยวกับเรา | Shop Queue",
    description:
      "ทำความรู้จักกับ Shop Queue แพลตฟอร์มจัดการคิวร้านค้าที่ทันสมัย ช่วยให้ธุรกิจของคุณเติบโตและลูกค้าได้รับประสบการณ์ที่ดีที่สุด",
    keywords:
      "เกี่ยวกับเรา, Shop Queue, จัดการคิว, ร้านค้า, แพลตฟอร์ม, ธุรกิจ, เทคโนโลยี",
    openGraph: {
      title: "เกี่ยวกับเรา | Shop Queue",
      description:
        "ทำความรู้จักกับ Shop Queue แพลตฟอร์มจัดการคิวร้านค้าที่ทันสมัย",
      type: "website",
    },
  };
}

/**
 * Shop About page - Server Component for SEO optimization
 * About us page with company information and marketplace layout
 */
export default async function ShopAboutPage() {
  try {
    const [layoutPresenter, presenter] = await Promise.all([
      ShopMarketplaceLayoutPresenterFactory.create(),
      ShopAboutPresenterFactory.create(),
    ]);

    const [layoutData, viewModel] = await Promise.all([
      layoutPresenter.getLayoutViewModel(),
      presenter.getViewModel(),
    ]);

    return (
      <ShopMarketplaceLayout layoutData={layoutData}>
        <ShopAboutView initialViewModel={viewModel} />
      </ShopMarketplaceLayout>
    );
  } catch (error) {
    console.error("Error fetching shop about data:", error);

    // Fallback layout data for error state
    const fallbackLayoutData = {
      categories: [],
      navigationLinks: [
        { href: "/shop", label: "ตลาดร้านค้า", order: 1 },
        { href: "/shop/categories", label: "หมวดหมู่", order: 2 },
        { href: "/shop/about", label: "เกี่ยวกับเรา", order: 3 },
        { href: "/shop/contact", label: "ติดต่อเรา", order: 4 },
      ],
      heroTitle: "ค้นหาร้านค้าที่ใช่สำหรับคุณ",
      heroDescription: "สำรวจร้านค้ามากมาย จองคิวและรับบริการได้ทันที",
      searchPlaceholder: "ค้นหาร้านค้า, บริการ, หรือสถานที่...",
    };
    return (
      <ShopMarketplaceLayout layoutData={fallbackLayoutData}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold marketplace-text-primary mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="marketplace-text-secondary mb-4">
              ไม่สามารถโหลดข้อมูลเกี่ยวกับเราได้
            </p>
            <form action="">
              <button
                type="submit"
                className="marketplace-button-primary px-4 py-2 rounded-lg transition-colors"
              >
                ลองใหม่อีกครั้ง
              </button>
            </form>
          </div>
        </div>
      </ShopMarketplaceLayout>
    );
  }
}
