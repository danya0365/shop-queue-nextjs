import type {
  CustomerPointExpiryEntity,
  CustomerPointTransactionEntity,
  CustomerPointsEntity,
  CustomerPointsStatsEntity,
  CustomerPointsWithCustomerEntity,
} from "@/src/domain/entities/backend/backend-customer-points.entity";
import type {
  CustomerPointExpirySchema,
  CustomerPointTransactionWithCustomerSchema,
  CustomerPointsSchema,
  CustomerPointsStatsSchema,
  CustomerPointsWithCustomerSchema,
  MembershipTierEnum,
  TransactionTypeEnum,
} from "@/src/infrastructure/schemas/backend/customer-points.schema";
import type { PaginationMeta } from "@/src/domain/interfaces/pagination-types";
import { MembershipTier } from "@/src/domain/entities/backend/backend-customer.entity";

const TRANSACTION_TYPE_MAP: Record<TransactionTypeEnum, "earned" | "redeemed" | "expired"> = {
  earned: "earned",
  redeemed: "redeemed",
  expired: "expired",
};

const REVERSE_TRANSACTION_TYPE_MAP: Record<"earned" | "redeemed" | "expired", TransactionTypeEnum> = {
  earned: "earned",
  redeemed: "redeemed",
  expired: "expired",
};

export class SupabaseBackendCustomerPointsMapper {
  static toDomain(schema: CustomerPointsSchema): CustomerPointsEntity {
    return {
      id: schema.id,
      shopId: schema.shop_id,
      customerId: schema.customer_id,
      currentPoints: schema.current_points ?? 0,
      totalEarned: schema.total_earned ?? 0,
      totalRedeemed: schema.total_redeemed ?? 0,
      totalExpired: schema.total_expired ?? 0,
      membershipTier: this.mapTierFromSchema(schema.membership_tier),
      tierBenefits: schema.tier_benefits ?? [],
      createdAt: schema.created_at ?? new Date().toISOString(),
      updatedAt: schema.updated_at ?? new Date().toISOString(),
    };
  }

  static toDomainWithCustomer(
    schema: CustomerPointsWithCustomerSchema
  ): CustomerPointsWithCustomerEntity {
    const base = this.toDomain(schema);
    return {
      ...base,
      customerName: schema.customers?.name ?? null,
      customerPhone: schema.customers?.phone ?? null,
      customerEmail: schema.customers?.email ?? null,
      lastActivityAt: schema.last_transaction_at ?? schema.updated_at ?? null,
      pointsToNextTier: null,
      nextTier: null,
    };
  }

  static statsToDomain(schema: CustomerPointsStatsSchema): CustomerPointsStatsEntity {
    return {
      totalCustomers: Number(schema.total_customers ?? 0),
      totalPointsIssued: Number(schema.total_points_issued ?? 0),
      totalPointsRedeemed: Number(schema.total_points_redeemed ?? 0),
      totalPointsExpired: Number(schema.total_points_expired ?? 0),
      averagePointsPerCustomer: Number(schema.average_points_per_customer ?? 0),
      tierDistribution: {},
    };
  }

  static transactionToDomain(
    schema: CustomerPointTransactionWithCustomerSchema
  ): CustomerPointTransactionEntity {
    return {
      id: schema.id,
      customerPointId: schema.customer_point_id,
      customerId: schema.customer_points?.customer_id ?? "",
      shopId: schema.customer_points?.shop_id ?? "",
      type: TRANSACTION_TYPE_MAP[schema.type],
      points: schema.points,
      description: schema.description,
      relatedQueueId: schema.related_queue_id,
      metadata: schema.metadata,
      transactionDate:
        schema.transaction_date ?? schema.created_at ?? new Date().toISOString(),
      createdAt: schema.created_at ?? new Date().toISOString(),
    };
  }

  static expiryToDomain(schema: CustomerPointExpirySchema): CustomerPointExpiryEntity {
    return {
      id: schema.id,
      customerPointTransactionId: schema.customer_point_transaction_id,
      points: schema.points,
      expiryDate: schema.expiry_date,
      createdAt: schema.created_at ?? new Date().toISOString(),
    };
  }

  static createPaginationMeta(
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

  static tierToSchema(tier: MembershipTier): MembershipTierEnum {
    switch (tier) {
      case MembershipTier.SILVER:
        return "silver";
      case MembershipTier.GOLD:
        return "gold";
      case MembershipTier.PLATINUM:
        return "platinum";
      case MembershipTier.BRONZE:
      default:
        return "bronze";
    }
  }

  static transactionTypeToSchema(
    type: "earned" | "redeemed" | "expired"
  ): TransactionTypeEnum {
    return REVERSE_TRANSACTION_TYPE_MAP[type];
  }

  private static mapTierFromSchema(
    tier: MembershipTierEnum | null | undefined
  ): MembershipTier {
    switch (tier) {
      case "silver":
        return MembershipTier.SILVER;
      case "gold":
        return MembershipTier.GOLD;
      case "platinum":
        return MembershipTier.PLATINUM;
      case "bronze":
        return MembershipTier.BRONZE;
      default:
        return MembershipTier.REGULAR;
    }
  }
}
