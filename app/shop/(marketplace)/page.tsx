import FrontendLayout from "@/src/presentation/components/layouts/shop/frontend/FrontendLayout";
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
      <FrontendLayout>
        <ShopMarketplaceView initialViewModel={viewModel} />
      </FrontendLayout>
    );
  } catch (error) {
    console.error("Error fetching shops marketplace data:", error);

    return (
      <FrontendLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              ไม่สามารถโหลดข้อมูลร้านค้าได้
            </p>
            <form action="">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ลองใหม่อีกครั้ง
              </button>
            </form>
          </div>
        </div>
      </FrontendLayout>
    );
  }
}
