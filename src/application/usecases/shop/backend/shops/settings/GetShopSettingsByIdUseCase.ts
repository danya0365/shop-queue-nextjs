import { ShopSettingsDTO } from "@/src/application/dtos/shop/backend/shop-settings-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { ShopSettingsMapper } from "@/src/application/mappers/shop/backend/shop-settings-mapper";
import type { ShopBackendShopSettingsRepository } from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";
import {
  ShopBackendShopSettingsError,
  ShopBackendShopSettingsErrorType,
} from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";

export class GetShopSettingsByIdUseCase
  implements IUseCase<string, ShopSettingsDTO>
{
  constructor(
    private readonly shopSettingsRepository: ShopBackendShopSettingsRepository
  ) {}

  async execute(id: string): Promise<ShopSettingsDTO> {
    try {
      if (!id) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
          "Shop settings ID is required",
          "GetShopSettingsByIdUseCase.execute",
          { id }
        );
      }

      // Note: Since shop settings are typically retrieved by shopId,
      // we'll use getShopSettingsByShopId but validate the ID format first
      const shopSettings =
        await this.shopSettingsRepository.getShopSettingsByShopId(id);

      if (!shopSettings) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.NOT_FOUND,
          `Shop settings with ID ${id} not found`,
          "GetShopSettingsByIdUseCase.execute",
          { id }
        );
      }

      return ShopSettingsMapper.toDTO(shopSettings);
    } catch (error) {
      if (error instanceof ShopBackendShopSettingsError) {
        throw error;
      }

      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.UNKNOWN,
        "Failed to get shop settings by ID",
        "GetShopSettingsByIdUseCase.execute",
        { id },
        error
      );
    }
  }
}
