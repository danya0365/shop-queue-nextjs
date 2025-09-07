import { GetShopsPaginatedInput, PaginatedShopsDTO } from '@/src/application/dtos/backend/shops-dto';
import { ShopMapper } from '@/src/application/mappers/backend/shop-mapper';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { PaginationParams } from '@/src/domain/interfaces/pagination-types';
import { BackendShopRepository, BackendShopError, BackendShopErrorType } from '@/src/domain/repositories/backend/backend-shop-repository';

/**
 * Use case for getting paginated shops data
 * Following SOLID principles and Clean Architecture
 */
export class GetShopsPaginatedUseCase implements IUseCase<GetShopsPaginatedInput, PaginatedShopsDTO> {
  constructor(
    private shopRepository: BackendShopRepository
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
      if (error instanceof BackendShopError) {
        throw error;
      }
      
      throw new BackendShopError(
        BackendShopErrorType.UNKNOWN,
        'Failed to get paginated shops',
        'GetShopsPaginatedUseCase.execute',
        {},
        error
      );
    }
  }
}
