import { ShopStatsDTO } from '@/src/application/dtos/shop/backend/shops-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ShopMapper } from '@/src/application/mappers/backend/shop-mapper';
import type { ShopBackendShopRepository } from '@/src/domain/repositories/shop/backend/shop-backend-shop-repository';
import { ShopBackendShopError, ShopBackendShopErrorType } from '@/src/domain/repositories/shop/backend/shop-backend-shop-repository';

export class GetShopStatsUseCase implements IUseCase<void, ShopStatsDTO> {
  constructor(
    private readonly shopRepository: ShopBackendShopRepository
  ) { }

  async execute(): Promise<ShopStatsDTO> {
    try {
      const stats = await this.shopRepository.getShopStats();
      return ShopMapper.statsToDTO(stats);
    } catch (error) {
      if (error instanceof ShopBackendShopError) {
        throw error;
      }

      throw new ShopBackendShopError(
        ShopBackendShopErrorType.UNKNOWN,
        'Failed to get shop statistics',
        'GetShopStatsUseCase.execute',
        {},
        error
      );
    }
  }
}
