import { ShopMarketplaceLayout } from "@/src/presentation/components/layouts/shop/marketplace";
import { ShopCategoriesView } from "@/src/presentation/components/shop/categories/ShopCategoriesView";
import { ShopCategoriesPresenterFactory } from "@/src/presentation/presenters/shop/categories/ShopCategoriesPresenter";
import { ShopMarketplaceLayoutPresenterFactory } from "@/src/presentation/presenters/shop/marketplace/ShopMarketplaceLayoutPresenter";
import type { Metadata } from "next";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the categories page
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "หมวดหมู่ร้านค้า | Shop Queue",
    description:
      "เลือกดูร้านค้าตามหมวดหมู่ที่คุณสนใจ - ร้านอาหาร ร้านเสื้อผ้า ร้านเครื่องสำอาง และอื่นๆ อีกมากมาย",
    keywords:
      "หมวดหมู่, ร้านค้า, ร้านอาหาร, ร้านเสื้อผ้า, ร้านเครื่องสำอาง, ช้อปปิ้ง",
    openGraph: {
      title: "หมวดหมู่ร้านค้า | Shop Queue",
      description: "เลือกดูร้านค้าตามหมวดหมู่ที่คุณสนใจ",
      type: "website",
    },
  };
}

/**
 * Shop Categories page - Server Component for SEO optimization
 * Browse shops by categories with marketplace layout
 */
export default async function ShopCategoriesPage() {
  try {
    const [presenter, layoutPresenter] = await Promise.all([
      ShopCategoriesPresenterFactory.create(),
      ShopMarketplaceLayoutPresenterFactory.create(),
    ]);

    const [layoutData, viewModel] = await Promise.all([
      layoutPresenter.getLayoutViewModel(),
      presenter.getViewModel(),
    ]);

    return (
      <ShopMarketplaceLayout layoutData={layoutData}>
        <ShopCategoriesView initialViewModel={viewModel} />
      </ShopMarketplaceLayout>
    );
  } catch (error) {
    console.error("Error fetching shop categories data:", error);
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
              ไม่สามารถโหลดข้อมูลหมวดหมู่ร้านค้าได้
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
