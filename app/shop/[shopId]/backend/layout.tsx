import { redirect } from "next/navigation";
import { getServerContainer } from "@/src/di/server-container";
import { ShopService } from "@/src/application/services/shop/ShopService";
import { Logger } from "@/src/domain/interfaces/logger";
import { ConsoleLogger } from "@/src/infrastructure/loggers/console-logger";

interface BackendLayoutProps {
  children: React.ReactNode;
  params: Promise<{ shopId: string }>;
}

/**
 * Backend Layout - Role-based access control for shop backend pages
 * Restricts access to users with manager permissions only
 * Follows Clean Architecture principles
 */
export default async function BackendLayout({
  children,
  params,
}: BackendLayoutProps) {
  const { shopId } = await params;
  
  try {
    // Initialize dependency injection container
    const container = await getServerContainer();
    const shopService = container.resolve<ShopService>("ShopService");
    const logger = container.resolve<Logger>("Logger");

    // Check if current user is a shop manager
    const isManager = await shopService.isShopManager(shopId);

    if (!isManager) {
      logger.warn(`Unauthorized access attempt to backend for shop ${shopId}`);
      redirect(`/shop/${shopId}?error=unauthorized`);
    }

    // User is authorized, render the children
    return <>{children}</>;
  } catch (error) {
    // Handle errors gracefully
    const logger = new ConsoleLogger();
    logger.error(`Error checking backend access for shop ${shopId}:`, error);
    
    // Redirect to shop page with error message
    redirect(`/shop/${shopId}?error=access_check_failed`);
  }
}
