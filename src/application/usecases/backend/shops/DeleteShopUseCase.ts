import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { BackendShopRepository } from '@/src/domain/repositories/backend/backend-shop-repository';
import { BackendShopError, BackendShopErrorType } from '@/src/domain/repositories/backend/backend-shop-repository';

export class DeleteShopUseCase implements IUseCase<string, boolean> {
  constructor(
    private readonly shopRepository: BackendShopRepository
  ) { }

  async execute(id: string): Promise<boolean> {
    try {
      if (!id?.trim()) {
        throw new BackendShopError(
          BackendShopErrorType.VALIDATION_ERROR,
          'Shop ID is required',
          'DeleteShopUseCase.execute',
          { id }
        );
      }

      // Check if shop exists
      const existingShop = await this.shopRepository.getShopById(id);
      if (!existingShop) {
        throw new BackendShopError(
          BackendShopErrorType.NOT_FOUND,
          `Shop with ID ${id} not found`,
          'DeleteShopUseCase.execute',
          { id }
        );
      }

      return await this.shopRepository.deleteShop(id);
    } catch (error) {
      if (error instanceof BackendShopError) {
        throw error;
      }

      throw new BackendShopError(
        BackendShopErrorType.UNKNOWN,
        'Failed to delete shop',
        'DeleteShopUseCase.execute',
        { id },
        error
      );
    }
  }
}
