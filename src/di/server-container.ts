
import { AuthService } from "../application/services/auth-service";
import { AuthorizationService } from "../application/services/authorization.service";
import { ProfileService } from "../application/services/profile-service";
import { ShopService } from "../application/services/shop-service";
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
