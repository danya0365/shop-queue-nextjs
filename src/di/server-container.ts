
import { Logger } from "../domain/interfaces/logger";
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
    // Create and register server datasources
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
