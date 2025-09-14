import {
  CreateShopSettingsInputDTO,
  ShopSettingsDTO,
} from "@/src/application/dtos/shop/backend/shop-settings-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { ShopSettingsMapper } from "@/src/application/mappers/shop/backend/shop-settings-mapper";
import { CreateShopSettingsEntity } from "@/src/domain/entities/shop/backend/backend-shop-settings.entity";
import type { ShopBackendShopSettingsRepository } from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";
import {
  ShopBackendShopSettingsError,
  ShopBackendShopSettingsErrorType,
} from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";

export class CreateShopSettingsUseCase
  implements IUseCase<CreateShopSettingsInputDTO, ShopSettingsDTO>
{
  constructor(
    private readonly shopSettingsRepository: ShopBackendShopSettingsRepository
  ) {}

  async execute(params: CreateShopSettingsInputDTO): Promise<ShopSettingsDTO> {
    try {
      // Validate required fields
      if (!params.shopId?.trim()) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "CreateShopSettingsUseCase.execute",
          { params }
        );
      }

      // Validate business hours if provided
      if (params.defaultOpenTime || params.defaultCloseTime) {
        this.validateBusinessHours(params);
      }

      // Validate queue settings if provided
      if (params.maxQueuePerService || params.queueTimeoutMinutes) {
        this.validateQueueSettings(params);
      }

      // Validate points settings if provided
      if (params.pointsEnabled || params.pointsPerBaht) {
        this.validatePointsSettings(params);
      }

      // Check if settings already exist for this shop
      const existingSettings =
        await this.shopSettingsRepository.getShopSettingsByShopId(
          params.shopId
        );
      if (existingSettings) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
          `Shop settings already exist for shop ID ${params.shopId}`,
          "CreateShopSettingsUseCase.execute",
          { shopId: params.shopId }
        );
      }

      // Create shop settings entity
      const entity: CreateShopSettingsEntity =
        ShopSettingsMapper.createToEntity(params);

      const createdShopSettings =
        await this.shopSettingsRepository.createShopSettings(entity);
      return ShopSettingsMapper.toDTO(createdShopSettings);
    } catch (error) {
      if (error instanceof ShopBackendShopSettingsError) {
        throw error;
      }

      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.UNKNOWN,
        "Failed to create shop settings",
        "CreateShopSettingsUseCase.execute",
        { params },
        error
      );
    }
  }

  private validateBusinessHours(params: CreateShopSettingsInputDTO): void {
    if (
      params.defaultOpenTime &&
      !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(params.defaultOpenTime)
    ) {
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
        "Default open time must be in HH:MM format",
        "CreateShopSettingsUseCase.validateBusinessHours",
        { defaultOpenTime: params.defaultOpenTime }
      );
    }

    if (
      params.defaultCloseTime &&
      !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(params.defaultCloseTime)
    ) {
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
        "Default close time must be in HH:MM format",
        "CreateShopSettingsUseCase.validateBusinessHours",
        { defaultCloseTime: params.defaultCloseTime }
      );
    }
  }

  private validateQueueSettings(params: CreateShopSettingsInputDTO): void {
    if (
      params.maxQueuePerService &&
      (params.maxQueuePerService < 1 || params.maxQueuePerService > 1000)
    ) {
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
        "Max queue per service must be between 1 and 1000",
        "CreateShopSettingsUseCase.validateQueueSettings",
        { maxQueuePerService: params.maxQueuePerService }
      );
    }

    if (params.queueTimeoutMinutes && params.queueTimeoutMinutes < 1) {
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
        "Queue timeout minutes must be greater than 0",
        "CreateShopSettingsUseCase.validateQueueSettings",
        { queueTimeoutMinutes: params.queueTimeoutMinutes }
      );
    }
  }

  private validatePointsSettings(params: CreateShopSettingsInputDTO): void {
    if (params.pointsPerBaht && params.pointsPerBaht < 0) {
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
        "Points per baht must be greater than or equal to 0",
        "CreateShopSettingsUseCase.validatePointsSettings",
        { pointsPerBaht: params.pointsPerBaht }
      );
    }

    if (params.pointsExpiryMonths && params.pointsExpiryMonths < 0) {
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
        "Points expiry months must be greater than or equal to 0",
        "CreateShopSettingsUseCase.validatePointsSettings",
        { pointsExpiryMonths: params.pointsExpiryMonths }
      );
    }

    if (params.minimumPointsToRedeem && params.minimumPointsToRedeem < 0) {
      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
        "Minimum points to redeem must be greater than or equal to 0",
        "CreateShopSettingsUseCase.validatePointsSettings",
        { minimumPointsToRedeem: params.minimumPointsToRedeem }
      );
    }
  }
}
