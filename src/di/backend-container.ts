'use server';

import { BackendEmployeesServiceFactory } from '@/src/application/services/backend/BackendEmployeesService';
import { BackendAuthUsersServiceFactory } from "../application/services/backend/BackendAuthUsersService";
import { BackendCategoriesServiceFactory } from "../application/services/backend/BackendCategoriesService";
import { BackendCustomersServiceFactory } from "../application/services/backend/BackendCustomersService";
import { BackendDepartmentsServiceFactory } from "../application/services/backend/BackendDepartmentsService";
import { BackendPaymentsServiceFactory } from "../application/services/backend/BackendPaymentsService";
import { BackendProfilesServiceFactory } from "../application/services/backend/BackendProfilesService";
import { BackendPromotionsServiceFactory } from "../application/services/backend/BackendPromotionsService";
import { BackendQueuesServiceFactory } from "../application/services/backend/BackendQueuesService";
import { BackendRewardsServiceFactory } from "../application/services/backend/BackendRewardsService";
import { BackendServicesServiceFactory } from '../application/services/backend/BackendServicesService';
import { BackendShopsServiceFactory } from "../application/services/backend/BackendShopsService";
import { ShopBackendDashboardServiceFactory } from '../application/services/shop/backend/BackendDashboardService';
import { Logger } from "../domain/interfaces/logger";
import { createBackendSupabaseClient } from "../infrastructure/config/supabase-backend-client";
import { SupabaseClientType, SupabaseDatasource } from "../infrastructure/datasources/supabase-datasource";
import { ConsoleLogger } from "../infrastructure/loggers/console-logger";
import { SupabaseBackendAuthUsersRepository } from "../infrastructure/repositories/backend/supabase-backend-auth-users-repository";
import { SupabaseBackendCategoryRepository } from "../infrastructure/repositories/backend/supabase-backend-category-repository";
import { SupabaseBackendCustomerRepository } from "../infrastructure/repositories/backend/supabase-backend-customer-repository";
import { SupabaseBackendDashboardRepository } from "../infrastructure/repositories/backend/supabase-backend-dashboard-repository";
import { SupabaseBackendDepartmentRepository } from "../infrastructure/repositories/backend/supabase-backend-department-repository";
import { SupabaseBackendEmployeeRepository } from "../infrastructure/repositories/backend/supabase-backend-employee-repository";
import { SupabaseBackendPaymentRepository } from "../infrastructure/repositories/backend/supabase-backend-payment-repository";
import { SupabaseBackendProfileRepository } from "../infrastructure/repositories/backend/supabase-backend-profile-repository";
import { SupabaseBackendPromotionRepository } from "../infrastructure/repositories/backend/supabase-backend-promotion-repository";
import { SupabaseBackendQueueRepository } from "../infrastructure/repositories/backend/supabase-backend-queue-repository";
import { SupabaseBackendRewardRepository } from '../infrastructure/repositories/backend/supabase-backend-reward-repository';
import { SupabaseBackendServiceRepository } from '../infrastructure/repositories/backend/supabase-backend-service-repository';
import { SupabaseBackendShopRepository } from "../infrastructure/repositories/backend/supabase-backend-shop-repository";
import { Container, createContainer } from "./container";

/**
 * Initialize a backend container with elevated privilege dependencies
 * This container should ONLY be used in server-side code with proper authentication checks
 * It provides access to admin-level operations that bypass RLS
 */
export async function createBackendContainer(): Promise<Container> {
  const container = createContainer();
  const logger = new ConsoleLogger();

  try {
    // Register logger instance
    container.registerInstance<Logger>("Logger", logger);

    // Initialize dependencies
    const supabase = createBackendSupabaseClient();
    const databaseDatasource = new SupabaseDatasource(
      supabase,
      SupabaseClientType.ADMIN,
      logger
    );

    // Create repository instances
    const authUsersRepository = new SupabaseBackendAuthUsersRepository(databaseDatasource, logger);
    const shopRepository = new SupabaseBackendShopRepository(databaseDatasource, logger);
    const queueRepository = new SupabaseBackendQueueRepository(databaseDatasource, logger);
    const customerRepository = new SupabaseBackendCustomerRepository(databaseDatasource, logger);
    const departmentRepository = new SupabaseBackendDepartmentRepository(databaseDatasource, logger);
    const employeeRepository = new SupabaseBackendEmployeeRepository(databaseDatasource, logger);
    const paymentRepository = new SupabaseBackendPaymentRepository(databaseDatasource, logger);
    const profileRepository = new SupabaseBackendProfileRepository(databaseDatasource, logger);
    const promotionRepository = new SupabaseBackendPromotionRepository(databaseDatasource, logger);
    const dashboardRepository = new SupabaseBackendDashboardRepository(databaseDatasource, logger);
    const categoryRepository = new SupabaseBackendCategoryRepository(databaseDatasource, logger);
    const serviceRepository = new SupabaseBackendServiceRepository(databaseDatasource, logger);
    const rewardRepository = new SupabaseBackendRewardRepository(databaseDatasource, logger);

    // Create service instances
    const backendDashboardService = ShopBackendDashboardServiceFactory.create(dashboardRepository, logger);
    const backendAuthUsersService = BackendAuthUsersServiceFactory.create(authUsersRepository, logger);
    const backendCategoriesService = BackendCategoriesServiceFactory.create(categoryRepository, logger);
    const backendProfilesService = BackendProfilesServiceFactory.create(profileRepository, logger);
    const backendPaymentsService = BackendPaymentsServiceFactory.create(paymentRepository, logger);
    const backendPromotionsService = BackendPromotionsServiceFactory.create(promotionRepository, logger);
    const backendQueuesService = BackendQueuesServiceFactory.create(queueRepository, logger);
    const backendRewardsService = BackendRewardsServiceFactory.create(rewardRepository, logger);
    const backendServicesService = BackendServicesServiceFactory.create(serviceRepository, logger);
    const backendShopsService = BackendShopsServiceFactory.create(shopRepository, logger);
    const backendEmployeesService = BackendEmployeesServiceFactory.create(employeeRepository, logger);
    const backendDepartmentsService = BackendDepartmentsServiceFactory.create(departmentRepository, logger);
    const backendCustomersService = BackendCustomersServiceFactory.create(customerRepository, logger);

    // Register only services in the container
    container.registerInstance("BackendDashboardService", backendDashboardService);
    container.registerInstance("BackendShopsService", backendShopsService);
    container.registerInstance("BackendQueuesService", backendQueuesService);
    container.registerInstance("BackendCustomersService", backendCustomersService);
    container.registerInstance("BackendDepartmentsService", backendDepartmentsService);
    container.registerInstance("BackendEmployeesService", backendEmployeesService);
    container.registerInstance("BackendAuthUsersService", backendAuthUsersService);
    container.registerInstance("BackendCategoriesService", backendCategoriesService);
    container.registerInstance("BackendProfilesService", backendProfilesService);
    container.registerInstance("BackendPaymentsService", backendPaymentsService);
    container.registerInstance("BackendPromotionsService", backendPromotionsService);
    container.registerInstance("BackendServicesService", backendServicesService);
    container.registerInstance("BackendRewardsService", backendRewardsService);

    logger.info("Backend container initialized successfully");
  } catch (error) {
    console.error("Failed to initialize backend container:", error);
    throw error;
  }

  return container;
}

/**
 * Get a backend container
 * @returns The backend container
 */
export async function getBackendContainer(): Promise<Container> {
  const container = await createBackendContainer();
  return container;
}
