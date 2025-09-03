import { PaginatedShopsDTO } from '@/src/application/dtos/backend/shops-dto';
import { ShopMapper } from '@/src/application/mappers/backend/shop-mapper';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { PaginationParams } from '@/src/domain/interfaces/pagination-types';
import { BackendShopRepository } from '@/src/domain/repositories/backend/backend-shop-repository';

/**
 * Input DTO for GetShopsPaginatedUseCase
 */
export interface GetShopsPaginatedUseCaseInput {
  page: number;
  perPage: number;
}

/**
 * Use case for getting paginated shops data
 * Following SOLID principles and Clean Architecture
 */
export class GetShopsPaginatedUseCase implements IUseCase<GetShopsPaginatedUseCaseInput, PaginatedShopsDTO> {
  constructor(
    private readonly shopRepository: BackendShopRepository
  ) { }

  /**
   * Execute the use case to get paginated shops data
   * @param input Pagination parameters
   * @returns Paginated shops data
   */
  async execute(input: GetShopsPaginatedUseCaseInput): Promise<PaginatedShopsDTO> {
    const { page, perPage } = input;
    
    // Validate input
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }

    if (perPage < 1 || perPage > 100) {
      throw new Error('Per page must be between 1 and 100');
    }

    const paginationParams: PaginationParams = {
      page,
      limit: perPage
    };

    const shops = await this.shopRepository.getPaginatedShops(paginationParams);
    const shopsDTO = shops.data.map(shop => ShopMapper.toDTO(shop));

    return {
      data: shopsDTO,
      pagination: shops.pagination
    };
  }
}
