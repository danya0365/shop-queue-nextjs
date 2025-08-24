/**
 * Base interface for database operations with common error handling
 */
export interface IBaseDataSource {
  /**
   * Handles database errors in a consistent way
   * @param error The error to handle
   * @param operation Optional operation description
   * @param context Optional context information
   * @throws DatabaseError with appropriate error type
   */
  handleError(error: unknown, operation?: string, context?: string): never;
}

/**
 * Filter operators for database queries
 */
export enum FilterOperator {
  EQ = 'eq',           // Equal
  NEQ = 'neq',         // Not equal
  GT = 'gt',           // Greater than
  GTE = 'gte',         // Greater than or equal
  LT = 'lt',           // Less than
  LTE = 'lte',         // Less than or equal
  LIKE = 'like',       // Pattern matching with % wildcards
  ILIKE = 'ilike',     // Case-insensitive pattern matching
  IN = 'in',           // In a list of values
  IS = 'is',           // Is (for null/true/false)
  CONTAINS = 'contains', // JSON contains
  OVERLAPS = 'overlaps', // Arrays overlap
  MATCH = 'match',     // Full-text search match
  STARTS_WITH = 'starts_with', // String starts with
  ENDS_WITH = 'ends_with'    // String ends with
}

/**
 * Sort direction for ordering results
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

/**
 * Filter definition for database queries
 */
export interface QueryFilter {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

/**
 * Sort definition for database queries
 */
export interface QuerySort {
  field: string;
  direction: SortDirection;
  nullsFirst?: boolean;
}

/**
 * Pagination parameters for database queries
 */
export interface QueryPagination {
  page?: number;
  pageSize?: number;
  offset?: number;
  limit?: number;
}

/**
 * Join definition for database queries
 */
export interface QueryJoin {
  table: string;
  alias?: string;
  type?: 'inner' | 'left' | 'right' | 'full';
  on: {
    fromField: string;
    toField: string;
  };
}

/**
 * Advanced query options for database operations
 */
export interface QueryOptions {
  select?: string[];
  filters?: QueryFilter[];
  sort?: QuerySort[];
  pagination?: QueryPagination;
  joins?: QueryJoin[];
  groupBy?: string[];
  having?: QueryFilter[];
  count?: 'exact' | 'planned' | 'estimated';
}

/**
 * Interface for read-only database operations
 * Following Interface Segregation Principle by separating read operations
 */
export interface IReadDataSource extends IBaseDataSource {
  /**
   * Get data from a table with optional filters
   * @param table The table to query
   * @param query Optional query parameters (simple equality filters)
   * @returns Promise with array of records
   * @throws DatabaseError if the operation fails
   */
  get<T extends Record<string, unknown>>(table: string, query?: Record<string, unknown>): Promise<T[]>;

  /**
   * Get data from a table with advanced query options
   * @param table The table to query
   * @param options Advanced query options including filters, sorting, pagination, and joins
   * @returns Promise with array of records
   * @throws DatabaseError if the operation fails
   */
  getAdvanced<T extends Record<string, unknown>>(table: string, options: QueryOptions): Promise<T[]>;

  /**
   * Get a single record by ID
   * @param table The table to query
   * @param id The ID of the record to retrieve
   * @param options Optional advanced query options for selecting specific fields or including related data
   * @returns Promise with the record or null if not found
   * @throws DatabaseError if the operation fails
   */
  getById<T extends Record<string, unknown>>(table: string, id: string, options?: Pick<QueryOptions, 'select' | 'joins'>): Promise<T | null>;

  /**
   * Search data with a query
   * @param table The table to search
   * @param query The search query
   * @param columns The columns to search in
   * @param options Optional advanced query options for sorting, pagination, etc.
   * @returns Promise with array of matching records
   * @throws DatabaseError if the operation fails
   */
  search<T extends Record<string, unknown>>(table: string, query: string, columns: string[], options?: Omit<QueryOptions, 'filters'>): Promise<T[]>;

  /**
   * Count records in a table with optional filters
   * @param table The table to count records in
   * @param options Optional advanced query options for filtering
   * @returns Promise with the count of matching records
   * @throws DatabaseError if the operation fails
   */
  count(table: string, options?: Pick<QueryOptions, 'filters' | 'joins'>): Promise<number>;
}

/**
 * Interface for write database operations
 * Following Interface Segregation Principle by separating write operations
 */
export interface IWriteDataSource extends IBaseDataSource {
  /**
   * Insert data into a table
   * @param table The table to insert into
   * @param data The data to insert
   * @returns Promise with the inserted record or null if failed
   * @throws DatabaseError if the operation fails
   */
  insert<T extends Record<string, unknown>>(table: string, data: Record<string, unknown>): Promise<T>;

  /**
   * Update data in a table
   * @param table The table to update
   * @param id The ID of the record to update
   * @param data The data to update
   * @returns Promise with the updated record or null if not found
   * @throws DatabaseError if the operation fails
   */
  update<T extends Record<string, unknown>>(table: string, id: string, data: Record<string, unknown>): Promise<T>;

  /**
   * Delete data from a table
   * @param table The table to delete from
   * @param id The ID of the record to delete
   * @returns Promise with boolean indicating success
   * @throws DatabaseError if the operation fails
   */
  delete(table: string, id: string): Promise<void>;
}

/**
 * Interface for advanced database operations
 * Following Interface Segregation Principle by separating specialized operations
 */
export interface IAdvancedDataSource extends IBaseDataSource {
  /**
   * Call a Remote Procedure Call (RPC) function
   * @param functionName The name of the RPC function to call
   * @param params Parameters to pass to the RPC function
   * @returns Promise with the result which can be any type
   * @throws DatabaseError if the operation fails
   */
  callRpc<T = unknown>(functionName: string, params?: Record<string, unknown>): Promise<T>;

  /**
   * Get the underlying database client
   * @returns The database client instance
   */
  getClient(): unknown;
}

/**
 * Combined interface for database operations that abstracts the underlying database implementation
 * Following the Dependency Inversion Principle, high-level modules should not depend on low-level modules
 * Clients should depend on the specific interfaces they need, not this combined interface
 */
export interface DatabaseDataSource extends IReadDataSource, IWriteDataSource, IAdvancedDataSource { }

/**
 * Database error types for domain error handling
 */
export enum DatabaseErrorType {
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  FOREIGN_KEY_VIOLATION = 'FOREIGN_KEY_VIOLATION',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  QUERY_ERROR = 'QUERY_ERROR',
  SCHEMA_ERROR = 'SCHEMA_ERROR',
  CONSTRAINT_VIOLATION = 'CONSTRAINT_VIOLATION',
  OPERATION_FAILED = 'OPERATION_FAILED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Domain error for database operations
 */
export class DatabaseError extends Error {
  constructor(
    public readonly type: DatabaseErrorType,
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}
