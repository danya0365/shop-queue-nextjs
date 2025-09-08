import { GetShopsPaginatedInput, PaginatedShopsDTO } from '@/src/application/dtos/shop/backend/shops-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { ShopMapper } from '@/src/application/mappers/shop/backend/shop-mapper';
import { PaginationParams } from '@/src/domain/interfaces/pagination-types';
import type { ShopBackendShopRepository } from '@/src/domain/repositories/shop/backend/backend-shop-repository';
import { ShopBackendShopError, ShopBackendShopErrorType } from '@/src/domain/repositories/shop/backend/backend-shop-repository';

/**
 * Use case for getting paginated shops data
 * Following SOLID principles and Clean Architecture
 */
export class GetShopsPaginatedUseCase implements IUseCase<GetShopsPaginatedInput, PaginatedShopsDTO> {
  constructor(
    private shopRepository: ShopBackendShopRepository
  ) { }

  /**
   * Execute the use case to get paginated shops data
   * @param input Pagination parameters
   * @returns Paginated shops data
   */
  async execute(input: GetShopsPaginatedInput): Promise<PaginatedShopsDTO> {
    try {
      const paginationParams: PaginationParams = {
        page: input.page || 1,
        limit: input.limit || 10
      };

      const paginatedShops = await this.shopRepository.getPaginatedShops(paginationParams);
      return ShopMapper.toPaginatedDTO(paginatedShops);
    } catch (error) {
      if (error instanceof ShopBackendShopError) {
        throw error;
      }

      throw new ShopBackendShopError(
        ShopBackendShopErrorType.UNKNOWN,
        'Failed to get paginated shops',
        'GetShopsPaginatedUseCase.execute',
        {},
        error
      );
    }
  }
}
