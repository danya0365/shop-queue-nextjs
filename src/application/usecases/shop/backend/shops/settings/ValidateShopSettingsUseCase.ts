import {
  ShopSettingsValidationResultDTO,
  ValidateShopSettingsInput,
} from "@/src/application/dtos/shop/backend/shop-settings-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type { ShopSettingsEntity } from "@/src/domain/entities/shop/backend/backend-shop-settings.entity";
import type { ShopBackendShopSettingsRepository } from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";
import {
  ShopBackendShopSettingsError,
  ShopBackendShopSettingsErrorType,
} from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";

export class ValidateShopSettingsUseCase
  implements
    IUseCase<ValidateShopSettingsInput, ShopSettingsValidationResultDTO>
{
  constructor(
    private readonly shopSettingsRepository: ShopBackendShopSettingsRepository
  ) {}

  async execute(
    params: ValidateShopSettingsInput
  ): Promise<ShopSettingsValidationResultDTO> {
    try {
      const validationResult: ShopSettingsValidationResultDTO = {
        isValid: true,
        errors: [],
      };

      // Validate shop settings
      this.validateShopSettings(params.settings, validationResult);

      // Update overall validation status
      validationResult.isValid = validationResult.errors.length === 0;

      return validationResult;
    } catch (error) {
      if (error instanceof ShopBackendShopSettingsError) {
        throw error;
      }

      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.UNKNOWN,
        "Failed to validate shop settings",
        "ValidateShopSettingsUseCase.execute",
        { params },
        error
      );
    }
  }

  private validateShopSettings(
    settings: Partial<ShopSettingsEntity>,
    result: ShopSettingsValidationResultDTO
  ): void {
    // Validate basic shop information
    if (settings.shopName !== undefined) {
      if (!settings.shopName?.trim()) {
        result.errors.push("Shop name cannot be empty");
      } else if (settings.shopName.length > 100) {
        result.errors.push("Shop name cannot exceed 100 characters");
      }
    }

    if (settings.shopDescription !== undefined) {
      if (settings.shopDescription && settings.shopDescription.length > 500) {
        result.errors.push("Shop description cannot exceed 500 characters");
      }
    }

    if (settings.shopPhone !== undefined) {
      if (settings.shopPhone && !this.isValidPhone(settings.shopPhone)) {
        result.errors.push("Invalid phone number format");
      }
    }

    if (settings.shopEmail !== undefined) {
      if (settings.shopEmail && !this.isValidEmail(settings.shopEmail)) {
        result.errors.push("Invalid email format");
      }
    }

    // Validate queue settings
    if (settings.maxQueuePerService !== undefined) {
      if (
        settings.maxQueuePerService < 1 ||
        settings.maxQueuePerService > 1000
      ) {
        result.errors.push("Max queue per service must be between 1 and 1000");
      }
    }

    if (settings.queueTimeoutMinutes !== undefined) {
      if (
        settings.queueTimeoutMinutes < 1 ||
        settings.queueTimeoutMinutes > 1440
      ) {
        result.errors.push("Queue timeout must be between 1 and 1440 minutes");
      }
    }

    if (settings.maxAdvanceBookingDays !== undefined) {
      if (
        settings.maxAdvanceBookingDays < 1 ||
        settings.maxAdvanceBookingDays > 365
      ) {
        result.errors.push(
          "Max advance booking days must be between 1 and 365"
        );
      }
    }

    // Validate points settings
    if (settings.pointsEnabled !== undefined) {
      // No validation needed for boolean
    }

    if (settings.pointsPerBaht !== undefined) {
      if (settings.pointsPerBaht < 0) {
        result.errors.push(
          "Points per baht must be greater than or equal to 0"
        );
      }
    }

    if (settings.minimumPointsToRedeem !== undefined) {
      if (settings.minimumPointsToRedeem < 0) {
        result.errors.push(
          "Minimum points to redeem must be greater than or equal to 0"
        );
      }
    }

    // Validate notification settings
    if (settings.notifyBeforeMinutes !== undefined) {
      if (
        settings.notifyBeforeMinutes < 1 ||
        settings.notifyBeforeMinutes > 1440
      ) {
        result.errors.push("Notify before minutes must be between 1 and 1440");
      }
    }

    // Validate payment settings

    // Validate display settings
    if (settings.theme !== undefined) {
      if (!["light", "dark", "auto"].includes(settings.theme)) {
        result.errors.push("Theme must be one of: light, dark, auto");
      }
    }

  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[+]?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  }
}
