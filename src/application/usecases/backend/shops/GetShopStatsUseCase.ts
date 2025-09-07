import { ShopStatsDTO } from '@/src/application/dtos/backend/shops-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ShopMapper } from '@/src/application/mappers/backend/shop-mapper';
import type { BackendShopRepository } from '@/src/domain/repositories/backend/backend-shop-repository';
import { BackendShopError, BackendShopErrorType } from '@/src/domain/repositories/backend/backend-shop-repository';

export class GetShopStatsUseCase implements IUseCase<void, ShopStatsDTO> {
  constructor(
    private readonly shopRepository: BackendShopRepository
  ) { }

  async execute(): Promise<ShopStatsDTO> {
    try {
      const stats = await this.shopRepository.getShopStats();
      return ShopMapper.statsToDTO(stats);
    } catch (error) {
      if (error instanceof BackendShopError) {
        throw error;
      }

      throw new BackendShopError(
        BackendShopErrorType.UNKNOWN,
        'Failed to get shop statistics',
        'GetShopStatsUseCase.execute',
        {},
        error
      );
    }
  }
}
