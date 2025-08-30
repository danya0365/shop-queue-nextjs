import { ShopStatsEntity } from "../../../../domain/entities/backend/backend-shop.entity";
import { Logger } from "../../../../domain/interfaces/logger";
import { BackendShopRepository } from "../../../../domain/repositories/backend/backend-shop-repository";
import { IUseCase } from "../../../interfaces/use-case.interface";

/**
 * Use case for getting shop statistics
 * Following SOLID principles and Clean Architecture
 */
export class GetShopStatsUseCase implements IUseCase<void, ShopStatsEntity> {
  constructor(
    private shopRepository: BackendShopRepository,
    private logger: Logger
  ) { }

  /**
   * Execute the use case to get shop statistics
   * @returns Shop statistics
   */
  async execute(): Promise<ShopStatsEntity> {
    try {
      this.logger.info('GetShopStatsUseCase.execute');
      return await this.shopRepository.getShopStats();
    } catch (error) {
      this.logger.error('Error in GetShopStatsUseCase.execute', { error });
      throw error;
    }
  }
}
