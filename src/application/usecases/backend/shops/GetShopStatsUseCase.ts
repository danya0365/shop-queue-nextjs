import { ShopStatsDTO } from '@/src/application/dtos/backend/shops-dto';
import { ShopMapper } from '@/src/application/mappers/backend/shop-mapper';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { BackendShopRepository } from '@/src/domain/repositories/backend/backend-shop-repository';

/**
 * Use case for getting shop statistics
 * Following SOLID principles and Clean Architecture
 */
export class GetShopStatsUseCase implements IUseCase<void, ShopStatsDTO> {
  constructor(
    private readonly shopRepository: BackendShopRepository
  ) { }

  /**
   * Execute the use case to get shop statistics
   * @returns Shop statistics DTO
   */
  async execute(): Promise<ShopStatsDTO> {
    const stats = await this.shopRepository.getShopStats();
    const statsDTO = ShopMapper.statsToDTO(stats);
    return statsDTO;
  }
}
