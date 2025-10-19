import type { DatabaseDataSource } from "@/src/domain/interfaces/datasources/database-datasource";
import type { Logger } from "@/src/domain/interfaces/logger";
import {
  ShopCustomerVisitedShopsError,
  ShopCustomerVisitedShopsErrorType,
  type ShopCustomerVisitedShopsRepository,
} from "@/src/domain/repositories/shop/customer/customer-visited-shop-repository";
import type {
  GetVisitedShopsByProfileParams,
  VisitedShopsResultEntity,
} from "@/src/domain/entities/shop/customer/customer-visited-shop.entity";
import { GetProfileVisitedShopsRpcResult } from "@/src/infrastructure/schemas/shop/customer/customer-visited-shops.schema";
import { SupabaseCustomerVisitedShopsMapper } from "@/src/infrastructure/mappers/shop/customer/supabase-customer-visited-shops-mapper";
import { StandardRepository } from "@/src/infrastructure/repositories/base/standard-repository";

export class SupabaseCustomerVisitedShopsRepository
  extends StandardRepository
  implements ShopCustomerVisitedShopsRepository
{
  constructor(dataSource: DatabaseDataSource, logger: Logger) {
    super(dataSource, logger, "CustomerVisitedShops");
  }

  async getVisitedShopsByProfile(
    params: GetVisitedShopsByProfileParams
  ): Promise<VisitedShopsResultEntity> {
    const { profileId, page = 1, limit = 10 } = params;

    if (!profileId) {
      throw new ShopCustomerVisitedShopsError(
        ShopCustomerVisitedShopsErrorType.VALIDATION_ERROR,
        "Profile ID is required",
        "SupabaseCustomerVisitedShopsRepository.getVisitedShopsByProfile"
      );
    }

    try {
      this.logger.info(
        "SupabaseCustomerVisitedShopsRepository: fetching visited shops",
        { profileId, page, limit }
      );

      const result = await this.dataSource.callRpc<GetProfileVisitedShopsRpcResult>(
        "get_profile_visited_shops",
        {
          p_profile_id: profileId,
          p_page: page,
          p_limit: limit,
        }
      );

      if (!result || !Array.isArray(result.data) || !result.pagination) {
        throw new ShopCustomerVisitedShopsError(
          ShopCustomerVisitedShopsErrorType.UNKNOWN,
          "Invalid response from get_profile_visited_shops",
          "SupabaseCustomerVisitedShopsRepository.getVisitedShopsByProfile",
          { result }
        );
      }

      const visitedShops = result.data.map((record) =>
        SupabaseCustomerVisitedShopsMapper.toVisitedShopEntity(record)
      );

      const pagination = result.pagination;

      return {
        visitedShops,
        pagination: {
          currentPage: Number(pagination.current_page ?? page),
          perPage: Number(pagination.per_page ?? limit),
          totalItems: Number(pagination.total_items ?? visitedShops.length),
          totalPages: Number(pagination.total_pages ?? 1),
          hasNext: Boolean(pagination.has_next ?? false),
          hasPrev: Boolean(pagination.has_prev ?? false),
        },
      };
    } catch (error) {
      if (error instanceof ShopCustomerVisitedShopsError) {
        throw error;
      }

      throw new ShopCustomerVisitedShopsError(
        ShopCustomerVisitedShopsErrorType.UNKNOWN,
        "Failed to fetch visited shops by profile",
        "SupabaseCustomerVisitedShopsRepository.getVisitedShopsByProfile",
        { params },
        error
      );
    }
  }
}
