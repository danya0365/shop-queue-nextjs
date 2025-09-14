import {
  GetShopSettingsInput,
  ShopSettingsDTO,
} from "@/src/application/dtos/shop/backend/shop-settings-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { ShopSettingsMapper } from "@/src/application/mappers/shop/backend/shop-settings-mapper";
import { ShopSettingsEntity } from "@/src/domain/entities/shop/backend/backend-shop-settings.entity";
import {
  ShopBackendShopSettingsError,
  ShopBackendShopSettingsErrorType,
  ShopBackendShopSettingsRepository,
} from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";

export class GetShopSettingsUseCase
  implements IUseCase<GetShopSettingsInput, ShopSettingsDTO>
{
  constructor(
    private readonly shopSettingsRepository: ShopBackendShopSettingsRepository
  ) {}

  async execute(params: GetShopSettingsInput): Promise<ShopSettingsDTO> {
    try {
      // Validate required fields
      if (!params.shopId?.trim()) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetShopSettingsUseCase.execute",
          { params }
        );
      }

      const shopSettings: ShopSettingsEntity | null =
        await this.shopSettingsRepository.getShopSettingsByShopId(
          params.shopId
        );

      if (!shopSettings) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.NOT_FOUND,
          `Shop settings with shop ID ${params.shopId} not found`,
          "GetShopSettingsUseCase.execute",
          { params }
        );
      }

      // Map to DTO
      const shopSettingsDTO = ShopSettingsMapper.toDTO(shopSettings);

      return shopSettingsDTO;
    } catch (error) {
      if (error instanceof ShopBackendShopSettingsError) {
        throw error;
      }

      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.UNKNOWN,
        "Failed to get shop settings",
        "GetShopSettingsUseCase.execute",
        { params },
        error
      );
    }
  }
}
