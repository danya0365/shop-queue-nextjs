export interface VisitedShopDTO {
  shopId: string;
  shopSlug: string;
  shopName: string;
  customerId: string;
  totalVisits: number;
  firstVisitedAt: string;
  lastVisitedAt: string;
}

export interface VisitedShopsPaginationDTO {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface VisitedShopsDataDTO {
  visitedShops: VisitedShopDTO[];
  pagination: VisitedShopsPaginationDTO;
}

export interface GetVisitedShopsByProfileInputDTO {
  profileId: string;
  page?: number;
  limit?: number;
}
