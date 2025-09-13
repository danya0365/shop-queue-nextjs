/**
 * Pagination Configuration
 * Centralized configuration for pagination settings across the application
 * Follows Clean Architecture principles by separating configuration from business logic
 */

export interface PaginationConfig {
  // Default items per page for different modules
  readonly DEFAULT_PER_PAGE: number;
  readonly SERVICES_PER_PAGE: number;
  readonly CUSTOMERS_PER_PAGE: number;
  readonly EMPLOYEES_PER_PAGE: number;
  readonly QUEUES_PER_PAGE: number;
  readonly PAYMENTS_PER_PAGE: number;
  readonly PROMOTIONS_PER_PAGE: number;
  readonly REWARDS_PER_PAGE: number;
  readonly PROFILES_PER_PAGE: number;
  readonly SHOPS_PER_PAGE: number;

  // Pagination limits
  readonly MIN_PER_PAGE: number;
  readonly MAX_PER_PAGE: number;

  // Available per page options for dropdown
  readonly PER_PAGE_OPTIONS: readonly number[];

  // API pagination settings
  readonly DEFAULT_PAGE: number;
  readonly MAX_API_LIMIT: number;
}

/**
 * Default pagination configuration
 * Can be overridden by environment variables or feature flags
 */
export const DEFAULT_PAGINATION_CONFIG: PaginationConfig = {
  // Default items per page for different modules
  DEFAULT_PER_PAGE: 10,
  SERVICES_PER_PAGE: 10,
  CUSTOMERS_PER_PAGE: 20,
  EMPLOYEES_PER_PAGE: 20,
  QUEUES_PER_PAGE: 15,
  PAYMENTS_PER_PAGE: 20,
  PROMOTIONS_PER_PAGE: 15,
  REWARDS_PER_PAGE: 15,
  PROFILES_PER_PAGE: 20,
  SHOPS_PER_PAGE: 10,

  // Pagination limits
  MIN_PER_PAGE: 1,
  MAX_PER_PAGE: 100,

  // Available per page options for dropdown
  PER_PAGE_OPTIONS: [1, 5, 10, 20, 50, 100] as const,

  // API pagination settings
  DEFAULT_PAGE: 1,
  MAX_API_LIMIT: 1000,
} as const;

/**
 * Pagination configuration provider
 * Allows for environment-based configuration overrides
 */
export class PaginationConfigProvider {
  private static instance: PaginationConfigProvider;
  private config: PaginationConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): PaginationConfigProvider {
    if (!PaginationConfigProvider.instance) {
      PaginationConfigProvider.instance = new PaginationConfigProvider();
    }
    return PaginationConfigProvider.instance;
  }

  /**
   * Load configuration with environment overrides
   */
  private loadConfig(): PaginationConfig {
    const config = { ...DEFAULT_PAGINATION_CONFIG };

    // Override with environment variables if available
    if (process.env.NEXT_PUBLIC_DEFAULT_PER_PAGE) {
      const defaultPerPage = parseInt(
        process.env.NEXT_PUBLIC_DEFAULT_PER_PAGE,
        10
      );
      if (
        !isNaN(defaultPerPage) &&
        defaultPerPage >= config.MIN_PER_PAGE &&
        defaultPerPage <= config.MAX_PER_PAGE
      ) {
        config.DEFAULT_PER_PAGE = defaultPerPage;
      }
    }

    if (process.env.NEXT_PUBLIC_SERVICES_PER_PAGE) {
      const servicesPerPage = parseInt(
        process.env.NEXT_PUBLIC_SERVICES_PER_PAGE,
        10
      );
      if (
        !isNaN(servicesPerPage) &&
        servicesPerPage >= config.MIN_PER_PAGE &&
        servicesPerPage <= config.MAX_PER_PAGE
      ) {
        config.SERVICES_PER_PAGE = servicesPerPage;
      }
    }

    // Add more environment overrides as needed...

    return config;
  }

  /**
   * Get current configuration
   */
  public getConfig(): PaginationConfig {
    return { ...this.config };
  }

  /**
   * Get per page limit for a specific module
   */
  public getPerPageLimit(
    module: keyof Omit<
      PaginationConfig,
      | "MIN_PER_PAGE"
      | "MAX_PER_PAGE"
      | "PER_PAGE_OPTIONS"
      | "DEFAULT_PAGE"
      | "MAX_API_LIMIT"
    >
  ): number {
    return this.config[module];
  }

  /**
   * Validate per page value
   */
  public validatePerPage(perPage: number): boolean {
    return (
      perPage >= this.config.MIN_PER_PAGE && perPage <= this.config.MAX_PER_PAGE
    );
  }

  /**
   * Get closest valid per page value
   */
  public getValidPerPage(perPage: number): number {
    if (perPage < this.config.MIN_PER_PAGE) return this.config.MIN_PER_PAGE;
    if (perPage > this.config.MAX_PER_PAGE) return this.config.MAX_PER_PAGE;
    return perPage;
  }

  /**
   * Get available per page options
   */
  public getPerPageOptions(): readonly number[] {
    return this.config.PER_PAGE_OPTIONS;
  }

  /**
   * Check if per page option is valid
   */
  public isValidPerPageOption(perPage: number): boolean {
    return this.config.PER_PAGE_OPTIONS.includes(perPage);
  }
}

/**
 * Convenience function to get pagination config
 */
export function getPaginationConfig(): PaginationConfig {
  return PaginationConfigProvider.getInstance().getConfig();
}

/**
 * Convenience function to get per page limit for a module
 */
export function getPerPageLimit(
  module: keyof Omit<
    PaginationConfig,
    | "MIN_PER_PAGE"
    | "MAX_PER_PAGE"
    | "PER_PAGE_OPTIONS"
    | "DEFAULT_PAGE"
    | "MAX_API_LIMIT"
  >
): number {
  return PaginationConfigProvider.getInstance().getPerPageLimit(module);
}
