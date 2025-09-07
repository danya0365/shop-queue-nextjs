import { ShopDTO } from '@/src/application/dtos/shop/backend/shops-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ShopMapper } from '@/src/application/mappers/backend/shop-mapper';
import type { ShopBackendShopRepository } from '@/src/domain/repositories/shop/backend/shop-backend-shop-repository';
import { ShopBackendShopError, ShopBackendShopErrorType } from '@/src/domain/repositories/shop/backend/shop-backend-shop-repository';

export class GetShopByIdUseCase implements IUseCase<string, ShopDTO> {
  constructor(
    private readonly shopRepository: ShopBackendShopRepository
  ) { }

  async execute(id: string): Promise<ShopDTO> {
    try {
      if (!id) {
        throw new ShopBackendShopError(
          ShopBackendShopErrorType.VALIDATION_ERROR,
          'Shop ID is required',
          'GetShopByIdUseCase.execute',
          { id }
        );
      }

      const shop = await this.shopRepository.getShopById(id);

      if (!shop) {
        throw new ShopBackendShopError(
          ShopBackendShopErrorType.NOT_FOUND,
          `Shop with ID ${id} not found`,
          'GetShopByIdUseCase.execute',
          { id }
        );
      }

      return ShopMapper.toDTO(shop);
    } catch (error) {
      if (error instanceof ShopBackendShopError) {
        throw error;
      }

      throw new ShopBackendShopError(
        ShopBackendShopErrorType.UNKNOWN,
        'Failed to get shop by ID',
        'GetShopByIdUseCase.execute',
        { id },
        error
      );
    }
  }
}
