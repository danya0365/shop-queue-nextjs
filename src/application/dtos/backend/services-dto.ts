// Service DTOs
export interface ServiceDTO {
  id: string;
  shopId: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  estimatedDuration?: number; // minutes
  category?: string;
  isAvailable?: boolean;
  icon?: string;
  popularityRank?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceStatsDTO {
  totalServices: number;
  availableServices: number;
  unavailableServices: number;
  averagePrice: number;
  totalRevenue: number;
  servicesByCategory: {
    [category: string]: number;
  };
  popularServices: {
    id: string;
    name: string;
    bookingCount: number;
  }[];
}

export interface ServicesDataDTO {
  services: ServiceDTO[];
  stats: ServiceStatsDTO;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// Input DTOs for use cases
export interface GetServicesInputDTO {
  page: number;
  limit: number;
  filters?: {
    searchQuery?: string;
    categoryFilter?: string;
    availabilityFilter?: string;
    shopId?: string;
  };
}

export interface CreateServiceInputDTO {
  shopId: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  estimatedDuration?: number;
  category?: string;
  isAvailable?: boolean;
  icon?: string;
  popularityRank?: number;
}

export interface UpdateServiceInputDTO {
  id: string;
  updates: Partial<{
    name: string;
    slug: string;
    description: string;
    price: number;
    estimatedDuration: number;
    category: string;
    isAvailable: boolean;
    icon: string;
    popularityRank: number;
  }>;
}
