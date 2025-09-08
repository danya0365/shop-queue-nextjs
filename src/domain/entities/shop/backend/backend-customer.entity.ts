import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";

/**
 * Customer entity representing a customer in the system
 * Following Clean Architecture principles - domain entity
 */
export interface CustomerEntity {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  dateOfBirth: string | null;
  gender: 'male' | 'female' | 'other' | null;
  address: string | null;
  totalQueues: number;
  totalPoints: number;
  membershipTier: MembershipTier;
  lastVisit: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Membership tier enum
 */
export enum MembershipTier {
  REGULAR = 'regular',
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum'
}

/**
 * Customer statistics entity
 */
export interface CustomerStatsEntity {
  totalCustomers: number;
  newCustomersThisMonth: number;
  activeCustomersToday: number;
  goldMembers: number;
  silverMembers: number;
  bronzeMembers: number;
  regularMembers: number;
}

/**
 * Paginated customers result
 */
export type PaginatedCustomersEntity = PaginatedResult<CustomerEntity>;
