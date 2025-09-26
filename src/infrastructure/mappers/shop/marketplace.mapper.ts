import { OpeningHourDTO } from "@/src/application/dtos/backend/opening-hour-dto";
import {
  ShopCategoryDTO,
  ShopDTO,
} from "@/src/application/dtos/backend/shops-dto";
import {
  LocationDTO,
  MarketplaceCategoryDTO,
  MarketplaceStatsDTO,
  ShopListResultDTO,
} from "@/src/application/dtos/shop/marketplace-dto";
import {
  CategoryMarketplaceSchema,
  LocationMarketplaceSchema,
  MarketplaceStatsSchema,
  ShopCategoryMarketplaceSchema,
  ShopListResultSchema,
  ShopMarketplaceSchema,
  ShopOpeningHourMarketplaceSchema,
} from "@/src/infrastructure/schemas/shop/marketplace.schema";

/**
 * Mapper class for converting between marketplace database schemas and DTOs
 * Following Clean Architecture principles for separation of concerns
 */
export class MarketplaceMapper {
  /**
   * Map shop marketplace schema to ShopDTO
   * @param schema Shop marketplace database schema
   * @returns ShopDTO
   */
  public static toShopDTO(schema: ShopMarketplaceSchema): ShopDTO {
    return {
      id: schema.id,
      name: schema.name,
      description: schema.description,
      address: schema.address,
      phone: schema.phone,
      email: schema.email,
      website: schema.website,
      logo: schema.logo,
      qrCodeUrl: schema.qr_code_url,
      timezone: schema.timezone,
      currency: schema.currency,
      language: schema.language,
      categories: schema.categories
        ? schema.categories.map((cat) => this.toShopCategoryDTO(cat))
        : [],
      ownerId: schema.owner_id,
      ownerName: schema.owner_name || "",
      status:
        (schema.status as "active" | "inactive" | "suspended" | "draft") ||
        "active",
      openingHours: schema.opening_hours
        ? schema.opening_hours.map((hour) => this.toOpeningHourDTO(hour))
        : [],
      queueCount: schema.queue_count || 0,
      totalServices: schema.total_services || 0,
      rating: schema.rating || 0,
      totalReviews: schema.total_reviews || 0,
      createdAt: schema.created_at,
      updatedAt: schema.updated_at,
    };
  }

  /**
   * Map shop category marketplace schema to ShopCategoryDTO
   * @param schema Shop category marketplace database schema
   * @returns ShopCategoryDTO
   */
  public static toShopCategoryDTO(
    schema: ShopCategoryMarketplaceSchema
  ): ShopCategoryDTO {
    return {
      id: schema.id,
      name: schema.name,
      slug: schema.slug,
      description: schema.description || "",
    };
  }

  /**
   * Map shop opening hour marketplace schema to OpeningHourDTO
   * @param schema Shop opening hour marketplace database schema
   * @returns OpeningHourDTO
   */
  public static toOpeningHourDTO(
    schema: ShopOpeningHourMarketplaceSchema
  ): OpeningHourDTO {
    return {
      id: schema.id,
      shopId: schema.shop_id,
      dayOfWeek: schema.day_of_week,
      openTime: schema.open_time,
      closeTime: schema.close_time,
      isOpen: schema.is_open || false,
      breakStart: schema.break_start,
      breakEnd: schema.break_end,
      createdAt: new Date(schema.created_at),
      updatedAt: new Date(schema.updated_at),
    };
  }

  /**
   * Map category marketplace schema to MarketplaceCategoryDTO
   * @param schema Category marketplace database schema
   * @returns MarketplaceCategoryDTO
   */
  public static toMarketplaceCategoryDTO(
    schema: CategoryMarketplaceSchema
  ): MarketplaceCategoryDTO {
    return {
      id: schema.id,
      name: schema.name,
      shopCount: schema.shops_count || 0,
      icon: schema.icon || "🏪", // Default icon if none provided
    };
  }

  /**
   * Map location marketplace schema to LocationDTO
   * @param schema Location marketplace database schema
   * @returns LocationDTO
   */
  public static toLocationDTO(schema: LocationMarketplaceSchema): LocationDTO {
    return {
      id: schema.id,
      name: schema.name,
      province: schema.province,
      district: schema.district,
      shopCount: schema.shops_count || 0,
      isActive: schema.is_active,
      createdAt: schema.created_at,
      updatedAt: schema.updated_at,
    };
  }

  /**
   * Map marketplace stats schema to MarketplaceStatsDTO
   * @param schema Marketplace stats database schema
   * @returns MarketplaceStatsDTO
   */
  public static toMarketplaceStatsDTO(
    schema: MarketplaceStatsSchema
  ): MarketplaceStatsDTO {
    return {
      totalShops: schema.total_shops,
      activeShops: schema.active_shops,
      featuredShops: schema.featured_shops,
      newShopsThisMonth: schema.new_shops_this_month,
    };
  }

  /**
   * Map shop list result schema to ShopListResultDTO
   * @param schema Shop list result database schema
   * @returns ShopListResultDTO
   */
  public static toShopListResultDTO(
    schema: ShopListResultSchema
  ): ShopListResultDTO {
    return {
      shops: schema.shops.map((shop) => this.toShopDTO(shop)),
      totalCount: schema.total_count,
      perPage: schema.per_page,
      currentPage: schema.current_page,
      totalPages: schema.total_pages,
    };
  }

  /**
   * Map array of shop marketplace schemas to ShopDTO array
   * @param schemas Array of shop marketplace database schemas
   * @returns Array of ShopDTO
   */
  public static toShopDTOArray(schemas: ShopMarketplaceSchema[]): ShopDTO[] {
    return schemas.map((schema) => this.toShopDTO(schema));
  }

  /**
   * Map array of category marketplace schemas to MarketplaceCategoryDTO array
   * @param schemas Array of category marketplace database schemas
   * @returns Array of MarketplaceCategoryDTO
   */
  public static toMarketplaceCategoryDTOArray(
    schemas: CategoryMarketplaceSchema[]
  ): MarketplaceCategoryDTO[] {
    return schemas.map((schema) => this.toMarketplaceCategoryDTO(schema));
  }

  /**
   * Map array of location marketplace schemas to LocationDTO array
   * @param schemas Array of location marketplace database schemas
   * @returns Array of LocationDTO
   */
  public static toLocationDTOArray(
    schemas: LocationMarketplaceSchema[]
  ): LocationDTO[] {
    return schemas.map((schema) => this.toLocationDTO(schema));
  }
}
