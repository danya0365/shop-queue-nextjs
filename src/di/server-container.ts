"use server";

import { AuthServiceFactory } from "../application/services/auth-service";
import { AuthorizationServiceFactory } from "../application/services/authorization.service";
import { CategoryServiceFactory } from "../application/services/category-service";
import { ProfileServiceFactory } from "../application/services/profile-service";
import { ShopBackendCustomersServiceFactory } from "../application/services/shop/backend/BackendCustomersService";
import { ShopBackendDashboardServiceFactory } from "../application/services/shop/backend/BackendDashboardService";
import { ShopBackendDepartmentsServiceFactory } from "../application/services/shop/backend/BackendDepartmentsService";
import { ShopBackendEmployeesServiceFactory } from "../application/services/shop/backend/BackendEmployeesService";
import { OpeningHoursBackendServiceFactory } from "../application/services/shop/backend/BackendOpeningHoursService";
import { ShopBackendPaymentsServiceFactory } from "../application/services/shop/backend/BackendPaymentsService";
import { ShopBackendPromotionsServiceFactory } from "../application/services/shop/backend/BackendPromotionsService";
import { ShopBackendQueuesServiceFactory } from "../application/services/shop/backend/BackendQueuesService";
import { ShopBackendServicesServiceFactory } from "../application/services/shop/backend/BackendServicesService";
import { ShopBackendShopSettingsServiceFactory } from "../application/services/shop/backend/BackendShopSettingsService";
import { ShopBackendShopsServiceFactory } from "../application/services/shop/backend/BackendShopsService";
import { CustomerPointsBackendService } from "../application/services/shop/backend/customer-points-backend-service";
import { CustomerPointsTransactionBackendService } from "../application/services/shop/backend/customer-points-transactions-backend-service";
import { NotificationSettingsBackendService } from "../application/services/shop/backend/notification-settings-backend-service";
import { PaymentItemsBackendService } from "../application/services/shop/backend/payment-items-backend-service";
import { PaymentsBackendService } from "../application/services/shop/backend/payments-backend-service";
import { PosterTemplateBackendService } from "../application/services/shop/backend/poster-templates-backend-service";
import { QueueServiceBackendService } from "../application/services/shop/backend/queue-services-backend-service";
import { RewardTransactionBackendService } from "../application/services/shop/backend/reward-transactions-backend-service";
import { RewardsBackendService } from "../application/services/shop/backend/rewards-backend-service";
import { ShopServiceFactory } from "../application/services/shop/ShopService";
import { SubscriptionServiceFactory } from "../application/services/subscription/SubscriptionService";
import { Logger } from "../domain/interfaces/logger";
import { createServerSupabaseClient } from "../infrastructure/config/supabase-server-client";
import { SupabaseAuthDataSource } from "../infrastructure/datasources/supabase-auth-datasource";
import {
  SupabaseClientType,
  SupabaseDatasource,
} from "../infrastructure/datasources/supabase-datasource";
import { ProfileRepositoryFactory } from "../infrastructure/factories/profile-repository-factory";
import { ConsoleLogger } from "../infrastructure/loggers/console-logger";
import { SupabaseShopBackendCategoryRepository } from "../infrastructure/repositories/shop/backend/supabase-backend-category-repository";
import { SupabaseShopBackendCustomerRepository } from "../infrastructure/repositories/shop/backend/supabase-backend-customer-repository";
import { SupabaseShopBackendDashboardRepository } from "../infrastructure/repositories/shop/backend/supabase-backend-dashboard-repository";
import { SupabaseShopBackendDepartmentRepository } from "../infrastructure/repositories/shop/backend/supabase-backend-department-repository";
import { SupabaseShopBackendEmployeeRepository } from "../infrastructure/repositories/shop/backend/supabase-backend-employee-repository";
import { SupabaseBackendOpeningHoursRepository } from "../infrastructure/repositories/shop/backend/supabase-backend-opening-hours-repository";
import { SupabaseShopBackendPaymentRepository } from "../infrastructure/repositories/shop/backend/supabase-backend-payment-repository";
import { SupabaseShopBackendPromotionRepository } from "../infrastructure/repositories/shop/backend/supabase-backend-promotion-repository";
import { SupabaseShopBackendQueueRepository } from "../infrastructure/repositories/shop/backend/supabase-backend-queue-repository";
import { SupabaseShopBackendServiceRepository } from "../infrastructure/repositories/shop/backend/supabase-backend-service-repository";
import { SupabaseShopBackendShopRepository } from "../infrastructure/repositories/shop/backend/supabase-backend-shop-repository";
import { SupabaseShopBackendShopSettingsRepository } from "../infrastructure/repositories/shop/backend/supabase-backend-shop-settings-repository";
import { SupabaseFeatureAccessRepository } from "../infrastructure/repositories/supabase-feature-access-repository";
import { SupabaseProfileSubscriptionRepository } from "../infrastructure/repositories/supabase-profile-subscription-repository";
import { SupabaseSubscriptionPlanRepository } from "../infrastructure/repositories/supabase-subscription-plan-repository";
import { SupabaseSubscriptionUsageRepository } from "../infrastructure/repositories/supabase-subscription-usage-repository";
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
    const profileAdapter = ProfileRepositoryFactory.createAdapter(
      databaseDatasource,
      logger
    );

    // Create repositories
    const shopBackendDashboardRepository =
      new SupabaseShopBackendDashboardRepository(databaseDatasource, logger);
    const shopBackendQueueRepository = new SupabaseShopBackendQueueRepository(
      databaseDatasource,
      logger
    );
    const shopBackendShopRepository = new SupabaseShopBackendShopRepository(
      databaseDatasource,
      logger
    );
    const shopBackendOpeningHoursRepository =
      new SupabaseBackendOpeningHoursRepository(databaseDatasource, logger);
    const shopBackendCategoryRepository =
      new SupabaseShopBackendCategoryRepository(databaseDatasource, logger);
    const shopBackendPaymentRepository =
      new SupabaseShopBackendPaymentRepository(databaseDatasource, logger);
    const shopBackendPromotionRepository =
      new SupabaseShopBackendPromotionRepository(databaseDatasource, logger);
    const shopBackendServiceRepository =
      new SupabaseShopBackendServiceRepository(databaseDatasource, logger);
    const shopBackendShopSettingsRepository =
      new SupabaseShopBackendShopSettingsRepository(databaseDatasource, logger);
    const shopBackendCustomerRepository =
      new SupabaseShopBackendCustomerRepository(databaseDatasource, logger);
    const shopBackendEmployeeRepository =
      new SupabaseShopBackendEmployeeRepository(databaseDatasource, logger);
    const shopBackendDepartmentRepository =
      new SupabaseShopBackendDepartmentRepository(databaseDatasource, logger);

    // Create subscription repositories
    const subscriptionPlanRepository = new SupabaseSubscriptionPlanRepository(
      databaseDatasource,
      logger
    );
    const profileSubscriptionRepository =
      new SupabaseProfileSubscriptionRepository(databaseDatasource, logger);
    const subscriptionUsageRepository = new SupabaseSubscriptionUsageRepository(
      databaseDatasource,
      logger
    );
    const featureAccessRepository = new SupabaseFeatureAccessRepository(
      databaseDatasource,
      logger
    );

    // Create service instances
    const authService = AuthServiceFactory.create(authDatasource, logger);
    const profileService = ProfileServiceFactory.create(profileAdapter, logger);
    const authorizationService = AuthorizationServiceFactory.create(logger);
    const shopService = ShopServiceFactory.create(
      shopBackendShopRepository,
      logger
    );
    const categoryService = CategoryServiceFactory.create(
      shopBackendCategoryRepository,
      logger
    );

    // Create backend subscription service
    const subscriptionService = SubscriptionServiceFactory.create(
      subscriptionPlanRepository,
      profileSubscriptionRepository,
      subscriptionUsageRepository,
      featureAccessRepository,
      logger
    );

    // Shop Backend services
    const shopBackendDashboardService =
      ShopBackendDashboardServiceFactory.create(
        shopBackendDashboardRepository,
        logger
      );
    const posterTemplateBackendService = new PosterTemplateBackendService(
      logger
    );
    const paymentsBackendService = new PaymentsBackendService(logger);
    const rewardsBackendService = new RewardsBackendService(logger);
    const paymentItemsBackendService = new PaymentItemsBackendService(logger);
    const customerPointsBackendService = new CustomerPointsBackendService(
      logger
    );
    const queueServiceBackendService = new QueueServiceBackendService(logger);
    const customerPointsTransactionBackendService =
      new CustomerPointsTransactionBackendService(logger);
    const notificationSettingsBackendService =
      new NotificationSettingsBackendService(logger);
    const rewardTransactionBackendService = new RewardTransactionBackendService(
      logger
    );
    const shopBackendShopsService = ShopBackendShopsServiceFactory.create(
      shopBackendShopRepository,
      logger
    );
    const shopBackendPaymentsService = ShopBackendPaymentsServiceFactory.create(
      shopBackendPaymentRepository,
      logger
    );
    const shopBackendPromotionsService =
      ShopBackendPromotionsServiceFactory.create(
        shopBackendPromotionRepository,
        logger
      );
    const shopBackendQueuesService = ShopBackendQueuesServiceFactory.create(
      shopBackendQueueRepository,
      logger
    );
    const shopBackendServicesService = ShopBackendServicesServiceFactory.create(
      shopBackendServiceRepository,
      logger
    );
    const shopBackendOpeningHoursService =
      OpeningHoursBackendServiceFactory.create(
        shopBackendOpeningHoursRepository,
        logger
      );
    const shopBackendShopSettingsService =
      ShopBackendShopSettingsServiceFactory.create(
        shopBackendShopSettingsRepository,
        logger
      );
    const shopBackendCustomersService =
      ShopBackendCustomersServiceFactory.create(
        shopBackendCustomerRepository,
        logger
      );
    const shopBackendEmployeesService =
      ShopBackendEmployeesServiceFactory.create(
        shopBackendEmployeeRepository,
        logger
      );
    const shopBackendDepartmentsService =
      ShopBackendDepartmentsServiceFactory.create(
        shopBackendDepartmentRepository,
        logger
      );
    // Register all services in the container
    container.registerInstance("AuthService", authService);
    container.registerInstance("ProfileService", profileService);
    container.registerInstance("AuthorizationService", authorizationService);
    container.registerInstance("ShopService", shopService);
    container.registerInstance("SubscriptionService", subscriptionService);
    container.registerInstance("CategoryService", categoryService);

    // Shop Backend services
    container.registerInstance(
      "ShopBackendDashboardService",
      shopBackendDashboardService
    );
    container.registerInstance(
      "ShopBackendShopsService",
      shopBackendShopsService
    );
    container.registerInstance(
      "ShopBackendPaymentsService",
      shopBackendPaymentsService
    );
    container.registerInstance(
      "ShopBackendPromotionsService",
      shopBackendPromotionsService
    );
    container.registerInstance(
      "ShopBackendQueuesService",
      shopBackendQueuesService
    );
    container.registerInstance(
      "ShopBackendServicesService",
      shopBackendServicesService
    );
    container.registerInstance(
      "ShopBackendOpeningHoursService",
      shopBackendOpeningHoursService
    );
    container.registerInstance(
      "ShopBackendShopSettingsService",
      shopBackendShopSettingsService
    );
    container.registerInstance(
      "ShopBackendCustomersService",
      shopBackendCustomersService
    );
    container.registerInstance(
      "ShopBackendEmployeesService",
      shopBackendEmployeesService
    );
    container.registerInstance(
      "ShopBackendDepartmentsService",
      shopBackendDepartmentsService
    );
    container.registerInstance(
      "PosterTemplateBackendService",
      posterTemplateBackendService
    );
    container.registerInstance(
      "PaymentsBackendService",
      paymentsBackendService
    );
    container.registerInstance("RewardsBackendService", rewardsBackendService);

    container.registerInstance(
      "PaymentItemsBackendService",
      paymentItemsBackendService
    );
    container.registerInstance(
      "CustomerPointsBackendService",
      customerPointsBackendService
    );
    container.registerInstance(
      "QueueServiceBackendService",
      queueServiceBackendService
    );
    container.registerInstance(
      "CustomerPointsTransactionBackendService",
      customerPointsTransactionBackendService
    );
    container.registerInstance(
      "NotificationSettingsBackendService",
      notificationSettingsBackendService
    );
    container.registerInstance(
      "RewardTransactionBackendService",
      rewardTransactionBackendService
    );

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
