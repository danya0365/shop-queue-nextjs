
import { PaginatedShopsEntity } from "../../../../domain/entities/backend/backend-shop.entity";
import { Logger } from "../../../../domain/interfaces/logger";
import { PaginationParams } from "../../../../domain/interfaces/pagination-types";
import { BackendShopRepository } from "../../../../domain/repositories/backend/backend-shop-repository";
import { IUseCase } from "../../../interfaces/use-case.interface";

/**
 * Input DTO for GetShopsPaginatedUseCase
 */
export interface GetShopsPaginatedInput {
  page: number;
  limit: number;
}

/**
 * Use case for getting paginated shops data
 * Following SOLID principles and Clean Architecture
 */
export class GetShopsPaginatedUseCase implements IUseCase<GetShopsPaginatedInput, PaginatedShopsEntity> {
  constructor(
    private shopRepository: BackendShopRepository,
    private logger: Logger
  ) { }

  /**
   * Execute the use case to get paginated shops data
   * @param input Pagination parameters
   * @returns Paginated shops data
   */
  async execute(input: GetShopsPaginatedInput): Promise<PaginatedShopsEntity> {
    try {
      this.logger.info('GetShopsPaginatedUseCase.execute', { input });

      const paginationParams: PaginationParams = {
        page: input.page || 1,
        limit: input.limit || 10
      };

      return await this.shopRepository.getPaginatedShops(paginationParams);
    } catch (error) {
      this.logger.error('Error in GetShopsPaginatedUseCase.execute', { error });
      throw error;
    }
  }
}
