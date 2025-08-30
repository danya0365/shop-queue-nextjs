'use server';

import { BackendCategoriesService } from "../application/services/backend/BackendCategoriesService";
import { BackendCustomersService } from "../application/services/backend/BackendCustomersService";
import { BackendDashboardService } from "../application/services/backend/BackendDashboardService";
import { BackendEmployeesService } from "../application/services/backend/BackendEmployeesService";
import { BackendProfilesService } from "../application/services/backend/BackendProfilesService";
import { BackendQueuesService } from "../application/services/backend/BackendQueuesService";
import { BackendShopsService } from "../application/services/backend/BackendShopsService";
import { GetCategoriesUseCase } from "../application/usecases/backend/categories/GetCategoriesUseCase";
import { CreateCustomerUseCase } from "../application/usecases/backend/customers/CreateCustomerUseCase";
import { DeleteCustomerUseCase } from "../application/usecases/backend/customers/DeleteCustomerUseCase";
import { GetCustomerByIdUseCase } from "../application/usecases/backend/customers/GetCustomerByIdUseCase";
import { GetCustomersUseCase } from "../application/usecases/backend/customers/GetCustomersUseCase";
import { UpdateCustomerUseCase } from "../application/usecases/backend/customers/UpdateCustomerUseCase";
import { GetDashboardStatsUseCase } from "../application/usecases/backend/dashboard/GetDashboardStatsUseCase";
import { GetPopularServicesUseCase } from "../application/usecases/backend/dashboard/GetPopularServicesUseCase";
import { GetQueueDistributionUseCase } from "../application/usecases/backend/dashboard/GetQueueDistributionUseCase";
import { GetRecentActivitiesUseCase } from "../application/usecases/backend/dashboard/GetRecentActivitiesUseCase";
import { CreateEmployeeUseCase } from "../application/usecases/backend/employees/CreateEmployeeUseCase";
import { DeleteEmployeeUseCase } from "../application/usecases/backend/employees/DeleteEmployeeUseCase";
import { GetEmployeeByIdUseCase } from "../application/usecases/backend/employees/GetEmployeeByIdUseCase";
import { GetEmployeeStatsUseCase } from "../application/usecases/backend/employees/GetEmployeeStatsUseCase";
import { GetEmployeesUseCase } from "../application/usecases/backend/employees/GetEmployeesUseCase";
import { UpdateEmployeeUseCase } from "../application/usecases/backend/employees/UpdateEmployeeUseCase";
import { GetProfilesUseCase } from "../application/usecases/backend/profiles/GetProfilesUseCase";
import { GetQueuesUseCase } from "../application/usecases/backend/queues/GetQueuesUseCase";
import { GetShopsPaginatedUseCase } from "../application/usecases/backend/shops/GetShopsPaginatedUseCase";
import { GetShopStatsUseCase } from "../application/usecases/backend/shops/GetShopStatsUseCase";
import { Logger } from "../domain/interfaces/logger";
import { createBackendSupabaseClient } from "../infrastructure/config/supabase-backend-client";
import { SupabaseClientType, SupabaseDatasource } from "../infrastructure/datasources/supabase-datasource";
import { ConsoleLogger } from "../infrastructure/loggers/console-logger";
import { SupabaseBackendCustomerRepository } from "../infrastructure/repositories/backend/supabase-backend-customer-repository";
import { SupabaseBackendEmployeeRepository } from "../infrastructure/repositories/backend/supabase-backend-employee-repository";
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
    const shopRepository = new SupabaseBackendShopRepository(databaseDatasource, logger);
    const customerRepository = new SupabaseBackendCustomerRepository(databaseDatasource, logger);
    const employeeRepository = new SupabaseBackendEmployeeRepository(databaseDatasource, logger);

    // Create use case instances
    const getDashboardStatsUseCase = new GetDashboardStatsUseCase(logger);
    const getRecentActivitiesUseCase = new GetRecentActivitiesUseCase(logger);
    const getQueueDistributionUseCase = new GetQueueDistributionUseCase(logger);
    const getPopularServicesUseCase = new GetPopularServicesUseCase(logger);
    const getShopsPaginatedUseCase = new GetShopsPaginatedUseCase(shopRepository, logger);
    const getShopStatsUseCase = new GetShopStatsUseCase(shopRepository, logger);
    const getQueuesUseCase = new GetQueuesUseCase(logger);

    // Customer use cases
    const getCustomersUseCase = new GetCustomersUseCase(customerRepository, logger);
    const getCustomerByIdUseCase = new GetCustomerByIdUseCase(customerRepository, logger);
    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository, logger);
    const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository, logger);
    const deleteCustomerUseCase = new DeleteCustomerUseCase(customerRepository, logger);

    // Employee use cases
    const getEmployeesUseCase = new GetEmployeesUseCase(logger);
    const getEmployeeByIdUseCase = new GetEmployeeByIdUseCase(employeeRepository, logger);
    const createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository, logger);
    const updateEmployeeUseCase = new UpdateEmployeeUseCase(employeeRepository, logger);
    const deleteEmployeeUseCase = new DeleteEmployeeUseCase(employeeRepository, logger);
    const getEmployeeStatsUseCase = new GetEmployeeStatsUseCase(employeeRepository, logger);

    const getCategoriesUseCase = new GetCategoriesUseCase(logger);
    const getProfilesUseCase = new GetProfilesUseCase(logger);

    // Create service instances
    const backendDashboardService = new BackendDashboardService(
      getDashboardStatsUseCase,
      getRecentActivitiesUseCase,
      getQueueDistributionUseCase,
      getPopularServicesUseCase,
      logger
    );

    const backendShopsService = new BackendShopsService(
      getShopsPaginatedUseCase,
      getShopStatsUseCase,
      logger
    );

    const backendQueuesService = new BackendQueuesService(getQueuesUseCase, logger);
    const backendCustomersService = new BackendCustomersService(
      getCustomersUseCase,
      getCustomerByIdUseCase,
      createCustomerUseCase,
      updateCustomerUseCase,
      deleteCustomerUseCase,
      logger
    );
    const backendEmployeesService = new BackendEmployeesService(
      getEmployeesUseCase,
      getEmployeeStatsUseCase,
      getEmployeeByIdUseCase,
      createEmployeeUseCase,
      updateEmployeeUseCase,
      deleteEmployeeUseCase,
      logger
    );
    const backendCategoriesService = new BackendCategoriesService(getCategoriesUseCase, logger);
    const backendProfilesService = new BackendProfilesService(getProfilesUseCase, logger);

    // Register only services in the container
    container.registerInstance("BackendDashboardService", backendDashboardService);
    container.registerInstance("BackendShopsService", backendShopsService);
    container.registerInstance("BackendQueuesService", backendQueuesService);
    container.registerInstance("BackendCustomersService", backendCustomersService);
    container.registerInstance("BackendEmployeesService", backendEmployeesService);
    container.registerInstance("BackendCategoriesService", backendCategoriesService);
    container.registerInstance("BackendProfilesService", backendProfilesService);

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
