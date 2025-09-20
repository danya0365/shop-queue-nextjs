import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { ShopBackendShopRepository } from '@/src/domain/repositories/shop/backend/backend-shop-repository';
import { ShopBackendShopError, ShopBackendShopErrorType } from '@/src/domain/repositories/shop/backend/backend-shop-repository';

export class IsShopOwnerUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly shopRepository: ShopBackendShopRepository
  ) { }

  async execute(shopId: string): Promise<boolean> {
    try {
      if (!shopId) {
        throw new ShopBackendShopError(
          ShopBackendShopErrorType.VALIDATION_ERROR,
          'Shop ID is required',
          'IsShopOwnerUseCase.execute',
          { shopId }
        );
      }

      const isOwner = await this.shopRepository.isShopOwner(shopId);

      return isOwner;
    } catch (error) {
      if (error instanceof ShopBackendShopError) {
        throw error;
      }

      throw new ShopBackendShopError(
        ShopBackendShopErrorType.UNKNOWN,
        'Failed to check shop owner status',
        'IsShopOwnerUseCase.execute',
        { shopId },
        error
      );
    }
  }
}
