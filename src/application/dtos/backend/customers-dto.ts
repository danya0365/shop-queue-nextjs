import { MembershipTier } from "@/src/domain/entities/backend/backend-customer.entity";
import { PaginatedResult } from "@/src/domain/interfaces/pagination-types";

export interface CustomerDTO {
  id: string;
  profileId: string | null;
  name: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  totalQueues: number; // joined from queue history
  totalPoints: number; // joined from customer points
  membershipTier: MembershipTier; // joined from customer points
  lastVisit?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerStatsDTO {
  totalCustomers: number;
  totalRegisteredCustomers: number;
  newCustomersThisMonth: number;
  activeCustomersToday: number;
  goldMembers: number;
  silverMembers: number;
  bronzeMembers: number;
  regularMembers: number;
}

export interface CustomersDataDTO {
  customers: CustomerDTO[];
  stats: CustomerStatsDTO;
  totalCount: number;
  currentPage: number;
  perPage: number;
}

export type PaginatedCustomersDTO = PaginatedResult<CustomerDTO>;
