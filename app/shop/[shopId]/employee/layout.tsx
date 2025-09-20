import { redirect } from "next/navigation";
import { getServerContainer } from "@/src/di/server-container";
import { ShopService } from "@/src/application/services/shop/ShopService";
import { Logger } from "@/src/domain/interfaces/logger";
import { ConsoleLogger } from "@/src/infrastructure/loggers/console-logger";

interface EmployeeLayoutProps {
  children: React.ReactNode;
  params: Promise<{ shopId: string }>;
}

/**
 * Employee Layout - Role-based access control for shop employee pages
 * Restricts access to users with employee permissions only
 * Follows Clean Architecture principles
 */
export default async function EmployeeLayout({
  children,
  params,
}: EmployeeLayoutProps) {
  const { shopId } = await params;
  
  try {
    // Initialize dependency injection container
    const container = await getServerContainer();
    const shopService = container.resolve<ShopService>("ShopService");
    const logger = container.resolve<Logger>("Logger");

    // Check if current user is a shop employee
    const isEmployee = await shopService.isShopEmployee(shopId);

    if (!isEmployee) {
      logger.warn(`Unauthorized access attempt to employee area for shop ${shopId}`);
      redirect(`/shop/${shopId}?error=unauthorized`);
    }

    // User is authorized, render the children
    return <>{children}</>;
  } catch (error) {
    // Handle errors gracefully
    const logger = new ConsoleLogger();
    logger.error(`Error checking employee access for shop ${shopId}:`, error);
    
    // Redirect to shop page with error message
    redirect(`/shop/${shopId}?error=access_check_failed`);
  }
}
