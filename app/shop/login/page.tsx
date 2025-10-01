import { ShopMarketplaceLayout } from "@/src/presentation/components/layouts/shop/marketplace";
import { CustomerLoginView } from "@/src/presentation/components/auth/CustomerLoginView";
import { ShopMarketplaceLayoutPresenterFactory } from "@/src/presentation/presenters/shop/marketplace/ShopMarketplaceLayoutPresenter";

export default async function CustomerLoginPage() {
  const presenter = await ShopMarketplaceLayoutPresenterFactory.create();
  const layoutData = await presenter.getLayoutViewModel();

  return (
    <ShopMarketplaceLayout layoutData={layoutData}>
      <CustomerLoginView />
    </ShopMarketplaceLayout>
  );
}
