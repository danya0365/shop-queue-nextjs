export interface VisitedShopEntity {
  shopId: string;
  shopSlug: string;
  shopName: string;
  customerId: string;
  totalVisits: number;
  firstVisitedAt: string;
  lastVisitedAt: string;
}

export interface GetVisitedShopsByProfileParams {
  profileId: string;
  page?: number;
  limit?: number;
}

export interface VisitedShopsPaginationEntity {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface VisitedShopsResultEntity {
  visitedShops: VisitedShopEntity[];
  pagination: VisitedShopsPaginationEntity;
}
