'use server';

import { GetEmployeesPaginatedInput, PaginatedEmployeesDTO } from '@/src/application/dtos/backend/employees-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { BackendEmployeesService } from '@/src/application/services/backend/BackendEmployeesService';
import { CreateCustomerUseCase } from '@/src/application/usecases/backend/customers/CreateCustomerUseCase';
import { DeleteCustomerUseCase } from '@/src/application/usecases/backend/customers/DeleteCustomerUseCase';
import { GetCustomerByIdUseCase } from '@/src/application/usecases/backend/customers/GetCustomerByIdUseCase';
import { GetCustomersPaginatedUseCase } from '@/src/application/usecases/backend/customers/GetCustomersPaginatedUseCase';
import { GetCustomerStatsUseCase } from '@/src/application/usecases/backend/customers/GetCustomerStatsUseCase';
import { UpdateCustomerUseCase } from '@/src/application/usecases/backend/customers/UpdateCustomerUseCase';
import { BackendAuthUsersService } from "../application/services/backend/BackendAuthUsersService";
import { BackendCategoriesService } from "../application/services/backend/BackendCategoriesService";
import { BackendCustomersService } from "../application/services/backend/BackendCustomersService";
import { BackendDashboardService } from "../application/services/backend/BackendDashboardService";
import { BackendPaymentsService } from "../application/services/backend/BackendPaymentsService";
import { BackendProfilesService } from "../application/services/backend/BackendProfilesService";
import { BackendQueuesService } from "../application/services/backend/BackendQueuesService";
import { BackendServicesService } from '../application/services/backend/BackendServicesService';
import { BackendShopsService } from "../application/services/backend/BackendShopsService";
import { DeleteAuthUserUseCase } from "../application/usecases/backend/auth-users/DeleteAuthUserUseCase";
import { GetAuthUserByIdUseCase } from "../application/usecases/backend/auth-users/GetAuthUserByIdUseCase";
import { GetAuthUsersPaginatedUseCase } from "../application/usecases/backend/auth-users/GetAuthUsersPaginatedUseCase";
import { GetAuthUserStatsUseCase } from "../application/usecases/backend/auth-users/GetAuthUserStatsUseCase";
import { CreateCategoryUseCase, DeleteCategoryUseCase, GetCategoriesPaginatedUseCase, GetCategoryByIdUseCase, GetCategoryStatsUseCase, UpdateCategoryUseCase } from "../application/usecases/backend/categories";
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
import { CreatePaymentUseCase } from "../application/usecases/backend/payments/CreatePaymentUseCase";
import { DeletePaymentUseCase } from "../application/usecases/backend/payments/DeletePaymentUseCase";
import { GetPaymentByIdUseCase } from "../application/usecases/backend/payments/GetPaymentByIdUseCase";
import { GetPaymentsPaginatedUseCase } from "../application/usecases/backend/payments/GetPaymentsPaginatedUseCase";
import { GetPaymentStatsUseCase } from "../application/usecases/backend/payments/GetPaymentStatsUseCase";
import { GetPaymentMethodStatsUseCase } from "../application/usecases/backend/payments/GetPaymentMethodStatsUseCase";
import { UpdatePaymentUseCase } from "../application/usecases/backend/payments/UpdatePaymentUseCase";
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
import {
  CreateServiceUseCase,
  DeleteServiceUseCase,
  GetServiceByIdUseCase,
  GetServicesPaginatedUseCase,
  GetServiceStatsUseCase,
  ToggleServiceAvailabilityUseCase,
  UpdateServiceUseCase
} from '../application/usecases/backend/services';
import { GetShopsPaginatedUseCase } from "../application/usecases/backend/shops/GetShopsPaginatedUseCase";
import { GetShopStatsUseCase } from "../application/usecases/backend/shops/GetShopStatsUseCase";
import { Logger } from "../domain/interfaces/logger";
import { createBackendSupabaseClient } from "../infrastructure/config/supabase-backend-client";
import { SupabaseClientType, SupabaseDatasource } from "../infrastructure/datasources/supabase-datasource";
import { ConsoleLogger } from "../infrastructure/loggers/console-logger";
import { SupabaseBackendAuthUsersRepository } from "../infrastructure/repositories/backend/supabase-backend-auth-users-repository";
import { SupabaseBackendCategoryRepository } from "../infrastructure/repositories/backend/supabase-backend-category-repository";
import { SupabaseBackendCustomerRepository } from "../infrastructure/repositories/backend/supabase-backend-customer-repository";
import { SupabaseBackendDashboardRepository } from "../infrastructure/repositories/backend/supabase-backend-dashboard-repository";
import { SupabaseBackendEmployeeRepository } from "../infrastructure/repositories/backend/supabase-backend-employee-repository";
import { SupabaseBackendPaymentRepository } from "../infrastructure/repositories/backend/supabase-backend-payment-repository";
import { SupabaseBackendProfileRepository } from "../infrastructure/repositories/backend/supabase-backend-profile-repository";
import { SupabaseBackendQueueRepository } from "../infrastructure/repositories/backend/supabase-backend-queue-repository";
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
    const employeeRepository = new SupabaseBackendEmployeeRepository(databaseDatasource, logger);
    const paymentRepository = new SupabaseBackendPaymentRepository(databaseDatasource, logger);
    const profileRepository = new SupabaseBackendProfileRepository(databaseDatasource, logger);
    const dashboardRepository = new SupabaseBackendDashboardRepository(databaseDatasource, logger);
    const categoryRepository = new SupabaseBackendCategoryRepository(databaseDatasource, logger);
    const serviceRepository = new SupabaseBackendServiceRepository(databaseDatasource, logger);

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
    const getCustomersPaginatedUseCase = new GetCustomersPaginatedUseCase(customerRepository);
    const getCustomerStatsUseCase = new GetCustomerStatsUseCase(customerRepository);
    const getCustomerByIdUseCase = new GetCustomerByIdUseCase(customerRepository);
    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
    const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);
    const deleteCustomerUseCase = new DeleteCustomerUseCase(customerRepository);

    // Employee use cases
    const getEmployeesPaginatedUseCase = new GetEmployeesPaginatedUseCase(employeeRepository);
    const getEmployeeByIdUseCase = new GetEmployeeByIdUseCase(employeeRepository);
    const createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository);
    const updateEmployeeUseCase = new UpdateEmployeeUseCase(employeeRepository);
    const deleteEmployeeUseCase = new DeleteEmployeeUseCase(employeeRepository);
    const getEmployeeStatsUseCase = new GetEmployeeStatsUseCase(employeeRepository);

    const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository);
    const getCategoriesPaginatedUseCase = new GetCategoriesPaginatedUseCase(categoryRepository);
    const getCategoryStatsUseCase = new GetCategoryStatsUseCase(categoryRepository);
    const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
    const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
    const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);

    // Payment use cases
    const getPaymentsPaginatedUseCase = new GetPaymentsPaginatedUseCase(paymentRepository);
    const getPaymentStatsUseCase = new GetPaymentStatsUseCase(paymentRepository);
    const getPaymentMethodStatsUseCase = new GetPaymentMethodStatsUseCase(paymentRepository);
    const getPaymentByIdUseCase = new GetPaymentByIdUseCase(paymentRepository);
    const createPaymentUseCase = new CreatePaymentUseCase(paymentRepository);
    const updatePaymentUseCase = new UpdatePaymentUseCase(paymentRepository);
    const deletePaymentUseCase = new DeletePaymentUseCase(paymentRepository);

    // Profile use cases
    const getProfilesPaginatedUseCase = new GetProfilesPaginatedUseCase(profileRepository);
    const getProfileStatsUseCase = new GetProfileStatsUseCase(profileRepository);
    const getProfileByIdUseCase = new GetProfileByIdUseCase(profileRepository);
    const createProfileUseCase = new CreateProfileUseCase(profileRepository);
    const updateProfileUseCase = new UpdateProfileUseCase(profileRepository);
    const deleteProfileUseCase = new DeleteProfileUseCase(profileRepository);

    // Service use cases
    const getServicesPaginatedUseCase = new GetServicesPaginatedUseCase(serviceRepository);
    const getServiceStatsUseCase = new GetServiceStatsUseCase(serviceRepository);
    const getServiceByIdUseCase = new GetServiceByIdUseCase(serviceRepository);
    const createServiceUseCase = new CreateServiceUseCase(serviceRepository);
    const updateServiceUseCase = new UpdateServiceUseCase(serviceRepository);
    const deleteServiceUseCase = new DeleteServiceUseCase(serviceRepository);
    const toggleServiceAvailabilityUseCase = new ToggleServiceAvailabilityUseCase(serviceRepository);

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
      getCustomersPaginatedUseCase,
      getCustomerStatsUseCase,
      getCustomerByIdUseCase,
      createCustomerUseCase,
      updateCustomerUseCase,
      deleteCustomerUseCase,
      logger
    );
    // Cast to correct type to fix type incompatibility between DTO and Entity
    const backendEmployeesService = new BackendEmployeesService(
      getEmployeesPaginatedUseCase as unknown as IUseCase<GetEmployeesPaginatedInput, PaginatedEmployeesDTO>,
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
    const backendCategoriesService = new BackendCategoriesService(getCategoriesPaginatedUseCase, getCategoryStatsUseCase, getCategoryByIdUseCase, createCategoryUseCase, updateCategoryUseCase, deleteCategoryUseCase, logger);
    const backendProfilesService = new BackendProfilesService(
      getProfilesPaginatedUseCase,
      getProfileStatsUseCase,
      getProfileByIdUseCase,
      createProfileUseCase,
      updateProfileUseCase,
      deleteProfileUseCase,
      logger
    );
    const backendPaymentsService = new BackendPaymentsService(
      getPaymentsPaginatedUseCase,
      getPaymentStatsUseCase,
      getPaymentMethodStatsUseCase,
      getPaymentByIdUseCase,
      createPaymentUseCase,
      updatePaymentUseCase,
      deletePaymentUseCase,
      logger
    );

    const backendServicesService = new BackendServicesService(
      getServicesPaginatedUseCase,
      getServiceStatsUseCase,
      getServiceByIdUseCase,
      createServiceUseCase,
      updateServiceUseCase,
      deleteServiceUseCase,
      toggleServiceAvailabilityUseCase,
      logger
    );

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
    container.registerInstance("BackendServicesService", backendServicesService);

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
