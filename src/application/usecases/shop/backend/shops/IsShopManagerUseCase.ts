import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { ShopBackendShopRepository } from '@/src/domain/repositories/shop/backend/backend-shop-repository';
import { ShopBackendShopError, ShopBackendShopErrorType } from '@/src/domain/repositories/shop/backend/backend-shop-repository';

export class IsShopManagerUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly shopRepository: ShopBackendShopRepository
  ) { }

  async execute(shopId: string): Promise<boolean> {
    try {
      if (!shopId) {
        throw new ShopBackendShopError(
          ShopBackendShopErrorType.VALIDATION_ERROR,
          'Shop ID is required',
          'IsShopManagerUseCase.execute',
          { shopId }
        );
      }

      const isManager = await this.shopRepository.isShopManager(shopId);

      return isManager;
    } catch (error) {
      if (error instanceof ShopBackendShopError) {
        throw error;
      }

      throw new ShopBackendShopError(
        ShopBackendShopErrorType.UNKNOWN,
        'Failed to check shop manager status',
        'IsShopManagerUseCase.execute',
        { shopId },
        error
      );
    }
  }
}
