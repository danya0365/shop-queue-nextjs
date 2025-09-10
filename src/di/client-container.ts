"use client";

import { AuthService } from "../application/services/auth-service";
import { AuthorizationService } from "../application/services/authorization.service";
import { CategoryServiceFactory } from "../application/services/category-service";
import { ProfileService } from "../application/services/profile-service";
import { ShopServiceFactory } from "../application/services/shop/ShopService";
import { Logger } from "../domain/interfaces/logger";
import { supabase } from "../infrastructure/config/supabase-browser-client";
import { SupabaseAuthDataSource } from "../infrastructure/datasources/supabase-auth-datasource";
import { SupabaseClientType, SupabaseDatasource } from "../infrastructure/datasources/supabase-datasource";
import { ProfileRepositoryFactory } from "../infrastructure/factories/profile-repository-factory";
import { ConsoleLogger } from "../infrastructure/loggers/console-logger";
import { SupabaseShopBackendCategoryRepository } from "../infrastructure/repositories/shop/backend/supabase-backend-category-repository";
import { SupabaseShopBackendShopRepository } from "../infrastructure/repositories/shop/backend/supabase-backend-shop-repository";
import { Container, createContainer } from "./container";

/**
 * Initialize a client-side container with all dependencies
 * This function creates a new container instance each time it's called
 */
export function createClientContainer(): Container {
  const container = createContainer();
  const logger = new ConsoleLogger();

  try {
    // Register logger instance
    container.registerInstance<Logger>("Logger", logger);

    // Initialize dependencies
    const databaseDatasource = new SupabaseDatasource(
      supabase,
      SupabaseClientType.BROWSER,
      logger
    );

    const authDatasource = new SupabaseAuthDataSource(logger, supabase);
    const profileAdapter = ProfileRepositoryFactory.createAdapter(databaseDatasource, logger);

    // Create repository instances
    const shopBackendShopRepository = new SupabaseShopBackendShopRepository(databaseDatasource, logger);
    const shopBackendCategoryRepository = new SupabaseShopBackendCategoryRepository(databaseDatasource, logger);

    // Create service instances
    const authService = new AuthService(authDatasource, logger);
    const profileService = new ProfileService(profileAdapter, logger);
    const authorizationService = new AuthorizationService(logger);
    const shopService = ShopServiceFactory.create(shopBackendShopRepository, logger);
    const categoryService = CategoryServiceFactory.create(shopBackendCategoryRepository, logger);

    // Register services in the container
    container.registerInstance("AuthService", authService);
    container.registerInstance("ProfileService", profileService);
    container.registerInstance("AuthorizationService", authorizationService);
    container.registerInstance("ShopService", shopService);
    container.registerInstance("CategoryService", categoryService);

    logger.info("Client container initialized successfully");
  } catch (error) {
    console.error("Failed to initialize client container:", error);
  }

  return container;
}

/**
 * Get a service from the client-side container
 * @param token The token of the service to get
 * @returns The service instance
 */
export function getClientService<T>(token: string | symbol): T {
  const container = createClientContainer();
  return container.resolve<T>(token);
}

// get client container
export function getClientContainer(): Container {
  return createClientContainer();
}
