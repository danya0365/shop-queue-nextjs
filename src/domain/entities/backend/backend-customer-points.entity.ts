import { PaginationMeta } from "@/src/domain/interfaces/pagination-types";
import type { Json } from "@/src/domain/types/supabase";
import { MembershipTier } from "./backend-customer.entity";

export type CustomerPointTransactionType = "earned" | "redeemed" | "expired";

export interface CustomerPointsEntity {
  id: string;
  shopId: string;
  customerId: string;
  currentPoints: number;
  totalEarned: number;
  totalRedeemed: number;
  totalExpired: number;
  membershipTier: MembershipTier;
  tierBenefits: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerPointsWithCustomerEntity extends CustomerPointsEntity {
  customerName: string | null;
  customerPhone: string | null;
  customerEmail: string | null;
  lastActivityAt: string | null;
  pointsToNextTier: number | null;
  nextTier: MembershipTier | null;
}

export interface CustomerPointsStatsEntity {
  totalCustomers: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  totalPointsExpired: number;
  averagePointsPerCustomer: number;
  tierDistribution: Record<string, number>;
}

export interface CustomerPointTransactionEntity {
  id: string;
  customerPointId: string;
  customerId: string;
  shopId: string;
  type: CustomerPointTransactionType;
  points: number;
  description: string | null;
  relatedQueueId: string | null;
  metadata: Json | null;
  transactionDate: string;
  createdAt: string;
}

export interface PaginatedCustomerPointTransactionsEntity {
  data: CustomerPointTransactionEntity[];
  pagination: PaginationMeta;
}

export interface CustomerPointTransactionFilters {
  type?: CustomerPointTransactionType;
  startDate?: string;
  endDate?: string;
}

export interface CustomerPointExpiryEntity {
  id: string;
  customerPointTransactionId: string;
  points: number;
  expiryDate: string;
  createdAt: string;
}
