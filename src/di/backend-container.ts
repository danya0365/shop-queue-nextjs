
import { Logger } from "../domain/interfaces/logger";
import { ConsoleLogger } from "../infrastructure/loggers/console-logger";
import { Container, createContainer } from "./container";

/**
 * Initialize a backend container with elevated privilege dependencies
 * This container should ONLY be used in server-side code with proper authentication checks
 * It provides access to admin-level operations that bypass RLS
 */
export async function createBackendContainer(): Promise<Container> {
  const container = createContainer();

  // Register logger
  const logger = new ConsoleLogger();
  container.registerInstance<Logger>("Logger", logger);

  try {
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

