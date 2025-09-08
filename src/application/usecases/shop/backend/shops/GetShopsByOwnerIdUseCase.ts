import { ShopDTO } from '@/src/application/dtos/shop/backend/shops-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ShopMapper } from '@/src/application/mappers/shop/backend/shop-mapper';
import type { ShopBackendShopRepository } from '@/src/domain/repositories/shop/backend/backend-shop-repository';
import { ShopBackendShopError, ShopBackendShopErrorType } from '@/src/domain/repositories/shop/backend/backend-shop-repository';

export class GetShopsByOwnerIdUseCase implements IUseCase<string, ShopDTO[]> {
  constructor(
    private readonly shopRepository: ShopBackendShopRepository
  ) { }

  async execute(ownerId: string): Promise<ShopDTO[]> {
    try {
      if (!ownerId) {
        throw new ShopBackendShopError(
          ShopBackendShopErrorType.VALIDATION_ERROR,
          'Owner ID is required',
          'GetShopsByOwnerIdUseCase.execute',
          { ownerId }
        );
      }

      const shops = await this.shopRepository.getShopsByOwnerId(ownerId);

      if (!shops) {
        throw new ShopBackendShopError(
          ShopBackendShopErrorType.NOT_FOUND,
          `Shops with owner ID ${ownerId} not found`,
          'GetShopsByOwnerIdUseCase.execute',
          { ownerId }
        );
      }

      // map to dto
      const shopsDTO = shops.map(shop => ShopMapper.toDTO(shop));

      return shopsDTO;
    } catch (error) {
      if (error instanceof ShopBackendShopError) {
        throw error;
      }

      throw new ShopBackendShopError(
        ShopBackendShopErrorType.UNKNOWN,
        'Failed to get shops by owner ID',
        'GetShopsByOwnerIdUseCase.execute',
        { ownerId },
        error
      );
    }
  }
}
