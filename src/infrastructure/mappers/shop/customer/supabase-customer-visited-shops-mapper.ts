import type { VisitedShopEntity } from "@/src/domain/entities/shop/customer/customer-visited-shop.entity";
import type {
  ProfileVisitedShopRecord,
} from "@/src/infrastructure/schemas/shop/customer/customer-visited-shops.schema";

export class SupabaseCustomerVisitedShopsMapper {
  static toVisitedShopEntity(record: ProfileVisitedShopRecord): VisitedShopEntity {
    return {
      shopId: String(record?.shop_id ?? ""),
      shopSlug: String(record?.shop_slug ?? ""),
      shopName: String(record?.shop_name ?? ""),
      customerId: String(record?.customer_id ?? ""),
      totalVisits: Number(record?.total_visits ?? 0),
      firstVisitedAt: String(record?.first_visited_at ?? ""),
      lastVisitedAt: String(record?.last_visited_at ?? ""),
    };
  }
}
