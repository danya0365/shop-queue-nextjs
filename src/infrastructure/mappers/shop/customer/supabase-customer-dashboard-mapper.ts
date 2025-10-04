import { PromotionEntity } from "@/src/domain/entities/shop/customer/customer-dashboard.entity";
import { PromotionSchema } from "@/src/infrastructure/schemas/shop/customer/customer-dashboard.schema";

/**
 * Mapper for converting between Supabase database records and domain entities
 * for customer dashboard functionality
 */
export class SupabaseCustomerDashboardMapper {
  /**
   * Convert Supabase promotion data to domain entity
   */
  static toPromotionEntity(data: PromotionSchema): PromotionEntity {
    return {
      id: String(data.id),
      title: String(data.name),
      description: String(data.description || ""),
      discount: Number(data.value || 0),
      validUntil: String(data.end_at || ""),
      icon: data.icon ?? undefined,
      imageUrl: data.image_url ?? undefined,
    };
  }

  /**
   * Convert Supabase promotions array to domain entities
   */
  static toPromotionEntities(data: PromotionSchema[]): PromotionEntity[] {
    const now = new Date();

    return data
      .filter((promotion) => {
        const startDate = new Date(promotion.start_at || now);
        const endDate = new Date(promotion.end_at || now);
        return (
          promotion.status === "active" && startDate <= now && endDate >= now
        );
      })
      .map((promotion) => this.toPromotionEntity(promotion));
  }
}
