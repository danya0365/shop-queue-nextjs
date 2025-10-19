import type { VisitedShopsDataDTO } from "@/src/application/dtos/shop/customer/customer-visited-shops-dto";
import type { IUseCase } from "@/src/application/interfaces/use-case.interface";
import type {
  GetVisitedShopsByProfileParams,
  VisitedShopsResultEntity,
} from "@/src/domain/entities/shop/customer/customer-visited-shop.entity";
import type {
  ShopCustomerVisitedShopsRepository,
} from "@/src/domain/repositories/shop/customer/customer-visited-shop-repository";

export class GetVisitedShopsByProfileUseCase
  implements IUseCase<GetVisitedShopsByProfileParams, VisitedShopsDataDTO>
{
  constructor(
    private readonly repository: ShopCustomerVisitedShopsRepository
  ) {}

  async execute(
    params: GetVisitedShopsByProfileParams
  ): Promise<VisitedShopsDataDTO> {
    if (!params.profileId) {
      throw new Error("profileId is required");
    }

    try {
      const result: VisitedShopsResultEntity =
        await this.repository.getVisitedShopsByProfile(params);

      return {
        visitedShops: result.visitedShops.map((shop) => ({
          shopId: shop.shopId,
          shopSlug: shop.shopSlug,
          shopName: shop.shopName,
          customerId: shop.customerId,
          totalVisits: shop.totalVisits,
          firstVisitedAt: shop.firstVisitedAt,
          lastVisitedAt: shop.lastVisitedAt,
        })),
        pagination: {
          currentPage: result.pagination.currentPage,
          perPage: result.pagination.perPage,
          totalItems: result.pagination.totalItems,
          totalPages: result.pagination.totalPages,
          hasNext: result.pagination.hasNext,
          hasPrev: result.pagination.hasPrev,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
