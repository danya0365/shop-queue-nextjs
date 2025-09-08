import type { GetShopsPaginatedInput, PaginatedShopsDTO, ShopDTO, ShopStatsDTO, ShopsDataDTO } from '@/src/application/dtos/shop/backend/shops-dto';
import type { IUseCase } from '@/src/application/interfaces/use-case.interface';
import { CreateShopUseCase, type CreateShopParams } from '@/src/application/usecases/shop/backend/shops/CreateShopUseCase';
import { UpdateShopUseCase, type UpdateShopParams } from '@/src/application/usecases/shop/backend/shops/UpdateShopUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';
import { ShopBackendShopRepository } from '@/src/domain/repositories/shop/backend/backend-shop-repository';
import { DeleteShopUseCase } from '../../usecases/shop/backend/shops/DeleteShopUseCase';
import { GetShopByIdUseCase } from '../../usecases/shop/backend/shops/GetShopByIdUseCase';
import { GetShopStatsUseCase } from '../../usecases/shop/backend/shops/GetShopStatsUseCase';
import { GetShopsByOwnerIdUseCase } from '../../usecases/shop/backend/shops/GetShopsByOwnerIdUseCase';
import { GetShopsPaginatedUseCase } from '../../usecases/shop/backend/shops/GetShopsPaginatedUseCase';

export interface IShopService {
  getShopsByOwnerId(ownerId: string): Promise<ShopDTO[]>;
  getShopsData(page?: number, perPage?: number): Promise<ShopsDataDTO>;
  getShopsPaginated(page?: number, perPage?: number): Promise<PaginatedShopsDTO>;
  getShopStats(): Promise<ShopStatsDTO>;
  getShopById(id: string): Promise<ShopDTO>;
  createShop(params: CreateShopParams): Promise<ShopDTO>;
  updateShop(params: UpdateShopParams): Promise<ShopDTO>;
  deleteShop(id: string): Promise<boolean>;
}

export class ShopService implements IShopService {
  constructor(
    private readonly getShopsPaginatedUseCase: IUseCase<GetShopsPaginatedInput, PaginatedShopsDTO>,
    private readonly getShopStatsUseCase: IUseCase<void, ShopStatsDTO>,
    private readonly getShopByIdUseCase: IUseCase<string, ShopDTO>,
    private readonly getShopsByOwnerIdUseCase: IUseCase<string, ShopDTO[]>,
    private readonly createShopUseCase: IUseCase<CreateShopParams, ShopDTO>,
    private readonly updateShopUseCase: IUseCase<UpdateShopParams, ShopDTO>,
    private readonly deleteShopUseCase: IUseCase<string, boolean>,
    private readonly logger: Logger
  ) { }

  async getShopsByOwnerId(ownerId: string): Promise<ShopDTO[]> {
    try {
      this.logger.info('Getting shops by owner ID', { ownerId });

      const result = await this.getShopsByOwnerIdUseCase.execute(ownerId);
      return result;
    } catch (error) {
      this.logger.error('Error getting shops by owner ID', { error, ownerId });
      throw error;
    }
  }

  /**
   * Get shops data including paginated shops and statistics
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @returns Shops data DTO
   */
  async getShopsData(page: number = 1, perPage: number = 10): Promise<ShopsDataDTO> {
    try {
      this.logger.info('Getting shops data', { page, perPage });

      // Get shops and stats in parallel
      const [shopsResult, stats] = await Promise.all([
        this.getShopsPaginatedUseCase.execute({ page, limit: perPage }),
        this.getShopStatsUseCase.execute()
      ]);

      return {
        shops: shopsResult.data,
        stats,
        totalCount: shopsResult.pagination.totalItems,
        currentPage: shopsResult.pagination.currentPage,
        perPage: shopsResult.pagination.itemsPerPage
      };
    } catch (error) {
      this.logger.error('Error getting shops data', { error, page, perPage });
      throw error;
    }
  }


  async getShopsPaginated(page: number = 1, perPage: number = 10): Promise<PaginatedShopsDTO> {
    try {
      this.logger.info('Getting paginated shops data', { page, perPage });

      const result = await this.getShopsPaginatedUseCase.execute({ page, limit: perPage });
      return result;
    } catch (error) {
      this.logger.error('Error getting paginated shops data', { error, page, perPage });
      throw error;
    }
  }

  async getShopStats(): Promise<ShopStatsDTO> {
    try {
      this.logger.info('Getting shop statistics');

      const result = await this.getShopStatsUseCase.execute();
      return result;
    } catch (error) {
      this.logger.error('Error getting shop statistics', { error });
      throw error;
    }
  }

  async getShopById(id: string): Promise<ShopDTO> {
    try {
      this.logger.info('Getting shop by ID', { id });

      const result = await this.getShopByIdUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error getting shop by ID', { error, id });
      throw error;
    }
  }

  async createShop(params: CreateShopParams): Promise<ShopDTO> {
    try {
      this.logger.info('Creating shop', { params: { ...params, email: params.email ? '[REDACTED]' : undefined } });

      const result = await this.createShopUseCase.execute(params);
      return result;
    } catch (error) {
      this.logger.error('Error creating shop', { error, params: { ...params, email: params.email ? '[REDACTED]' : undefined } });
      throw error;
    }
  }

  async updateShop(params: UpdateShopParams): Promise<ShopDTO> {
    try {
      this.logger.info('Updating shop', { params: { ...params, email: params.email ? '[REDACTED]' : undefined } });

      const result = await this.updateShopUseCase.execute(params);
      return result;
    } catch (error) {
      this.logger.error('Error updating shop', { error, params: { ...params, email: params.email ? '[REDACTED]' : undefined } });
      throw error;
    }
  }

  async deleteShop(id: string): Promise<boolean> {
    try {
      this.logger.info('Deleting shop', { id });

      const result = await this.deleteShopUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error('Error deleting shop', { error, id });
      throw error;
    }
  }
}

export class ShopServiceFactory {
  static create(repository: ShopBackendShopRepository, logger: Logger): ShopService {
    const getShopsPaginatedUseCase = new GetShopsPaginatedUseCase(repository);
    const getShopStatsUseCase = new GetShopStatsUseCase(repository);
    const getShopByIdUseCase = new GetShopByIdUseCase(repository);
    const getShopsByOwnerIdUseCase = new GetShopsByOwnerIdUseCase(repository);
    const createShopUseCase = new CreateShopUseCase(repository);
    const updateShopUseCase = new UpdateShopUseCase(repository);
    const deleteShopUseCase = new DeleteShopUseCase(repository);
    return new ShopService(getShopsPaginatedUseCase, getShopStatsUseCase, getShopByIdUseCase, getShopsByOwnerIdUseCase, createShopUseCase, updateShopUseCase, deleteShopUseCase, logger);
  }
}

