import type { DatabaseDataSource } from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";
import { SupabaseClientType } from "../../datasources/supabase-datasource";

/**
 * Base repository class that provides common functionality and enforces datasource type checking
 * Following SOLID principles and Clean Architecture
 */
export abstract class BaseRepository {
  /**
   * Constructor with dependency injection
   * @param dataSource Abstraction for database operations
   * @param logger Abstraction for logging
   * @param entityName Name of the entity this repository manages
   * @param allowedClientTypes Array of client types allowed for this repository
   */
  constructor(
    protected readonly dataSource: DatabaseDataSource,
    protected readonly logger: Logger,
    protected readonly entityName: string,
    protected readonly allowedClientTypes: SupabaseClientType[] = [
      SupabaseClientType.BROWSER,
      SupabaseClientType.SERVER,
      SupabaseClientType.ADMIN,
    ]
  ) {
    this.verifyClientType();
  }

  /**
   * Verifies that the datasource's client type is allowed for this repository
   * @throws Error if client type is not allowed
   */
  protected verifyClientType(): void {
    const clientType = (
      this.dataSource as { getClientType?: () => SupabaseClientType }
    ).getClientType?.();

    if (!clientType) {
      this.logger.warn(
        `${this.entityName} repository: Unable to determine client type, proceeding with caution`
      );
      return;
    }

    if (!this.allowedClientTypes.includes(clientType)) {
      const error = new Error(
        `${
          this.entityName
        } repository requires one of these client types: ${this.allowedClientTypes.join(
          ", "
        )}, but got: ${clientType}`
      );
      this.logger.error(
        `Client type verification failed for ${this.entityName} repository`,
        error
      );
      throw error;
    }
  }

  /**
   * Checks if the datasource has admin privileges
   * @returns boolean indicating if the datasource has admin privileges
   */
  protected hasAdminPrivileges(): boolean {
    const clientType = (
      this.dataSource as { getClientType?: () => SupabaseClientType }
    ).getClientType?.();
    return clientType === SupabaseClientType.ADMIN;
  }
}
