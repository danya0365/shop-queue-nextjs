import { PaginatedResult } from "../../../interfaces/pagination-types";

/**
 * Shop Settings entity representing shop configuration
 * Following Clean Architecture principles - domain entity
 */
export interface ShopSettingsEntity {
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

export interface CreateShopSettingsEntity {
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

export interface UpdateShopSettingsEntity {
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
 * Shop Settings statistics entity
 */
export interface ShopSettingsStatsEntity {
  totalSettings: number;
  lastUpdated: string;
  enabledFeatures: string[];
  disabledFeatures: string[];
  integrationStatus: Record<string, boolean>;
}

/**
 * Shop Settings validation result
 */
export interface ShopSettingsValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Paginated shop settings result
 */
export type PaginatedShopSettingsEntity = PaginatedResult<ShopSettingsEntity>;
