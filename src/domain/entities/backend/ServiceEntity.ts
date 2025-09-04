export interface ServiceEntity {
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

export interface ServiceStatsEntity {
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
