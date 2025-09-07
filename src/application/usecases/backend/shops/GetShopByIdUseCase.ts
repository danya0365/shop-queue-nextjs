import { ShopDTO } from '@/src/application/dtos/backend/shops-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ShopMapper } from '@/src/application/mappers/backend/shop-mapper';
import type { BackendShopRepository } from '@/src/domain/repositories/backend/backend-shop-repository';
import { BackendShopError, BackendShopErrorType } from '@/src/domain/repositories/backend/backend-shop-repository';

export class GetShopByIdUseCase implements IUseCase<string, ShopDTO> {
  constructor(
    private readonly shopRepository: BackendShopRepository
  ) { }

  async execute(id: string): Promise<ShopDTO> {
    try {
      if (!id) {
        throw new BackendShopError(
          BackendShopErrorType.VALIDATION_ERROR,
          'Shop ID is required',
          'GetShopByIdUseCase.execute',
          { id }
        );
      }

      const shop = await this.shopRepository.getShopById(id);
      
      if (!shop) {
        throw new BackendShopError(
          BackendShopErrorType.NOT_FOUND,
          `Shop with ID ${id} not found`,
          'GetShopByIdUseCase.execute',
          { id }
        );
      }

      return ShopMapper.toDTO(shop);
    } catch (error) {
      if (error instanceof BackendShopError) {
        throw error;
      }

      throw new BackendShopError(
        BackendShopErrorType.UNKNOWN,
        'Failed to get shop by ID',
        'GetShopByIdUseCase.execute',
        { id },
        error
      );
    }
  }
}
