import type { Metadata } from "next";
import type { Logger } from "@/src/domain/interfaces/logger";
import type { ShopDTO } from "@/src/application/dtos/shop/backend/shops-dto";
import { getServerContainer } from "@/src/di/server-container";
import { ShopService } from "@/src/application/services/shop/ShopService";

/**
 * Minimal Shop Presenter for generic shop info and metadata generation
 */
export class ShopPresenter {
  constructor(
    private readonly shopService: ShopService,
    private readonly logger: Logger
  ) {}

  async getShopInfo(shopId: string): Promise<ShopDTO | null> {
    try {
      const shop = await this.shopService.getShopById(shopId);
      return shop ?? null;
    } catch (error) {
      this.logger.warn("ShopPresenter.getShopInfo error", { error, shopId });
      return null;
    }
  }

  async generateMetadata(shopId: string): Promise<Metadata> {
    try {
      const shop = await this.getShopInfo(shopId);
      if (!shop) {
        return {
          title: "ไม่พบร้านค้า | Shop Queue",
          description: "เราไม่พบข้อมูลร้านที่คุณกำลังค้นหา",
        };
      }

      return {
        title: `${shop.name ?? "ร้านค้า"} | Shop Queue`,
        description:
          shop.description ??
          `จองคิวออนไลน์กับร้าน ${shop.name ?? "ร้านค้า"} ได้ง่ายๆ ติดตามสถานะคิวแบบเรียลไทม์`,
      };
    } catch (error) {
      this.logger.error("ShopPresenter.generateMetadata error", { error, shopId });
      return {
        title: "ข้อมูลร้านค้า | Shop Queue",
        description: "จองคิวออนไลน์และติดตามสถานะคิวได้อย่างสะดวก",
      };
    }
  }
}

export class ShopPresenterFactory {
  static async create(): Promise<ShopPresenter> {
    const container = await getServerContainer();
    const shopService = container.resolve<ShopService>("ShopService");
    const logger = container.resolve<Logger>("Logger");
    return new ShopPresenter(shopService, logger);
    
  }
}
