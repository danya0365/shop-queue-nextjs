import type {
  CreateShopSettingsEntity,
  PaginatedShopSettingsEntity,
  ShopSettingsEntity,
  ShopSettingsStatsEntity,
  ShopSettingsValidationResult,
  UpdateShopSettingsEntity,
} from "@/src/domain/entities/shop/backend/backend-shop-settings.entity";
import type { PaginationParams } from "@/src/domain/interfaces/pagination-types";

/**
 * Shop Settings repository error types
 */
export enum ShopBackendShopSettingsErrorType {
  NOT_FOUND = "not_found",
  OPERATION_FAILED = "operation_failed",
  VALIDATION_ERROR = "validation_error",
  UNAUTHORIZED = "unauthorized",
  UNKNOWN = "unknown",
}

/**
 * Custom error class for shop settings repository operations
 * Following Clean Architecture principles for error handling
 */
export class ShopBackendShopSettingsError extends Error {
  constructor(
    public readonly type: ShopBackendShopSettingsErrorType,
    message: string,
    public readonly operation?: string,
    public readonly context?: Record<string, unknown>,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "ShopBackendShopSettingsError";
  }
}

/**
 * Shop Settings repository interface
 * Following Clean Architecture principles and Interface Segregation Principle
 */
export interface ShopBackendShopSettingsRepository {
  /**
   * Get shop settings by shop ID
   * @param shopId Shop ID
   * @returns Shop settings entity or null if not found
   * @throws ShopBackendShopSettingsError if the operation fails
   */
  getShopSettingsByShopId(shopId: string): Promise<ShopSettingsEntity | null>;

  /**
   * Get paginated shop settings data
   * @param params Pagination parameters
   * @returns Paginated shop settings data
   * @throws ShopBackendShopSettingsError if the operation fails
   */
  getPaginatedShopSettings(
    params: PaginationParams
  ): Promise<PaginatedShopSettingsEntity>;

  /**
   * Get shop settings statistics
   * @param shopId Shop ID
   * @returns Shop settings statistics data
   * @throws ShopBackendShopSettingsError if the operation fails
   */
  getShopSettingsStats(shopId: string): Promise<ShopSettingsStatsEntity>;

  /**
   * Create shop settings
   * @param settings Shop settings data to create
   * @returns Created shop settings entity
   * @throws ShopBackendShopSettingsError if the operation fails
   */
  createShopSettings(
    settings: Omit<CreateShopSettingsEntity, "id" | "createdAt" | "updatedAt">
  ): Promise<ShopSettingsEntity>;

  /**
   * Update shop settings
   * @param shopId Shop ID
   * @param settings Shop settings data to update
   * @returns Updated shop settings entity
   * @throws ShopBackendShopSettingsError if the operation fails
   */
  updateShopSettings(
    shopId: string,
    settings: Partial<
      Omit<UpdateShopSettingsEntity, "id" | "createdAt" | "updatedAt">
    >
  ): Promise<ShopSettingsEntity>;

  /**
   * Reset shop settings to defaults
   * @param shopId Shop ID
   * @returns Reset shop settings entity
   * @throws ShopBackendShopSettingsError if the operation fails
   */
  resetShopSettingsToDefaults(shopId: string): Promise<ShopSettingsEntity>;

  /**
   * Delete shop settings
   * @param shopId Shop ID
   * @returns true if deleted successfully
   * @throws ShopBackendShopSettingsError if the operation fails
   */
  deleteShopSettings(shopId: string): Promise<boolean>;

  /**
   * Validate shop settings
   * @param settings Shop settings data to validate
   * @returns Validation result
   * @throws ShopBackendShopSettingsError if the operation fails
   */
  validateShopSettings(
    settings: Partial<ShopSettingsEntity>
  ): Promise<ShopSettingsValidationResult>;

  /**
   * Export shop settings
   * @param shopId Shop ID
   * @returns Exported settings data as JSON string
   * @throws ShopBackendShopSettingsError if the operation fails
   */
  exportShopSettings(shopId: string): Promise<string>;

  /**
   * Import shop settings
   * @param shopId Shop ID
   * @param settingsData Settings data as JSON string
   * @returns Imported shop settings entity
   * @throws ShopBackendShopSettingsError if the operation fails
   */
  importShopSettings(
    shopId: string,
    settingsData: string
  ): Promise<ShopSettingsEntity>;
}
