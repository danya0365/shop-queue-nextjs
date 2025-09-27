import { ShopMarketplaceLayout } from "@/src/presentation/components/layouts/shop/marketplace";
import { ShopMarketplaceView } from "@/src/presentation/components/shop/marketplace/ShopMarketplaceView";
import { ShopMarketplacePresenterFactory } from "@/src/presentation/presenters/shop/marketplace/ShopMarketplacePresenter";

/**
 * Shop Marketplace page - Server Component for SEO optimization
 * Landing page for customers to browse and discover shops
 */
export default async function ShopMarketplacePage() {
  try {
    const presenter = await ShopMarketplacePresenterFactory.create();
    const viewModel = await presenter.getViewModel();

    return (
      <ShopMarketplaceLayout showHero={true}>
        <ShopMarketplaceView initialViewModel={viewModel} />
      </ShopMarketplaceLayout>
    );
  } catch (error) {
    console.error("Error fetching shops marketplace data:", error);

    return (
      <ShopMarketplaceLayout>
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
