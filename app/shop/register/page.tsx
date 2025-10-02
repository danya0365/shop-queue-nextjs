import { CustomerRegisterView } from "@/src/presentation/components/auth/CustomerRegisterView";
import { ShopMarketplaceLayout } from "@/src/presentation/components/layouts/shop/marketplace";
import { ShopMarketplaceLayoutPresenterFactory } from "@/src/presentation/presenters/shop/marketplace/ShopMarketplaceLayoutPresenter";

// Tell Next.js this is a dynamic page
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function CustomerRegisterPage() {
  const presenter = await ShopMarketplaceLayoutPresenterFactory.create();
  const layoutData = await presenter.getLayoutViewModel();

  return (
    <ShopMarketplaceLayout layoutData={layoutData}>
      <CustomerRegisterView />
    </ShopMarketplaceLayout>
  );
}
