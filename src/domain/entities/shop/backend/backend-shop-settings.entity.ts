import { PaginatedResult } from "../../../interfaces/pagination-types";

/**
 * Shop Settings entity representing shop configuration
 * Following Clean Architecture principles - domain entity
 */
export interface ShopSettingsEntity {
  id: string;
  shopId: string;
  
  // Basic Settings
  estimatedServiceTime: number;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  sessionTimeout: number;
  backupFrequency: string | null;
  logLevel: string | null;
  dataRetentionDays: number;
  
  // Queue Settings
  autoConfirmQueues: boolean;
  maxQueueSize: number;
  maxQueuePerService: number;
  queueTimeoutMinutes: number;
  allowWalkIn: boolean;
  allowAdvanceBooking: boolean;
  maxAdvanceBookingDays: number;
  bookingWindowHours: number;
  cancellationDeadline: number;
  
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
  dateFormat: string;
  timeFormat: "12h" | "24h";
  
  // Advanced Settings
  autoConfirmBooking: boolean;
  requireCustomerPhone: boolean;
  allowGuestBooking: boolean;
  showPricesPublic: boolean;
  enableReviews: boolean;
  
  // Security Settings
  enableTwoFactor: boolean;
  requireEmailVerification: boolean;
  enableSessionTimeout: boolean;
  
  // Data & Privacy Settings
  enableAnalytics: boolean;
  enableDataBackup: boolean;
  allowDataExport: boolean;
  
  // API & Integration Settings
  apiKey: string;
  enableWebhooks: boolean;
  
  // Joined Shop Information
  shopName?: string;
  shopDescription?: string | null;
  shopPhone?: string | null;
  shopEmail?: string | null;
  shopAddress?: string | null;
  shopWebsite?: string | null;
  shopLogo?: string | null;
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateShopSettingsEntity {
  shopId: string;
  
  // Basic Settings
  estimatedServiceTime?: number;
  maintenanceMode?: boolean;
  allowRegistration?: boolean;
  sessionTimeout?: number;
  backupFrequency?: string | null;
  logLevel?: string | null;
  dataRetentionDays?: number;
  
  // Queue Settings
  autoConfirmQueues?: boolean;
  maxQueueSize?: number;
  maxQueuePerService?: number;
  queueTimeoutMinutes?: number;
  allowWalkIn?: boolean;
  allowAdvanceBooking?: boolean;
  maxAdvanceBookingDays?: number;
  bookingWindowHours?: number;
  cancellationDeadline?: number;
  
  // Points System
  pointsEnabled?: boolean;
  pointsPerBaht?: number;
  pointsExpiryMonths?: number;
  minimumPointsToRedeem?: number;
  
  // Notification Settings
  smsEnabled?: boolean;
  emailEnabled?: boolean;
  lineNotifyEnabled?: boolean;
  notifyBeforeMinutes?: number;
  
  // Payment Settings
  acceptCash?: boolean;
  acceptCreditCard?: boolean;
  acceptBankTransfer?: boolean;
  acceptPromptPay?: boolean;
  promptPayId?: string | null;
  
  // Display Settings
  theme?: "light" | "dark" | "auto";
  dateFormat?: string;
  timeFormat?: "12h" | "24h";
  
  // Advanced Settings
  autoConfirmBooking?: boolean;
  requireCustomerPhone?: boolean;
  allowGuestBooking?: boolean;
  showPricesPublic?: boolean;
  enableReviews?: boolean;
  
  // Security Settings
  enableTwoFactor?: boolean;
  requireEmailVerification?: boolean;
  enableSessionTimeout?: boolean;
  
  // Data & Privacy Settings
  enableAnalytics?: boolean;
  enableDataBackup?: boolean;
  allowDataExport?: boolean;
  
  // API & Integration Settings
  apiKey?: string;
  enableWebhooks?: boolean;
}

export interface UpdateShopSettingsEntity {
  // Basic Settings
  estimatedServiceTime?: number;
  maintenanceMode?: boolean;
  allowRegistration?: boolean;
  sessionTimeout?: number;
  backupFrequency?: string | null;
  logLevel?: string | null;
  dataRetentionDays?: number;
  
  // Queue Settings
  autoConfirmQueues?: boolean;
  maxQueueSize?: number;
  maxQueuePerService?: number;
  queueTimeoutMinutes?: number;
  allowWalkIn?: boolean;
  allowAdvanceBooking?: boolean;
  maxAdvanceBookingDays?: number;
  bookingWindowHours?: number;
  cancellationDeadline?: number;
  
  // Points System
  pointsEnabled?: boolean;
  pointsPerBaht?: number;
  pointsExpiryMonths?: number;
  minimumPointsToRedeem?: number;
  
  // Notification Settings
  smsEnabled?: boolean;
  emailEnabled?: boolean;
  lineNotifyEnabled?: boolean;
  notifyBeforeMinutes?: number;
  
  // Payment Settings
  acceptCash?: boolean;
  acceptCreditCard?: boolean;
  acceptBankTransfer?: boolean;
  acceptPromptPay?: boolean;
  promptPayId?: string | null;
  
  // Display Settings
  theme?: "light" | "dark" | "auto";
  dateFormat?: string;
  timeFormat?: "12h" | "24h";
  
  // Advanced Settings
  autoConfirmBooking?: boolean;
  requireCustomerPhone?: boolean;
  allowGuestBooking?: boolean;
  showPricesPublic?: boolean;
  enableReviews?: boolean;
  
  // Security Settings
  enableTwoFactor?: boolean;
  requireEmailVerification?: boolean;
  enableSessionTimeout?: boolean;
  
  // Data & Privacy Settings
  enableAnalytics?: boolean;
  enableDataBackup?: boolean;
  allowDataExport?: boolean;
  
  // API & Integration Settings
  apiKey?: string;
  enableWebhooks?: boolean;
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
