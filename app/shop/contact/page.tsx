import { ShopMarketplaceLayout } from "@/src/presentation/components/layouts/shop/marketplace";
import { ShopContactView } from "@/src/presentation/components/shop/contact/ShopContactView";
import { ShopContactPresenterFactory } from "@/src/presentation/presenters/shop/contact/ShopContactPresenter";
import { ShopMarketplaceLayoutPresenterFactory } from "@/src/presentation/presenters/shop/marketplace/ShopMarketplaceLayoutPresenter";
import type { Metadata } from "next";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the contact page
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ติดต่อเรา | Shop Queue",
    description:
      "ติดต่อทีมงาน Shop Queue สำหรับการสนับสนุน คำถาม หรือข้อเสนอแนะ เราพร้อมให้บริการและช่วยเหลือคุณตลอด 24 ชั่วโมง",
    keywords:
      "ติดต่อเรา, Shop Queue, สนับสนุน, ช่วยเหลือ, คำถาม, ข้อเสนอแนะ, บริการลูกค้า",
    openGraph: {
      title: "ติดต่อเรา | Shop Queue",
      description:
        "ติดต่อทีมงาน Shop Queue สำหรับการสนับสนุน คำถาม หรือข้อเสนอแนะ",
      type: "website",
    },
  };
}

/**
 * Shop Contact page - Server Component for SEO optimization
 * Contact us page with contact form and company information
 */
export default async function ShopContactPage() {
  try {
    const [layoutPresenter, presenter] = await Promise.all([
      ShopMarketplaceLayoutPresenterFactory.create(),
      ShopContactPresenterFactory.create(),
    ]);

    const [layoutData, viewModel] = await Promise.all([
      layoutPresenter.getLayoutViewModel(),
      presenter.getViewModel(),
    ]);

    return (
      <ShopMarketplaceLayout layoutData={layoutData}>
        <ShopContactView initialViewModel={viewModel} />
      </ShopMarketplaceLayout>
    );
  } catch (error) {
    console.error("Error fetching shop contact data:", error);

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
              ไม่สามารถโหลดข้อมูลติดต่อได้
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
