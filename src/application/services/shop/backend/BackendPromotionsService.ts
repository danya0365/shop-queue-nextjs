import type {
  CreatePromotionParams,
  PromotionDTO,
  PromotionStatsDTO,
  UpdatePromotionParams,
} from "@/src/application/dtos/shop/backend/promotions-dto";
import {
  GetPromotionsPaginatedInput,
  PaginatedPromotionsDTO,
} from "@/src/application/dtos/shop/backend/promotions-dto";
import type { IUseCase } from "@/src/application/interfaces/use-case.interface";
import { CreatePromotionUseCase } from "@/src/application/usecases/shop/backend/promotions/CreatePromotionUseCase";
import { DeletePromotionUseCase } from "@/src/application/usecases/shop/backend/promotions/DeletePromotionUseCase";
import { GetPromotionByIdUseCase } from "@/src/application/usecases/shop/backend/promotions/GetPromotionByIdUseCase";
import { GetPromotionsPaginatedUseCase } from "@/src/application/usecases/shop/backend/promotions/GetPromotionsPaginatedUseCase";
import { GetPromotionStatsUseCase } from "@/src/application/usecases/shop/backend/promotions/GetPromotionStatsUseCase";
import { UpdatePromotionUseCase } from "@/src/application/usecases/shop/backend/promotions/UpdatePromotionUseCase";
import type { Logger } from "@/src/domain/interfaces/logger";
import { ShopBackendPromotionRepository } from "@/src/domain/repositories/shop/backend/backend-promotion-repository";

export interface IShopBackendPromotionsService {
  getPaginatedPromotionsByShopId(
    shopId: string,
    page?: number,
    perPage?: number
  ): Promise<PaginatedPromotionsDTO>;
  getPromotionsStatsByShopId(shopId: string): Promise<PromotionStatsDTO>;
  getPromotionById(id: string): Promise<PromotionDTO>;
  createPromotion(params: CreatePromotionParams): Promise<PromotionDTO>;
  updatePromotion(
    id: string,
    params: UpdatePromotionParams
  ): Promise<PromotionDTO>;
  deletePromotion(id: string): Promise<boolean>;
}

export class ShopBackendPromotionsService
  implements IShopBackendPromotionsService
{
  constructor(
    private readonly getPromotionsPaginatedUseCase: IUseCase<
      GetPromotionsPaginatedInput,
      PaginatedPromotionsDTO
    >,
    private readonly getPromotionStatsUseCase: IUseCase<
      string,
      PromotionStatsDTO
    >,
    private readonly getPromotionByIdUseCase: IUseCase<string, PromotionDTO>,
    private readonly createPromotionUseCase: IUseCase<
      CreatePromotionParams,
      PromotionDTO
    >,
    private readonly updatePromotionUseCase: IUseCase<
      UpdatePromotionParams,
      PromotionDTO
    >,
    private readonly deletePromotionUseCase: IUseCase<string, boolean>,
    private readonly logger: Logger
  ) {}

  /**
   * Get paginated promotions by shop ID
   * @param shopId Shop ID
   * @param page Page number (default: 1)
   * @param perPage Items per page (default: 10)
   * @returns Paginated promotions DTO
   */
  async getPaginatedPromotionsByShopId(
    shopId: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<PaginatedPromotionsDTO> {
    try {
      this.logger.info("Getting paginated promotions by shop ID", {
        shopId,
        page,
        perPage,
      });

      const result = await this.getPromotionsPaginatedUseCase.execute({
        shopId,
        page,
        limit: perPage,
      });
      return result;
    } catch (error) {
      this.logger.error("Error getting paginated promotions by shop ID", {
        error,
        shopId,
        page,
        perPage,
      });
      throw error;
    }
  }

  /**
   * Get promotion statistics
   * @returns Promotion stats DTO
   */
  async getPromotionsStatsByShopId(shopId: string): Promise<PromotionStatsDTO> {
    try {
      this.logger.info("Getting promotion stats");

      const stats = await this.getPromotionStatsUseCase.execute(shopId);
      return stats;
    } catch (error) {
      this.logger.error("Error getting promotion stats", { error });
      throw error;
    }
  }

  /**
   * Get a promotion by ID
   * @param id Promotion ID
   * @returns Promotion DTO
   */
  async getPromotionById(id: string): Promise<PromotionDTO> {
    try {
      this.logger.info("Getting promotion by ID", { id });

      const result = await this.getPromotionByIdUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error("Error getting promotion by ID", { error, id });
      throw error;
    }
  }

  /**
   * Create a new promotion
   * @param params Promotion creation parameters
   * @returns Created promotion DTO
   */
  async createPromotion(params: CreatePromotionParams): Promise<PromotionDTO> {
    try {
      this.logger.info("Creating promotion", { params });

      const result = await this.createPromotionUseCase.execute(params);
      return result;
    } catch (error) {
      this.logger.error("Error creating promotion", { error, params });
      throw error;
    }
  }

  /**
   * Update an existing promotion
   * @param id Promotion ID
   * @param params Promotion update parameters
   * @returns Updated promotion DTO
   */
  async updatePromotion(
    id: string,
    params: UpdatePromotionParams
  ): Promise<PromotionDTO> {
    try {
      this.logger.info("Updating promotion", { id, params });

      const updateData = { ...params, id };
      const result = await this.updatePromotionUseCase.execute(updateData);
      return result;
    } catch (error) {
      this.logger.error("Error updating promotion", { error, id, params });
      throw error;
    }
  }

  /**
   * Delete a promotion
   * @param id Promotion ID
   * @returns Success flag
   */
  async deletePromotion(id: string): Promise<boolean> {
    try {
      this.logger.info("Deleting promotion", { id });

      const result = await this.deletePromotionUseCase.execute(id);
      return result;
    } catch (error) {
      this.logger.error("Error deleting promotion", { error, id });
      throw error;
    }
  }
}

export class ShopBackendPromotionsServiceFactory {
  static create(
    repository: ShopBackendPromotionRepository,
    logger: Logger
  ): ShopBackendPromotionsService {
    const getPromotionsPaginatedUseCase = new GetPromotionsPaginatedUseCase(
      repository
    );
    const getPromotionStatsUseCase = new GetPromotionStatsUseCase(repository);
    const getPromotionByIdUseCase = new GetPromotionByIdUseCase(repository);
    const createPromotionUseCase = new CreatePromotionUseCase(repository);
    const updatePromotionUseCase = new UpdatePromotionUseCase(repository);
    const deletePromotionUseCase = new DeletePromotionUseCase(repository);
    return new ShopBackendPromotionsService(
      getPromotionsPaginatedUseCase,
      getPromotionStatsUseCase,
      getPromotionByIdUseCase,
      createPromotionUseCase,
      updatePromotionUseCase,
      deletePromotionUseCase,
      logger
    );
  }
}
