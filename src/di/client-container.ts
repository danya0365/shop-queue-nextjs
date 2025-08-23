"use client";

import { Logger } from "../domain/interfaces/logger";
import { ConsoleLogger } from "../infrastructure/loggers/console-logger";
import { Container, createContainer } from "./container";

/**
 * Initialize a client-side container with all dependencies
 * This function creates a new container instance each time it's called
 */
export function createClientContainer(): Container {
  const container = createContainer();

  // Register logger
  const logger = new ConsoleLogger();
  container.registerInstance<Logger>("Logger", logger);

  try {

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
