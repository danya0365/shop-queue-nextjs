import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { ShopBackendShopRepository } from '@/src/domain/repositories/shop/backend/backend-shop-repository';
import { ShopBackendShopError, ShopBackendShopErrorType } from '@/src/domain/repositories/shop/backend/backend-shop-repository';

export class IsShopEmployeeUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly shopRepository: ShopBackendShopRepository
  ) { }

  async execute(shopId: string): Promise<boolean> {
    try {
      if (!shopId) {
        throw new ShopBackendShopError(
          ShopBackendShopErrorType.VALIDATION_ERROR,
          'Shop ID is required',
          'IsShopEmployeeUseCase.execute',
          { shopId }
        );
      }

      const isEmployee = await this.shopRepository.isShopEmployee(shopId);

      return isEmployee;
    } catch (error) {
      if (error instanceof ShopBackendShopError) {
        throw error;
      }

      throw new ShopBackendShopError(
        ShopBackendShopErrorType.UNKNOWN,
        'Failed to check shop employee status',
        'IsShopEmployeeUseCase.execute',
        { shopId },
        error
      );
    }
  }
}
