/**
 * Data transfer object for pagination parameters
 */
export interface PaginationParamsDto {
  page: number;
  limit: number;
}

/**
 * Data transfer object for paginated results
 */
export interface PaginatedResultDto<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
