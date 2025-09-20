import { ShopService } from "@/src/application/services/shop/ShopService";
import { getServerContainer } from "@/src/di/server-container";
import { Logger } from "@/src/domain/interfaces/logger";
import { ConsoleLogger } from "@/src/infrastructure/loggers/console-logger";
import { redirect } from "next/navigation";

interface ShopLayoutProps {
  children: React.ReactNode;
  params: Promise<{ shopId: string }>;
}

/**
 * Shop Layout - Validates shopId and ensures shop exists
 * Redirects to home page if shop is not found
 * Follows Clean Architecture principles
 */
export default async function ShopLayout({
  children,
  params,
}: ShopLayoutProps) {
  const { shopId } = await params;

  try {
    // Initialize dependency injection container
    const container = await getServerContainer();
    const shopService = container.resolve<ShopService>("ShopService");
    const logger = container.resolve<Logger>("Logger");

    // Check if shop exists by trying to get shop data
    const shop = await shopService.getShopById(shopId);

    if (!shop) {
      logger.warn(`Shop not found: ${shopId}`);
      redirect("/?error=shop_not_found");
    }

    // Shop exists and is active, render the children
    return <>{children}</>;
  } catch (error) {
    // Handle errors gracefully
    const logger = new ConsoleLogger();
    logger.error(`Error validating shop ${shopId}:`, error);

    // Redirect to home page with error message
    redirect("/?error=shop_validation_failed");
  }
}
