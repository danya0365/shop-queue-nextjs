import {
  CustomerEntity,
  CustomerStatsEntity,
  MembershipTier,
} from "@/src/domain/entities/shop/backend/backend-customer.entity";
import { PaginationMeta } from "@/src/domain/interfaces/pagination-types";
import {
  CustomerStatsSchema,
  CustomerWithJoinedSchema,
} from "@/src/infrastructure/schemas/shop/backend/customer.schema";

/**
 * Mapper class for converting between customer database schema and domain entities
 * Following Clean Architecture principles for separation of concerns
 */
export class SupabaseShopBackendCustomerMapper {
  /**
   * Map database schema to domain entity
   * @param schema Customer database schema
   * @returns Customer domain entity
   */
  public static toDomain(schema: CustomerWithJoinedSchema): CustomerEntity {
    return {
      shopId: schema.shop_id,
      profileId: schema.profile_id,
      id: schema.id,
      name: schema.name,
      phone: schema.phone,
      email: schema.email,
      dateOfBirth: schema.date_of_birth,
      gender: schema.gender as CustomerEntity["gender"],
      address: schema.address,
      totalQueues: schema.total_queues || 0,
      totalPoints: schema.customer_points?.current_points || 0,
      membershipTier:
        (schema.customer_points?.membership_tier as MembershipTier) ||
        MembershipTier.REGULAR,
      lastVisit: schema.last_visit || null,
      notes: schema.notes,
      isActive: schema.is_active || true,
      createdAt: schema.created_at || "",
      updatedAt: schema.updated_at || "",
    };
  }

  /**
   * Map domain entity to database schema
   * @param entity Customer domain entity
   * @returns Customer database schema
   */
  public static toSchema(entity: CustomerEntity): CustomerWithJoinedSchema {
    return {
      shop_id: entity.shopId,
      profile_id: entity.profileId,
      id: entity.id,
      name: entity.name,
      phone: entity.phone,
      email: entity.email,
      date_of_birth: entity.dateOfBirth,
      gender: entity.gender,
      address: entity.address,
      notes: entity.notes,
      is_active: entity.isActive,
      last_visit: entity.lastVisit || "",
      created_at: entity.createdAt || "",
      updated_at: entity.updatedAt || "",
    };
  }

  /**
   * Map customer stats schema to domain entity
   * @param schema Customer stats database schema
   * @returns Customer stats domain entity
   */
  public static statsToEntity(
    schema: CustomerStatsSchema
  ): CustomerStatsEntity {
    return {
      totalCustomers: schema.total_customers || 0,
      totalRegisteredCustomers: schema.total_registered_customers || 0,
      newCustomersThisMonth: schema.new_customers_this_month || 0,
      activeCustomersToday: schema.active_customers_today || 0,
      goldMembers: schema.gold_members || 0,
      silverMembers: schema.silver_members || 0,
      bronzeMembers: schema.bronze_members || 0,
      regularMembers: schema.regular_members || 0,
    };
  }

  /**
   * Create pagination metadata from database results
   * @param page Current page number
   * @param limit Items per page
   * @param totalItems Total number of items
   * @returns Pagination metadata
   */
  public static createPaginationMeta(
    page: number,
    limit: number,
    totalItems: number
  ): PaginationMeta {
    const totalPages = Math.ceil(totalItems / limit);

    return {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }
}
