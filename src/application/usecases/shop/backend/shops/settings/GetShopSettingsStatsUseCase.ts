import {
  GetShopSettingsStatsInput,
  ShopSettingsStatsDTO,
} from "@/src/application/dtos/shop/backend/shop-settings-dto";
import { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { ShopSettingsMapper } from "@/src/application/mappers/shop/backend/shop-settings-mapper";
import type { ShopBackendShopSettingsRepository } from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";
import {
  ShopBackendShopSettingsError,
  ShopBackendShopSettingsErrorType,
} from "@/src/domain/repositories/shop/backend/backend-shop-settings-repository";

export class GetShopSettingsStatsUseCase
  implements IUseCase<GetShopSettingsStatsInput, ShopSettingsStatsDTO>
{
  constructor(
    private readonly shopSettingsRepository: ShopBackendShopSettingsRepository
  ) {}

  async execute(
    params: GetShopSettingsStatsInput
  ): Promise<ShopSettingsStatsDTO> {
    try {
      if (!params.shopId?.trim()) {
        throw new ShopBackendShopSettingsError(
          ShopBackendShopSettingsErrorType.VALIDATION_ERROR,
          "Shop ID is required",
          "GetShopSettingsStatsUseCase.execute",
          { params }
        );
      }

      const stats = await this.shopSettingsRepository.getShopSettingsStats(
        params.shopId
      );
      return ShopSettingsMapper.statsToDTO(stats);
    } catch (error) {
      if (error instanceof ShopBackendShopSettingsError) {
        throw error;
      }

      throw new ShopBackendShopSettingsError(
        ShopBackendShopSettingsErrorType.UNKNOWN,
        "Failed to get shop settings statistics",
        "GetShopSettingsStatsUseCase.execute",
        { params },
        error
      );
    }
  }
}
