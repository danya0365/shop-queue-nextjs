'use server';

import { AuthService } from "../application/services/auth-service";
import { AuthorizationService } from "../application/services/authorization.service";
import { ProfileService } from "../application/services/profile-service";
import { CustomerPointsBackendService } from "../application/services/shop/backend/customer-points-backend-service";
import { CustomerPointsTransactionBackendService } from "../application/services/shop/backend/customer-points-transactions-backend-service";
import { CustomersBackendService } from "../application/services/shop/backend/customers-backend-service";
import { DepartmentsBackendService } from "../application/services/shop/backend/departments-backend-service";
import { NotificationSettingsBackendService } from "../application/services/shop/backend/notification-settings-backend-service";
import { OpeningHoursBackendService } from "../application/services/shop/backend/opening-hours-backend-service";
import { PaymentItemsBackendService } from "../application/services/shop/backend/payment-items-backend-service";
import { PaymentsBackendService } from "../application/services/shop/backend/payments-backend-service";
import { PosterTemplateBackendService } from "../application/services/shop/backend/poster-templates-backend-service";
import { QueueServiceBackendService } from "../application/services/shop/backend/queue-services-backend-service";
import { RewardTransactionBackendService } from "../application/services/shop/backend/reward-transactions-backend-service";
import { RewardsBackendService } from "../application/services/shop/backend/rewards-backend-service";
import { ServicesBackendService } from "../application/services/shop/backend/services-backend-service";
import { ShopSettingsBackendService } from "../application/services/shop/backend/shop-settings-backend-service";
import { createShopBackendShopsService } from "../application/services/shop/backend/ShopBackendShopsService";
import { ShopService } from "../application/services/shop/shop-service";
import { SubscriptionService } from "../application/services/subscription-service";
import { Logger } from "../domain/interfaces/logger";
import { createServerSupabaseClient } from "../infrastructure/config/supabase-server-client";
import { SupabaseAuthDataSource } from "../infrastructure/datasources/supabase-auth-datasource";
import { SupabaseClientType, SupabaseDatasource } from "../infrastructure/datasources/supabase-datasource";
import { ProfileRepositoryFactory } from "../infrastructure/factories/profile-repository-factory";
import { ConsoleLogger } from "../infrastructure/loggers/console-logger";
import { SupabaseShopBackendShopRepository } from "../infrastructure/repositories/shop/backend/supabase-shop-backend-shop-repository";
import { Container, createContainer } from "./container";

/**
 * Initialize a server-side container with all dependencies
 * This container should ONLY be used in server-side code
 * This function creates a new container instance each time it's called
 */
export async function createServerContainer(): Promise<Container> {
  const container = createContainer();
  const logger = new ConsoleLogger();

  try {
    // Register logger instance
    container.registerInstance<Logger>("Logger", logger);

    // Initialize dependencies
    const supabase = await createServerSupabaseClient();

    // Create datasources
    const databaseDatasource = new SupabaseDatasource(
      supabase,
      SupabaseClientType.SERVER,
      logger
    );

    const authDatasource = new SupabaseAuthDataSource(logger, supabase);
    const profileAdapter = ProfileRepositoryFactory.createAdapter(databaseDatasource, logger);

    // Create repository instances
    const shopRepository = new SupabaseShopBackendShopRepository(databaseDatasource, logger);

    // Create service instances
    const authService = new AuthService(authDatasource, logger);
    const profileService = new ProfileService(profileAdapter, logger);
    const authorizationService = new AuthorizationService(logger);
    const shopService = new ShopService();
    const subscriptionService = new SubscriptionService(logger);

    // Shop Backend services
    const posterTemplateBackendService = new PosterTemplateBackendService(logger);
    const servicesBackendService = new ServicesBackendService(logger);
    const customersBackendService = new CustomersBackendService(logger);
    const departmentsBackendService = new DepartmentsBackendService(logger);
    const paymentsBackendService = new PaymentsBackendService(logger);
    const rewardsBackendService = new RewardsBackendService(logger);
    const openingHoursBackendService = new OpeningHoursBackendService(logger);
    const paymentItemsBackendService = new PaymentItemsBackendService(logger);
    const customerPointsBackendService = new CustomerPointsBackendService(logger);
    const queueServiceBackendService = new QueueServiceBackendService(logger);
    const customerPointsTransactionBackendService = new CustomerPointsTransactionBackendService(logger);
    const shopSettingsBackendService = new ShopSettingsBackendService(logger);
    const notificationSettingsBackendService = new NotificationSettingsBackendService(logger);
    const rewardTransactionBackendService = new RewardTransactionBackendService(logger);
    const shopBackendShopsService = createShopBackendShopsService(shopRepository, logger);

    // Register all services in the container
    container.registerInstance("AuthService", authService);
    container.registerInstance("ProfileService", profileService);
    container.registerInstance("AuthorizationService", authorizationService);
    container.registerInstance("ShopService", shopService);
    container.registerInstance("SubscriptionService", subscriptionService);
    container.registerInstance("PosterTemplateBackendService", posterTemplateBackendService);
    container.registerInstance("ServicesBackendService", servicesBackendService);
    container.registerInstance("CustomersBackendService", customersBackendService);
    container.registerInstance("DepartmentsBackendService", departmentsBackendService);
    container.registerInstance("PaymentsBackendService", paymentsBackendService);
    container.registerInstance("RewardsBackendService", rewardsBackendService);
    container.registerInstance("OpeningHoursBackendService", openingHoursBackendService);
    container.registerInstance("PaymentItemsBackendService", paymentItemsBackendService);
    container.registerInstance("CustomerPointsBackendService", customerPointsBackendService);
    container.registerInstance("QueueServiceBackendService", queueServiceBackendService);
    container.registerInstance("CustomerPointsTransactionBackendService", customerPointsTransactionBackendService);
    container.registerInstance("ShopSettingsBackendService", shopSettingsBackendService);
    container.registerInstance("NotificationSettingsBackendService", notificationSettingsBackendService);
    container.registerInstance("RewardTransactionBackendService", rewardTransactionBackendService);

    // Shop Backend services
    container.registerInstance("ShopBackendShopsService", shopBackendShopsService);

    logger.info("Server container initialized successfully");
  } catch (error) {
    console.error("Failed to initialize server container:", error);
    throw error;
  }

  return container;
}


/**
 * Get a server container
 * @returns The server container
 */
export async function getServerContainer(): Promise<Container> {
  const container = await createServerContainer();
  return container;
}
