import { ShopMarketplaceLayout } from "@/src/presentation/components/layouts/shop/marketplace";
import { ShopSearchView } from "@/src/presentation/components/shop/search/ShopSearchView";
import { ShopMarketplaceLayoutPresenterFactory } from "@/src/presentation/presenters/shop/marketplace/ShopMarketplaceLayoutPresenter";
import { ShopSearchPresenterFactory } from "@/src/presentation/presenters/shop/search/ShopSearchPresenter";
import type { Metadata } from "next";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Shop Search page - Server Component for SEO optimization
 * Dedicated search page for customers to search and filter shops
 */
interface ShopSearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    location?: string;
    page?: string;
  }>;
}

/**
 * Generate metadata for the search page
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ค้นหาร้านค้า | Shop Queue",
    description:
      "ค้นหาร้านค้าที่คุณต้องการ - กรองตามหมวดหมู่ สถานที่ คะแนน และอื่นๆ จองคิวออนไลน์ได้ทันที",
    keywords:
      "ค้นหาร้านค้า, กรองร้านค้า, จองคิว, ร้านอาหาร, ร้านเสื้อผ้า, ร้านเครื่องสำอาง, ช้อปปิ้ง, บริการออนไลน์",
    openGraph: {
      title: "ค้นหาร้านค้า | Shop Queue",
      description: "ค้นหาร้านค้าที่คุณต้องการ - กรองและจองคิวได้ทันที",
      type: "website",
    },
  };
}

export default async function ShopSearchPage({
  searchParams,
}: ShopSearchPageProps) {
  const params = await searchParams;

  try {
    const [layoutPresenter, presenter] = await Promise.all([
      ShopMarketplaceLayoutPresenterFactory.create(),
      ShopSearchPresenterFactory.create(),
    ]);

    const [layoutData, viewModel] = await Promise.all([
      layoutPresenter.getLayoutViewModel(),
      presenter.getViewModel({
        searchQuery: params.q || "",
        category: params.category || null,
        location: params.location || null,
        page: params.page ? parseInt(params.page) : 1,
      }),
    ]);

    return (
      <ShopMarketplaceLayout
        layoutData={layoutData}
        showHero={false}
        searchQuery={params.q}
      >
        <ShopSearchView initialViewModel={viewModel} />
      </ShopMarketplaceLayout>
    );
  } catch (error) {
    console.error("Error fetching shop search data:", error);

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
              ไม่สามารถโหลดข้อมูลการค้นหาได้
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
