export interface CustomerDTO {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  totalQueues: number; // joined from queue history
  totalPoints: number; // joined from customer points
  membershipTier: 'regular' | 'bronze' | 'silver' | 'gold' | 'platinum';  // joined from customer points
  lastVisit?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerStatsDTO {
  totalCustomers: number;
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
