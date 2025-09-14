import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";
import { 
  ShopSettingsEntity
} from "@/src/domain/entities/shop/backend/backend-shop-settings.entity";

/**
 * Shop Settings DTO for data transfer between layers
 */
export interface ShopSettingsDTO {
  id: string;
  shopId: string;
  // Basic Shop Information
  shopName: string;
  shopDescription: string | null;
  shopPhone: string | null;
  shopEmail: string | null;
  shopAddress: string | null;
  shopWebsite: string | null;
  shopLogo: string | null;

  // Business Hours
  timezone: string;
  defaultOpenTime: string;
  defaultCloseTime: string;

  // Queue Settings
  maxQueuePerService: number;
  queueTimeoutMinutes: number;
  allowWalkIn: boolean;
  allowAdvanceBooking: boolean;
  maxAdvanceBookingDays: number;

  // Points System
  pointsEnabled: boolean;
  pointsPerBaht: number;
  pointsExpiryMonths: number;
  minimumPointsToRedeem: number;

  // Notification Settings
  smsEnabled: boolean;
  emailEnabled: boolean;
  lineNotifyEnabled: boolean;
  notifyBeforeMinutes: number;

  // Payment Settings
  acceptCash: boolean;
  acceptCreditCard: boolean;
  acceptBankTransfer: boolean;
  acceptPromptPay: boolean;
  promptPayId: string | null;

  // Display Settings
  theme: "light" | "dark" | "auto";
  language: "th" | "en";
  currency: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";

  // Advanced Settings
  autoConfirmBooking: boolean;
  requireCustomerPhone: boolean;
  allowGuestBooking: boolean;
  showPricesPublic: boolean;
  enableReviews: boolean;

  createdAt: string;
  updatedAt: string;
}

/**
 * Input DTO for CreateShopSettingsUseCase
 */
export interface CreateShopSettingsInputDTO {
  shopId: string;
  shopName: string;
  shopDescription?: string | null;
  shopPhone?: string | null;
  shopEmail?: string | null;
  shopAddress?: string | null;
  shopWebsite?: string | null;
  shopLogo?: string | null;
  timezone?: string;
  defaultOpenTime?: string;
  defaultCloseTime?: string;
  maxQueuePerService?: number;
  queueTimeoutMinutes?: number;
  allowWalkIn?: boolean;
  allowAdvanceBooking?: boolean;
  maxAdvanceBookingDays?: number;
  pointsEnabled?: boolean;
  pointsPerBaht?: number;
  pointsExpiryMonths?: number;
  minimumPointsToRedeem?: number;
  smsEnabled?: boolean;
  emailEnabled?: boolean;
  lineNotifyEnabled?: boolean;
  notifyBeforeMinutes?: number;
  acceptCash?: boolean;
  acceptCreditCard?: boolean;
  acceptBankTransfer?: boolean;
  acceptPromptPay?: boolean;
  promptPayId?: string | null;
  theme?: "light" | "dark" | "auto";
  language?: "th" | "en";
  currency?: string;
  dateFormat?: string;
  timeFormat?: "12h" | "24h";
  autoConfirmBooking?: boolean;
  requireCustomerPhone?: boolean;
  allowGuestBooking?: boolean;
  showPricesPublic?: boolean;
  enableReviews?: boolean;
}

/**
 * Input DTO for UpdateShopSettingsUseCase
 */
