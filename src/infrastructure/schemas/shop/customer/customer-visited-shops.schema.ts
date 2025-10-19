export interface ProfileVisitedShopRecord {
  shop_id: string;
  shop_slug: string;
  shop_name: string;
  customer_id: string;
  total_visits: number;
  first_visited_at: string;
  last_visited_at: string;
}

export interface ProfileVisitedShopsPaginationRecord {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GetProfileVisitedShopsRpcResult {
  data: ProfileVisitedShopRecord[];
  pagination: ProfileVisitedShopsPaginationRecord;
}
