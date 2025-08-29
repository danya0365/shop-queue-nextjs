
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
import { ShopService } from "../application/services/shop/shop-service";
import { SubscriptionService } from "../application/services/subscription-service";
import { Logger } from "../domain/interfaces/logger";
import { createServerSupabaseClient } from "../infrastructure/config/supabase-server-client";
import { SupabaseAuthDataSource } from "../infrastructure/datasources/supabase-auth-datasource";
import { SupabaseClientType, SupabaseDatasource } from "../infrastructure/datasources/supabase-datasource";
import { ProfileRepositoryFactory } from "../infrastructure/factories/profile-repository-factory";
import { ConsoleLogger } from "../infrastructure/loggers/console-logger";
import { Container, createContainer } from "./container";

/**
 * Initialize a server-side container with all dependencies
 * This function creates a new container instance each time it's called
 */
export async function createServerContainer(): Promise<Container> {
  const container = createContainer();

  // Register logger
  const logger = new ConsoleLogger();
  container.registerInstance<Logger>("Logger", logger);

  try {
    const supabase = await createServerSupabaseClient();
    // Create and register server datasources
    // Register datasources
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

    container.register("AuthService", () => {
      return new AuthService(
        authDatasource,
        logger
      );
    });

    container.register("ProfileService", () => {
      return new ProfileService(
        profileAdapter,
        logger
      );
    });


    // Register AuthorizationService
    container.register("AuthorizationService", () => {
      return new AuthorizationService(
        logger
      );
    });

    container.register("ShopService", () => {
      return new ShopService(

      );
    });

    container.register("SubscriptionService", () => {
      return new SubscriptionService(
        logger
      );
    });

    // Register Poster Template Backend Service
    container.register('PosterTemplateBackendService', () => {
      return new PosterTemplateBackendService(logger);
    });

    container.register("ServicesBackendService", () => {
      return new ServicesBackendService(
        logger
      );
    });

    container.register("CustomersBackendService", () => {
      return new CustomersBackendService(
        logger
      );
    });

    container.register("DepartmentsBackendService", () => {
      return new DepartmentsBackendService(
        logger
      );
    });

    container.register("PaymentsBackendService", () => {
      return new PaymentsBackendService(
        logger
      );
    });

    container.register("RewardsBackendService", () => {
      return new RewardsBackendService(
        logger
      );
    });

    container.register("OpeningHoursBackendService", () => {
      return new OpeningHoursBackendService(
        logger
      );
    });

    container.register("PaymentItemsBackendService", () => {
      return new PaymentItemsBackendService(
        logger
      );
    });

    container.register("CustomerPointsBackendService", () => {
      return new CustomerPointsBackendService(
        logger
      );
    });

    container.register("QueueServiceBackendService", () => {
      return new QueueServiceBackendService(
        logger
      );
    });

    container.register("CustomerPointsTransactionBackendService", () => {
      return new CustomerPointsTransactionBackendService(
        logger
      );
    });

    container.register("ShopSettingsBackendService", () => {
      return new ShopSettingsBackendService(
        logger
      );
    });

    container.register("NotificationSettingsBackendService", () => {
      return new NotificationSettingsBackendService(
        logger
      );
    });

    container.register("RewardTransactionBackendService", () => {
      return new RewardTransactionBackendService(
        logger
      );
    });

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
