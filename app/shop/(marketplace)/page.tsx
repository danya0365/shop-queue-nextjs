import { ShopMarketplaceLayout } from "@/src/presentation/components/layouts/shop/marketplace";
import { ShopMarketplaceView } from "@/src/presentation/components/shop/marketplace/ShopMarketplaceView";
import { ShopMarketplaceLayoutPresenterFactory } from "@/src/presentation/presenters/shop/marketplace/ShopMarketplaceLayoutPresenter";
import { ShopMarketplacePresenterFactory, type ShopMarketplaceViewParams } from "@/src/presentation/presenters/shop/marketplace/ShopMarketplacePresenter";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/**
 * Generate metadata for the marketplace page
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "ตลาดร้านค้า | Shop Queue",
    description:
      "ค้นหาและสำรวจร้านค้ามากมายทั่วไทย - จองคิวออนไลน์ รับบริการได้ทันที ไม่ต้องรอนาน",
    keywords:
      "ตลาดร้านค้า, จองคิว, ร้านอาหาร, ร้านเสื้อผ้า, ร้านเครื่องสำอาง, ช้อปปิ้ง, บริการออนไลน์",
    openGraph: {
      title: "ตลาดร้านค้า | Shop Queue",
      description: "ค้นหาและสำรวจร้านค้ามากมายทั่วไทย",
      type: "website",
    },
  };
}

/**
 * Shop Marketplace page - Server Component for SEO optimization
 * Landing page for customers to browse and discover shops
 */
interface ShopMarketplacePageProps {
  searchParams: {
    q?: string;
    category?: string;
    location?: string;
    page?: string;
  };
}

export default async function ShopMarketplacePage({ searchParams }: ShopMarketplacePageProps) {
  try {
    const [layoutPresenter, presenter] = await Promise.all([
      ShopMarketplaceLayoutPresenterFactory.create(),
      ShopMarketplacePresenterFactory.create(),
    ]);

    const [layoutData, viewModel] = await Promise.all([
      layoutPresenter.getLayoutViewModel(),
      presenter.getViewModel({
        searchQuery: searchParams.q || "",
        category: searchParams.category || null,
        location: searchParams.location || null,
        page: searchParams.page ? parseInt(searchParams.page) : 1,
      } as ShopMarketplaceViewParams),
    ]);

    return (
      <ShopMarketplaceLayout 
        layoutData={layoutData} 
        showHero={true}
        searchQuery={searchParams.q}
        onSearch={(query) => {
          // Handle search by redirecting with search params
          const params = new URLSearchParams();
          if (query) params.set('q', query);
          redirect(`/shop?${params.toString()}`);
        }}
        onCategoryClick={(category) => {
          // Handle category click by redirecting with category param
          const params = new URLSearchParams(searchParams);
          params.set('category', category);
          redirect(`/shop?${params.toString()}`);
        }}
      >
        <ShopMarketplaceView initialViewModel={viewModel} />
      </ShopMarketplaceLayout>
    );
  } catch (error) {
    console.error("Error fetching shops marketplace data:", error);

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
              ไม่สามารถโหลดข้อมูลร้านค้าได้
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
