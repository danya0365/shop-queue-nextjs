import {
  CustomerEntity,
  CustomerStatsEntity,
  MembershipTier,
} from "../../../domain/entities/backend/backend-customer.entity";
import { PaginationMeta } from "../../../domain/interfaces/pagination-types";
import {
  CustomerSchema,
  CustomerStatsSchema,
} from "../../schemas/backend/customer.schema";

/**
 * Mapper class for converting between customer database schema and domain entities
 * Following Clean Architecture principles for separation of concerns
 */
export class SupabaseBackendCustomerMapper {
  /**
   * Map database schema to domain entity
   * @param schema Customer database schema
   * @returns Customer domain entity
   */
  public static toDomain(schema: CustomerSchema): CustomerEntity {
    return {
      shopId: schema.shop_id,
      id: schema.id,
      name: schema.name,
      phone: schema.phone,
      email: schema.email,
      dateOfBirth: schema.date_of_birth,
      gender: schema.gender,
      address: schema.address,
      totalQueues: schema.total_queues || 0,
      totalPoints: schema.total_points || 0,
      membershipTier:
        (schema.membership_tier as MembershipTier) || MembershipTier.REGULAR,
      lastVisit: schema.last_visit || null,
      notes: schema.notes,
      isActive: schema.is_active,
      createdAt: schema.created_at,
      updatedAt: schema.updated_at,
    };
  }

  /**
   * Map domain entity to database schema
   * @param entity Customer domain entity
   * @returns Customer database schema
   */
  public static toSchema(entity: CustomerEntity): CustomerSchema {
    return {
      shop_id: entity.shopId,
      id: entity.id,
      name: entity.name,
      phone: entity.phone,
      email: entity.email,
      date_of_birth: entity.dateOfBirth,
      gender: entity.gender,
      address: entity.address,
      notes: entity.notes,
      is_active: entity.isActive,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
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
      totalCustomers: schema.total_customers,
      newCustomersThisMonth: schema.new_customers_this_month,
      activeCustomersToday: schema.active_customers_today,
      goldMembers: schema.gold_members,
      silverMembers: schema.silver_members,
      bronzeMembers: schema.bronze_members,
      regularMembers: schema.regular_members,
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
