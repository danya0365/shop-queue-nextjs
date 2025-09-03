'use server';

import { BackendAuthUsersService } from "../application/services/backend/BackendAuthUsersService";
import { BackendCategoriesService } from "../application/services/backend/BackendCategoriesService";
import { BackendCustomersService } from "../application/services/backend/BackendCustomersService";
import { BackendDashboardService } from "../application/services/backend/BackendDashboardService";
import { BackendEmployeesService } from "../application/services/backend/BackendEmployeesService";
import { BackendPaymentsService } from "../application/services/backend/BackendPaymentsService";
import { BackendProfilesService } from "../application/services/backend/BackendProfilesService";
import { BackendQueuesService } from "../application/services/backend/BackendQueuesService";
import { BackendShopsService } from "../application/services/backend/BackendShopsService";
import { DeleteAuthUserUseCase } from "../application/usecases/backend/auth-users/DeleteAuthUserUseCase";
import { GetAuthUserByIdUseCase } from "../application/usecases/backend/auth-users/GetAuthUserByIdUseCase";
import { GetAuthUsersPaginatedUseCase } from "../application/usecases/backend/auth-users/GetAuthUsersPaginatedUseCase";
import { GetAuthUserStatsUseCase } from "../application/usecases/backend/auth-users/GetAuthUserStatsUseCase";
import { GetCategoriesUseCase } from "../application/usecases/backend/categories/GetMockCategoriesUseCase";
import { CreateCustomerUseCase } from "../application/usecases/backend/customers/CreateCustomerUseCase";
import { DeleteCustomerUseCase } from "../application/usecases/backend/customers/DeleteCustomerUseCase";
import { GetCustomerByIdUseCase } from "../application/usecases/backend/customers/GetCustomerByIdUseCase";
import { GetCustomersUseCase } from "../application/usecases/backend/customers/GetCustomersUseCase";
import { UpdateCustomerUseCase } from "../application/usecases/backend/customers/UpdateCustomerUseCase";
import { GetDashboardDataUseCase } from "../application/usecases/backend/dashboard/GetDashboardDataUseCase";
import { GetDashboardStatsUseCase } from "../application/usecases/backend/dashboard/GetDashboardStatsUseCase";
import { GetPopularServicesUseCase } from "../application/usecases/backend/dashboard/GetPopularServicesUseCase";
import { GetQueueDistributionUseCase } from "../application/usecases/backend/dashboard/GetQueueDistributionUseCase";
import { GetRecentActivitiesUseCase } from "../application/usecases/backend/dashboard/GetRecentActivitiesUseCase";
import { CreateEmployeeUseCase } from "../application/usecases/backend/employees/CreateEmployeeUseCase";
import { DeleteEmployeeUseCase } from "../application/usecases/backend/employees/DeleteEmployeeUseCase";
import { GetEmployeeByIdUseCase } from "../application/usecases/backend/employees/GetEmployeeByIdUseCase";
import { GetEmployeesPaginatedUseCase } from "../application/usecases/backend/employees/GetEmployeesPaginatedUseCase";
import { GetEmployeeStatsUseCase } from "../application/usecases/backend/employees/GetEmployeeStatsUseCase";
import { UpdateEmployeeUseCase } from "../application/usecases/backend/employees/UpdateEmployeeUseCase";
import { GetPaymentsUseCase } from "../application/usecases/backend/payments/GetPaymentsUseCase";
import {
  CreateProfileUseCase,
  DeleteProfileUseCase,
  GetProfileByIdUseCase,
  GetProfilesPaginatedUseCase,
  GetProfileStatsUseCase,
  UpdateProfileUseCase
} from "../application/usecases/backend/profiles";
import { CreateQueueUseCase } from "../application/usecases/backend/queues/CreateQueueUseCase";
import { DeleteQueueUseCase } from "../application/usecases/backend/queues/DeleteQueueUseCase";
import { GetQueueByIdUseCase } from "../application/usecases/backend/queues/GetQueueByIdUseCase";
import { GetQueuesPaginatedUseCase } from "../application/usecases/backend/queues/GetQueuesPaginatedUseCase";
import { GetQueueStatsUseCase } from "../application/usecases/backend/queues/GetQueueStatsUseCase";
import { UpdateQueueUseCase } from "../application/usecases/backend/queues/UpdateQueueUseCase";
import { GetShopsPaginatedUseCase } from "../application/usecases/backend/shops/GetShopsPaginatedUseCase";
import { GetShopStatsUseCase } from "../application/usecases/backend/shops/GetShopStatsUseCase";
import { Logger } from "../domain/interfaces/logger";
import { createBackendSupabaseClient } from "../infrastructure/config/supabase-backend-client";
import { SupabaseClientType, SupabaseDatasource } from "../infrastructure/datasources/supabase-datasource";
import { ConsoleLogger } from "../infrastructure/loggers/console-logger";
import { SupabaseBackendAuthUsersRepository } from "../infrastructure/repositories/backend/supabase-backend-auth-users-repository";
import { SupabaseBackendCustomerRepository } from "../infrastructure/repositories/backend/supabase-backend-customer-repository";
import { SupabaseBackendDashboardRepository } from "../infrastructure/repositories/backend/supabase-backend-dashboard-repository";
import { SupabaseBackendEmployeeRepository } from "../infrastructure/repositories/backend/supabase-backend-employee-repository";
import { SupabaseBackendProfileRepository } from "../infrastructure/repositories/backend/supabase-backend-profile-repository";
import { SupabaseBackendQueueRepository } from "../infrastructure/repositories/backend/supabase-backend-queue-repository";
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
    const employeeRepository = new SupabaseBackendEmployeeRepository(databaseDatasource, logger);
    const profileRepository = new SupabaseBackendProfileRepository(databaseDatasource, logger);
    const dashboardRepository = new SupabaseBackendDashboardRepository(databaseDatasource, logger);

    // Create use case instances
    const getDashboardStatsUseCase = new GetDashboardStatsUseCase(dashboardRepository, logger);
    const getRecentActivitiesUseCase = new GetRecentActivitiesUseCase(dashboardRepository, logger);
    const getQueueDistributionUseCase = new GetQueueDistributionUseCase(dashboardRepository, logger);
    const getPopularServicesUseCase = new GetPopularServicesUseCase(dashboardRepository, logger);
    const getDashboardDataUseCase = new GetDashboardDataUseCase(
      getDashboardStatsUseCase,
      getPopularServicesUseCase,
      getQueueDistributionUseCase,
      getRecentActivitiesUseCase,
      logger
    );
    const getShopsPaginatedUseCase = new GetShopsPaginatedUseCase(shopRepository);
    const getShopStatsUseCase = new GetShopStatsUseCase(shopRepository);

    // Queues use cases
    const getQueueByIdUseCase = new GetQueueByIdUseCase(queueRepository, logger);
    const getQueuesPaginatedUseCase = new GetQueuesPaginatedUseCase(queueRepository, logger);
    const getQueueStatsUseCase = new GetQueueStatsUseCase(queueRepository, logger);
    const createQueueUseCase = new CreateQueueUseCase(queueRepository, logger);
    const updateQueueUseCase = new UpdateQueueUseCase(queueRepository, logger);
    const deleteQueueUseCase = new DeleteQueueUseCase(queueRepository, logger);

    // Auth Users use cases
    const getAuthUsersPaginatedUseCase = new GetAuthUsersPaginatedUseCase(authUsersRepository);
    const getAuthUserByIdUseCase = new GetAuthUserByIdUseCase(authUsersRepository);
    const getAuthUserStatsUseCase = new GetAuthUserStatsUseCase(authUsersRepository);
    const deleteAuthUserUseCase = new DeleteAuthUserUseCase(authUsersRepository);

    // Customer use cases
    const getCustomersUseCase = new GetCustomersUseCase(customerRepository, logger);
    const getCustomerByIdUseCase = new GetCustomerByIdUseCase(customerRepository, logger);
    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository, logger);
    const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository, logger);
    const deleteCustomerUseCase = new DeleteCustomerUseCase(customerRepository, logger);

    // Employee use cases
    const getEmployeesPaginatedUseCase = new GetEmployeesPaginatedUseCase(employeeRepository, logger);
    const getEmployeeByIdUseCase = new GetEmployeeByIdUseCase(employeeRepository, logger);
    const createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository, logger);
    const updateEmployeeUseCase = new UpdateEmployeeUseCase(employeeRepository, logger);
    const deleteEmployeeUseCase = new DeleteEmployeeUseCase(employeeRepository, logger);
    const getEmployeeStatsUseCase = new GetEmployeeStatsUseCase(employeeRepository, logger);

    const getCategoriesUseCase = new GetCategoriesUseCase(logger);
    const getPaymentsUseCase = new GetPaymentsUseCase(logger);

    // Profile use cases
    const getProfilesPaginatedUseCase = new GetProfilesPaginatedUseCase(profileRepository);
    const getProfileStatsUseCase = new GetProfileStatsUseCase(profileRepository);
    const getProfileByIdUseCase = new GetProfileByIdUseCase(profileRepository);
    const createProfileUseCase = new CreateProfileUseCase(profileRepository);
    const updateProfileUseCase = new UpdateProfileUseCase(profileRepository);
    const deleteProfileUseCase = new DeleteProfileUseCase(profileRepository);

    // Create service instances
    const backendDashboardService = new BackendDashboardService(
      getDashboardStatsUseCase,
      getRecentActivitiesUseCase,
      getQueueDistributionUseCase,
      getPopularServicesUseCase,
      getDashboardDataUseCase,
      logger
    );

    const backendShopsService = new BackendShopsService(
      getShopsPaginatedUseCase,
      getShopStatsUseCase,
      logger
    );

    const backendQueuesService = new BackendQueuesService(getQueuesPaginatedUseCase, getQueueStatsUseCase, getQueueByIdUseCase, createQueueUseCase, updateQueueUseCase, deleteQueueUseCase, logger);
    const backendCustomersService = new BackendCustomersService(
      getCustomersUseCase,
      getCustomerByIdUseCase,
      createCustomerUseCase,
      updateCustomerUseCase,
      deleteCustomerUseCase,
      logger
    );
    const backendEmployeesService = new BackendEmployeesService(
      getEmployeesPaginatedUseCase,
      getEmployeeStatsUseCase,
      getEmployeeByIdUseCase,
      createEmployeeUseCase,
      updateEmployeeUseCase,
      deleteEmployeeUseCase,
      logger
    );
    const backendAuthUsersService = new BackendAuthUsersService(
      getAuthUsersPaginatedUseCase,
      getAuthUserByIdUseCase,
      getAuthUserStatsUseCase,
      deleteAuthUserUseCase
    );
    const backendCategoriesService = new BackendCategoriesService(getCategoriesUseCase, logger);
    const backendProfilesService = new BackendProfilesService(
      getProfilesPaginatedUseCase,
      getProfileStatsUseCase,
      getProfileByIdUseCase,
      createProfileUseCase,
      updateProfileUseCase,
      deleteProfileUseCase,
      logger
    );
    const backendPaymentsService = new BackendPaymentsService(getPaymentsUseCase, logger);

    // Register only services in the container
    container.registerInstance("BackendDashboardService", backendDashboardService);
    container.registerInstance("BackendShopsService", backendShopsService);
    container.registerInstance("BackendQueuesService", backendQueuesService);
    container.registerInstance("BackendCustomersService", backendCustomersService);
    container.registerInstance("BackendEmployeesService", backendEmployeesService);
    container.registerInstance("BackendAuthUsersService", backendAuthUsersService);
    container.registerInstance("BackendCategoriesService", backendCategoriesService);
    container.registerInstance("BackendProfilesService", backendProfilesService);
    container.registerInstance("BackendPaymentsService", backendPaymentsService);

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
