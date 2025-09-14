import { DeleteShopSettingsInput } from "@/src/application/dtos/shop/backend/shop-settings-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type { ShopBackendShopSettingsRepository } from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";
import {
  ShopBackendShopSettingsError,
  ShopBackendShopSettingsErrorType,
} from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";

export class DeleteShopSettingsUseCase
  implements IUseCase<DeleteShopSettingsInput, boolean>
{
  constructor(
    private readonly shopSettingsRepository: ShopBackendShopSettingsRepository
  ) {}

  async execute(params: DeleteShopSettingsInput): Promise<boolean> {
    try {
      if (!params.shopId?.trim()) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "DeleteShopSettingsUseCase.execute",
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
          "DeleteShopSettingsUseCase.execute",
          { params }
        );
      }

      return await this.shopSettingsRepository.deleteShopSettings(
        params.shopId
      );
    } catch (error) {
      if (error instanceof ShopBackendShopSettingsError) {
        throw error;
      }

      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.UNKNOWN,
        "Failed to delete shop settings",
        "DeleteShopSettingsUseCase.execute",
        { params },
        error
      );
    }
  }
}
