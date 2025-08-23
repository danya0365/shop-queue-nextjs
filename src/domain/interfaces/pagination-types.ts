/**
 * Pagination parameters for domain layer
 * Following Clean Architecture by keeping domain types separate from application DTOs
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Pagination metadata for domain layer
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Paginated result for domain layer
 * Generic type T represents the data type being paginated
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}