export interface UpdateShopSettingsInputDTO {
  shopId: string;
  shopName?: string;
  shopDescription?: string | null;
  shopPhone?: string | null;
  shopEmail?: string | null;
  shopAddress?: string | null;
  shopWebsite?: string | null;
  shopLogo?: string | null;
  timezone?: string;
  defaultOpenTime?: string;
  defaultCloseTime?: string;
  maxQueuePerService?: number;
  queueTimeoutMinutes?: number;
  allowWalkIn?: boolean;
  allowAdvanceBooking?: boolean;
  maxAdvanceBookingDays?: number;
  pointsEnabled?: boolean;
  pointsPerBaht?: number;
  pointsExpiryMonths?: number;
  minimumPointsToRedeem?: number;
  smsEnabled?: boolean;
  emailEnabled?: boolean;
  lineNotifyEnabled?: boolean;
  notifyBeforeMinutes?: number;
  acceptCash?: boolean;
  acceptCreditCard?: boolean;
  acceptBankTransfer?: boolean;
  acceptPromptPay?: boolean;
  promptPayId?: string | null;
  theme?: "light" | "dark" | "auto";
  language?: "th" | "en";
  currency?: string;
  dateFormat?: string;
  timeFormat?: "12h" | "24h";
  autoConfirmBooking?: boolean;
  requireCustomerPhone?: boolean;
  allowGuestBooking?: boolean;
  showPricesPublic?: boolean;
  enableReviews?: boolean;
}

/**
 * Input DTO for GetShopSettingsUseCase
 */
export interface GetShopSettingsInput {
  shopId: string;
}

/**
 * Input DTO for GetShopSettingsPaginatedUseCase
 */
export interface GetShopSettingsPaginatedInput {
  page: number;
  limit: number;
}

/**
 * Input DTO for GetShopSettingsStatsUseCase
 */
export interface GetShopSettingsStatsInput {
  shopId: string;
}

/**
 * Input DTO for DeleteShopSettingsUseCase
 */
export interface DeleteShopSettingsInput {
  shopId: string;
}

/**
 * Input DTO for ValidateShopSettingsUseCase
 */
export interface ValidateShopSettingsInput {
  settings: Partial<ShopSettingsEntity>;
}

/**
 * Input DTO for ExportShopSettingsUseCase
 */
export interface ExportShopSettingsInput {
  shopId: string;
  format: 'json' | 'csv' | 'xml';
  includeBasicInfo?: boolean;
  includeBusinessHours?: boolean;
  includeQueueSettings?: boolean;
  includePointsSettings?: boolean;
  includeNotificationSettings?: boolean;
  includePaymentSettings?: boolean;
  includeDisplaySettings?: boolean;
  includeAdvancedSettings?: boolean;
}

/**
 * Input DTO for ImportShopSettingsUseCase
 */
export interface ImportShopSettingsInput {
  shopId: string;
  settingsData: string;
}

/**
 * Input DTO for ResetShopSettingsUseCase
 */
export interface ResetShopSettingsInput {
  shopId: string;
  resetBasicInfo?: boolean;
  resetBusinessHours?: boolean;
  resetQueueSettings?: boolean;
  resetPointsSettings?: boolean;
  resetNotificationSettings?: boolean;
  resetPaymentSettings?: boolean;
  resetDisplaySettings?: boolean;
  resetAdvancedSettings?: boolean;
  resetBy?: string;
}

/**
 * Output DTO for ResetShopSettingsUseCase
 */
export interface ResetShopSettingsOutput {
  success: boolean;
  message: string;
  resetSections: string[];
  originalValues: Record<string, unknown>;
  resetAt: string;
  resetBy: string;
}

/**
 * Shop Settings Stats DTO
 */
export interface ShopSettingsStatsDTO {
  totalSettings: number;
  lastUpdated: string;
  enabledFeatures: string[];
  disabledFeatures: string[];
  integrationStatus: Record<string, boolean>;
}

/**
 * Shop Settings Data DTO for combined responses
 */
export interface ShopSettingsDataDTO {
  settings: ShopSettingsDTO[];
  stats: ShopSettingsStatsDTO;
  totalCount: number;
  currentPage: number;
  perPage: number;
}

/**
 * Paginated Shop Settings DTO
 */
export type PaginatedShopSettingsDTO = PaginatedResult<ShopSettingsDTO>;

/**
 * Shop Settings Validation Result DTO
 */
export interface ShopSettingsValidationResultDTO {
  isValid: boolean;
  errors: string[];
}

/**
 * Output DTO for ExportShopSettingsUseCase
 */
export interface ExportShopSettingsOutput {
  content: string;
  contentType: string;
  fileName: string;
  checksum: string;
  exportedAt: string;
  version: string;
  size: number;
}
