import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { ShopBackendShopRepository } from '@/src/domain/repositories/shop/backend/shop-backend-shop-repository';
import { ShopBackendShopError, ShopBackendShopErrorType } from '@/src/domain/repositories/shop/backend/shop-backend-shop-repository';

export class DeleteShopUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly shopRepository: ShopBackendShopRepository
  ) { }

  async execute(id: string): Promise<boolean> {
    try {
      if (!id?.trim()) {
        throw new ShopBackendShopError(
          ShopBackendShopErrorType.VALIDATION_ERROR,
          'Shop ID is required',
          'DeleteShopUseCase.execute',
          { id }
        );
      }

      // Check if shop exists
      const existingShop = await this.shopRepository.getShopById(id);
      if (!existingShop) {
        throw new ShopBackendShopError(
          ShopBackendShopErrorType.NOT_FOUND,
          `Shop with ID ${id} not found`,
          'DeleteShopUseCase.execute',
          { id }
        );
      }

      return await this.shopRepository.deleteShop(id);
    } catch (error) {
      if (error instanceof ShopBackendShopError) {
        throw error;
      }

      throw new ShopBackendShopError(
        ShopBackendShopErrorType.UNKNOWN,
        'Failed to delete shop',
        'DeleteShopUseCase.execute',
        { id },
        error
      );
    }
  }
}
