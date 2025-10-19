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
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface GetProfileVisitedShopsRpcResult {
  data: ProfileVisitedShopRecord[];
  pagination: ProfileVisitedShopsPaginationRecord;
}
