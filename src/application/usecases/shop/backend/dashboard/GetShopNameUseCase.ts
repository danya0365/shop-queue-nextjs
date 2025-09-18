import type { Logger } from "@/src/domain/interfaces/logger";
import { ShopBackendDashboardRepository } from "@/src/domain/repositories/shop/backend/backend-dashboard-repository";

export interface IGetShopNameUseCase {
  execute(shopId: string): Promise<string>;
}

export class GetShopNameUseCase implements IGetShopNameUseCase {
  constructor(
    private readonly repository: ShopBackendDashboardRepository,
    private readonly logger: Logger
  ) {}

  async execute(shopId: string): Promise<string> {
    try {
      const shopName = await this.repository.getShopName(shopId);
      return shopName;
    } catch (error) {
      this.logger.error("GetShopNameUseCase: Error getting shop name", error);
      throw error;
    }
  }
}
