import {
  ShopSettingsDTO,
  UpdateShopSettingsInputDTO,
} from "@/src/application/dtos/shop/backend/shop-settings-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { ShopSettingsMapper } from "@/src/application/mappers/shop/backend/shop-settings-mapper";
import { UpdateShopSettingsEntity } from "@/src/domain/entities/shop/backend/backend-shop-settings.entity";
import type { ShopBackendShopSettingsRepository } from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";
import {
  ShopBackendShopSettingsError,
  ShopBackendShopSettingsErrorType,
} from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";

export class UpdateShopSettingsUseCase
  implements IUseCase<UpdateShopSettingsInputDTO, ShopSettingsDTO>
{
  constructor(
    private readonly shopSettingsRepository: ShopBackendShopSettingsRepository
  ) {}

  async execute(params: UpdateShopSettingsInputDTO): Promise<ShopSettingsDTO> {
    try {
      // Validate required fields
      if (!params.shopId?.trim()) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "UpdateShopSettingsUseCase.execute",
          { params }
        );
      }

      // Check if shop settings exist
      const existingSettings =
        await this.shopSettingsRepository.getShopSettingsByShopId(
          params.shopId
        );
      if (!existingSettings) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.NOT_FOUND,
          `Shop settings with shop ID ${params.shopId} not found`,
          "UpdateShopSettingsUseCase.execute",
          { params }
        );
      }

      // Create update entity
      const updateEntity: UpdateShopSettingsEntity =
        ShopSettingsMapper.updateToEntity(params);

      // Update shop settings
      const updatedSettings =
        await this.shopSettingsRepository.updateShopSettings(
          params.shopId,
          updateEntity
        );

      return ShopSettingsMapper.toDTO(updatedSettings);
    } catch (error) {
      if (error instanceof ShopBackendShopSettingsError) {
        throw error;
      }

      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.UNKNOWN,
        "Failed to update shop settings",
        "UpdateShopSettingsUseCase.execute",
        { params },
        error
      );
    }
  }
}
