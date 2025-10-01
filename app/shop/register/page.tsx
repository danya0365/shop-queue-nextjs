import { ShopMarketplaceLayout } from "@/src/presentation/components/layouts/shop/marketplace";
import { CustomerRegisterView } from "@/src/presentation/components/auth/CustomerRegisterView";
import { ShopMarketplaceLayoutPresenterFactory } from "@/src/presentation/presenters/shop/marketplace/ShopMarketplaceLayoutPresenter";

export default async function CustomerRegisterPage() {
  const presenter = await ShopMarketplaceLayoutPresenterFactory.create();
  const layoutData = await presenter.getLayoutViewModel();

  return (
    <ShopMarketplaceLayout layoutData={layoutData}>
      <CustomerRegisterView />
    </ShopMarketplaceLayout>
  );
}
