import { ShopService } from "@/src/application/services/shop/ShopService";
import { getServerContainer } from "@/src/di/server-container";
import { Logger } from "@/src/domain/interfaces/logger";
import { redirect } from "next/navigation";

interface CustomerLayoutProps {
  children: React.ReactNode;
  params: Promise<{ shopId: string }>;
}

/**
 * Customer Layout - Applies ONLY to customer-facing pages under (customer)
 * Enforces: shop must exist AND status === "active"
 */
export default async function CustomerLayout({
  children,
  params,
}: CustomerLayoutProps) {
  const { shopId } = await params;

  const container = await getServerContainer();
  const shopService = container.resolve<ShopService>("ShopService");
  const logger = container.resolve<Logger>("Logger");

  const shop = await shopService.getShopById(shopId);

  if (!shop) {
    logger.warn(`Customer routes: shop not found: ${shopId}`);
    redirect("/?error=shop_not_found");
  }

  if (shop.status && shop.status !== "active") {
    logger.warn(
      `Customer routes: shop inactive: ${shopId} (status=${shop.status})`
    );
    redirect(`/shop/${shopId}/inactive`);
  }

  return <>{children}</>;
}
