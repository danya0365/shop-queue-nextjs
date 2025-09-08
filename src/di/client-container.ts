"use client";

import { AuthService } from "../application/services/auth-service";
import { AuthorizationService } from "../application/services/authorization.service";
import { ProfileService } from "../application/services/profile-service";
import { ShopService } from "../application/services/shop/shop-service";
import { Logger } from "../domain/interfaces/logger";
import { supabase } from "../infrastructure/config/supabase-browser-client";
import { SupabaseAuthDataSource } from "../infrastructure/datasources/supabase-auth-datasource";
import { SupabaseClientType, SupabaseDatasource } from "../infrastructure/datasources/supabase-datasource";
import { ProfileRepositoryFactory } from "../infrastructure/factories/profile-repository-factory";
import { ConsoleLogger } from "../infrastructure/loggers/console-logger";
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
    // TODO: Create repository instances

    // Create service instances
    const authService = new AuthService(authDatasource, logger);
    const profileService = new ProfileService(profileAdapter, logger);
    const authorizationService = new AuthorizationService(logger);
    const shopService = new ShopService();
    // TODO: const shopBackendShopsService = createShopBackendShopsService(shopRepository, logger);

    // Register services in the container
    container.registerInstance("AuthService", authService);
    container.registerInstance("ProfileService", profileService);
    container.registerInstance("AuthorizationService", authorizationService);
    container.registerInstance("ShopService", shopService);

    // Shop Backend services
    // TODO: container.registerInstance("ShopBackendShopsService", shopBackendShopsService);

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
