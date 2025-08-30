
import { AuthService } from "../application/services/auth-service";
import { AuthorizationService } from "../application/services/authorization.service";
import { ProfileService } from "../application/services/profile-service";
import { BackendDashboardService } from "../application/services/backend/BackendDashboardService";
import { BackendShopsService } from "../application/services/backend/BackendShopsService";
import { BackendQueuesService } from "../application/services/backend/BackendQueuesService";
import { BackendCustomersService } from "../application/services/backend/BackendCustomersService";
import { BackendEmployeesService } from "../application/services/backend/BackendEmployeesService";
import { BackendCategoriesService } from "../application/services/backend/BackendCategoriesService";
import { BackendProfilesService } from "../application/services/backend/BackendProfilesService";
import { GetDashboardStatsUseCase } from "../application/usecases/backend/dashboard/GetDashboardStatsUseCase";
import { GetRecentActivitiesUseCase } from "../application/usecases/backend/dashboard/GetRecentActivitiesUseCase";
import { GetQueueDistributionUseCase } from "../application/usecases/backend/dashboard/GetQueueDistributionUseCase";
import { GetPopularServicesUseCase } from "../application/usecases/backend/dashboard/GetPopularServicesUseCase";
import { GetShopsUseCase } from "../application/usecases/backend/shops/GetShopsUseCase";
import { GetQueuesUseCase } from "../application/usecases/backend/queues/GetQueuesUseCase";
import { GetCustomersUseCase } from "../application/usecases/backend/customers/GetCustomersUseCase";
import { GetEmployeesUseCase } from "../application/usecases/backend/employees/GetEmployeesUseCase";
import { GetCategoriesUseCase } from "../application/usecases/backend/categories/GetCategoriesUseCase";
import { GetProfilesUseCase } from "../application/usecases/backend/profiles/GetProfilesUseCase";
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

    // Register Backend Dashboard Use Cases
    container.register("GetDashboardStatsUseCase", () => {
      return new GetDashboardStatsUseCase(logger);
    });

    container.register("GetRecentActivitiesUseCase", () => {
      return new GetRecentActivitiesUseCase(logger);
    });

    container.register("GetQueueDistributionUseCase", () => {
      return new GetQueueDistributionUseCase(logger);
    });

    container.register("GetPopularServicesUseCase", () => {
      return new GetPopularServicesUseCase(logger);
    });

    // Register Backend Dashboard Service
    container.register("BackendDashboardService", () => {
      const getDashboardStatsUseCase = container.resolve("GetDashboardStatsUseCase") as GetDashboardStatsUseCase;
      const getRecentActivitiesUseCase = container.resolve("GetRecentActivitiesUseCase") as GetRecentActivitiesUseCase;
      const getQueueDistributionUseCase = container.resolve("GetQueueDistributionUseCase") as GetQueueDistributionUseCase;
      const getPopularServicesUseCase = container.resolve("GetPopularServicesUseCase") as GetPopularServicesUseCase;
      
      return new BackendDashboardService(
        getDashboardStatsUseCase,
        getRecentActivitiesUseCase,
        getQueueDistributionUseCase,
        getPopularServicesUseCase,
        logger
      );
    });

    // Register Backend CRUD Use Cases
    container.register("GetShopsUseCase", () => {
      return new GetShopsUseCase(logger);
    });

    container.register("GetQueuesUseCase", () => {
      return new GetQueuesUseCase(logger);
    });

    container.register("GetCustomersUseCase", () => {
      return new GetCustomersUseCase(logger);
    });

    container.register("GetEmployeesUseCase", () => {
      return new GetEmployeesUseCase(logger);
    });

    container.register("GetCategoriesUseCase", () => {
      return new GetCategoriesUseCase(logger);
    });

    container.register("GetProfilesUseCase", () => {
      return new GetProfilesUseCase(logger);
    });

    // Register Backend CRUD Services
    container.register("BackendShopsService", () => {
      const getShopsUseCase = container.resolve("GetShopsUseCase") as GetShopsUseCase;
      return new BackendShopsService(getShopsUseCase, logger);
    });

    container.register("BackendQueuesService", () => {
      const getQueuesUseCase = container.resolve("GetQueuesUseCase") as GetQueuesUseCase;
      return new BackendQueuesService(getQueuesUseCase, logger);
    });

    container.register("BackendCustomersService", () => {
      const getCustomersUseCase = container.resolve("GetCustomersUseCase") as GetCustomersUseCase;
      return new BackendCustomersService(getCustomersUseCase, logger);
    });

    container.register("BackendEmployeesService", () => {
      const getEmployeesUseCase = container.resolve("GetEmployeesUseCase") as GetEmployeesUseCase;
      return new BackendEmployeesService(getEmployeesUseCase, logger);
    });

    container.register("BackendCategoriesService", () => {
      const getCategoriesUseCase = container.resolve("GetCategoriesUseCase") as GetCategoriesUseCase;
      return new BackendCategoriesService(getCategoriesUseCase, logger);
    });

    container.register("BackendProfilesService", () => {
      const getProfilesUseCase = container.resolve("GetProfilesUseCase") as GetProfilesUseCase;
      return new BackendProfilesService(getProfilesUseCase, logger);
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
