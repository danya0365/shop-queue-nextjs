// ใช้ type ของ SupabaseClient เพื่อความสอดคล้องกับ type เดิม

import { Logger } from "@/src/domain/interfaces/logger";
import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import {
  DatabaseError,
  DatabaseErrorType,
  FilterOperator,
  IAdvancedDataSource,
  IReadDataSource,
  IWriteDataSource,
  QueryOptions,
  SortDirection,
} from "../../domain/interfaces/datasources/database-datasource";

/**
 * Enum for different types of Supabase clients
 */
export enum SupabaseClientType {
  BROWSER = "browser", // Client-side with limited permissions
  SERVER = "server", // Server-side with user context
  ADMIN = "admin", // Server-side with service role (bypasses RLS)
}

/**
 * Supabase implementation of the database datasource interfaces
 * This adapter pattern allows us to swap out Supabase with another database provider if needed
 * Following Interface Segregation Principle by implementing multiple smaller interfaces
 */
export class SupabaseDatasource
  implements IReadDataSource, IWriteDataSource, IAdvancedDataSource {
  private client: SupabaseClient;
  private clientType: SupabaseClientType;
  private logger?: Logger;

  /**
   * Constructor with dependency injection
   * @param client Supabase client instance
   * @param clientType Type of client (browser, server, or admin)
   * @param logger Optional logger for additional logging
   */
  constructor(
    client: SupabaseClient,
    clientType: SupabaseClientType,
    logger?: Logger
  ) {
    if (!client) {
      throw new Error("Supabase client is required for SupabaseDatasource");
    }
    this.client = client;
    this.clientType = clientType;
    this.logger = logger;
  }

  /**
   * Handle database errors in a consistent way
   * @param error The error to handle
   * @param operation The operation that caused the error
   * @param table The table involved in the operation
   * @throws DatabaseError with appropriate error type
   */
  handleError(error: unknown, operation: string, table: string): never {
    // Log the error if logger is available
    if (this.logger) {
      this.logger.error(`Error during ${operation} on ${table}:`, error);
    } else {
      console.error(`Error during ${operation} on ${table}:`, error);
    }

    let errorType = DatabaseErrorType.UNKNOWN_ERROR;
    let message = `Database operation failed: ${operation} on ${table}`;

    if (error instanceof Error) {
      message = error.message;

      // Handle PostgrestError specifically
      const pgError = error as PostgrestError;
      if (pgError.code) {
        switch (pgError.code) {
          case "23505": // Unique violation
            errorType = DatabaseErrorType.DUPLICATE_ENTRY;
            break;
          case "23503": // Foreign key violation
            errorType = DatabaseErrorType.FOREIGN_KEY_VIOLATION;
            break;
          case "42P01": // Undefined table
          case "42703": // Undefined column
            errorType = DatabaseErrorType.SCHEMA_ERROR;
            break;
          case "28000": // Invalid authorization
          case "42501": // Insufficient privilege
            errorType = DatabaseErrorType.PERMISSION_DENIED;
            break;
          case "08006": // Connection failure
            errorType = DatabaseErrorType.CONNECTION_ERROR;
            break;
          default:
            if (pgError.code.startsWith("22")) {
              // Data exception
              errorType = DatabaseErrorType.VALIDATION_ERROR;
            } else if (pgError.code.startsWith("23")) {
              // Integrity constraint violation
              errorType = DatabaseErrorType.CONSTRAINT_VIOLATION;
            } else if (pgError.code.startsWith("42")) {
              // Syntax error or access rule violation
              errorType = DatabaseErrorType.QUERY_ERROR;
            }
        }
      }
    }

    throw new DatabaseError(errorType, message, error);
  }

  async get<T>(table: string, query?: Record<string, unknown>): Promise<T[]> {
    try {
      let queryBuilder = this.client.from(table).select("*");

      if (query) {
        Object.entries(query).forEach(([key, value]) => {
          queryBuilder = queryBuilder.eq(key, value);
        });
      }

      const { data, error } = await queryBuilder;

      if (error) {
        this.handleError(error, "get", table);
      }

      return data as T[];
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      this.handleError(error, "get", table);
    }
  }

  /**
   * Get data from a table with advanced query options
   * @param table The table to query
   * @param options Advanced query options including filters, sorting, pagination, and joins
   * @returns Promise with array of records
   * @throws DatabaseError if the operation fails
   */
  async getAdvanced<T>(table: string, options: QueryOptions): Promise<T[]> {
    try {
      // ไม่มี debug log

      // ประกาศตัวแปรที่ถูกต้องสำหรับ query builder
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let queryBuilder: any = this.client.from(table);

      // สร้าง select string สำหรับการ query
      let selectString = options.select ? options.select.join(",") : "*";

      // ถ้ามีการระบุ joins ให้เพิ่ม foreign tables เข้าไปใน select string
      if (options.joins && options.joins.length > 0) {
        const foreignTables = options.joins
          .map((join) => {
            const alias = join.alias || join.table;
            return `${join.table}(*)${alias !== join.table ? `:${alias}` : ""}`;
          })
          .join(",");

        // เพิ่ม foreign tables เข้าไปใน select string
        selectString = `${selectString},${foreignTables}`;
      }

      // สร้าง query builder ด้วย select string ที่สมบูรณ์
      queryBuilder = this.client.from(table).select(selectString);

      // ถ้ามีการระบุ filters ให้เพิ่มเข้าไปใน query
      if (options.filters && options.filters.length > 0) {
        options.filters.forEach((filter) => {
          switch (filter.operator) {
            case FilterOperator.EQ:
              queryBuilder = queryBuilder.eq(filter.field, filter.value);
              break;
            case FilterOperator.NEQ:
              queryBuilder = queryBuilder.neq(filter.field, filter.value);
              break;
            case FilterOperator.GT:
              queryBuilder = queryBuilder.gt(filter.field, filter.value);
              break;
            case FilterOperator.GTE:
              queryBuilder = queryBuilder.gte(filter.field, filter.value);
              break;
            case FilterOperator.LT:
              queryBuilder = queryBuilder.lt(filter.field, filter.value);
              break;
            case FilterOperator.LTE:
              queryBuilder = queryBuilder.lte(filter.field, filter.value);
              break;
            case FilterOperator.LIKE:
              queryBuilder = queryBuilder.like(
                filter.field,
                filter.value as string
              );
              break;
            case FilterOperator.ILIKE:
              queryBuilder = queryBuilder.ilike(
                filter.field,
                filter.value as string
              );
              break;
            case FilterOperator.IN:
              queryBuilder = queryBuilder.in(
                filter.field,
                filter.value as unknown[]
              );
              break;
            case FilterOperator.IS:
              queryBuilder = queryBuilder.is(
                filter.field,
                filter.value as boolean | null
              );
              break;
            case FilterOperator.CONTAINS:
              queryBuilder = queryBuilder.contains(
                filter.field,
                filter.value as unknown
              );
              break;
            case FilterOperator.OVERLAPS:
              queryBuilder = queryBuilder.overlaps(
                filter.field,
                filter.value as unknown[]
              );
              break;
            case FilterOperator.MATCH:
              queryBuilder = queryBuilder.textSearch(
                filter.field,
                filter.value as string,
                {
                  type: "websearch",
                  config: "english",
                }
              );
              break;
            case FilterOperator.STARTS_WITH:
              queryBuilder = queryBuilder.ilike(
                filter.field,
                `${filter.value}%`
              );
              break;
            case FilterOperator.ENDS_WITH:
              queryBuilder = queryBuilder.ilike(
                filter.field,
                `%${filter.value}`
              );
              break;
            default:
              // Default to equality if operator is not recognized
              queryBuilder = queryBuilder.eq(filter.field, filter.value);
              break;
          }
        });
      }

      // Handle sorting
      if (options.sort && options.sort.length > 0) {
        options.sort.forEach((sort) => {
          queryBuilder = queryBuilder.order(sort.field, {
            ascending: sort.direction === SortDirection.ASC,
            nullsFirst: sort.nullsFirst,
          });
        });
      }

      // Handle pagination
      if (options.pagination) {
        if (options.pagination.limit) {
          queryBuilder = queryBuilder.limit(options.pagination.limit);
        } else if (options.pagination.pageSize) {
          queryBuilder = queryBuilder.limit(options.pagination.pageSize);
        }

        if (options.pagination.offset) {
          queryBuilder = queryBuilder.range(
            options.pagination.offset,
            options.pagination.offset + (options.pagination.limit || 10) - 1
          );
        } else if (options.pagination.page && options.pagination.pageSize) {
          const from =
            (options.pagination.page - 1) * options.pagination.pageSize;
          queryBuilder = queryBuilder.range(
            from,
            from + options.pagination.pageSize - 1
          );
        }
      }

      const { data, error } = await queryBuilder;

      if (error) {
        if (this.logger) {
          this.logger.error(
            `Supabase query error in getAdvanced: ${error.message}`,
            {
              code: error.code,
              details: error.details,
              hint: error.hint,
            }
          );
        }
        this.handleError(error, "getAdvanced", table);
      }

      return data as T[];
    } catch (error) {
      if (this.logger) {
        this.logger.error(
          `Exception in getAdvanced: ${error instanceof Error ? error.message : JSON.stringify(error)
          }`
        );
      }

      if (error instanceof DatabaseError) {
        throw error;
      }
      this.handleError(error, "getAdvanced", table);
    }
  }

  /**
   * นับจำนวนเรคอร์ดในตารางตามเงื่อนไขที่กำหนด
   * @param table ชื่อตาราง
   * @param options ตัวเลือกการค้นหาขั้นสูง
   * @returns จำนวนเรคอร์ดที่พบ
   */
  async count(table: string, options?: QueryOptions): Promise<number> {
    try {
      // ประกาศตัวแปรที่ถูกต้องสำหรับ query builder
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let queryBuilder: any = this.client.from(table);

      // สร้าง query สำหรับนับจำนวนเรคอร์ด
      queryBuilder = queryBuilder.select("*", { count: "exact", head: true });

      // ถ้ามีการระบุ joins ให้เพิ่มเข้าไปใน query
      if (options?.joins && options.joins.length > 0) {
        const foreignTables = options.joins
          .map((join) => {
            const alias = join.alias || join.table;
            return `${join.table}(*)${alias !== join.table ? `:${alias}` : ""}`;
          })
          .join(",");

        // ใช้ foreignTables ในการสร้าง query
        queryBuilder = this.client
          .from(table)
          .select(`*,${foreignTables}`, { count: "exact", head: true });
      }

      // ถ้ามีการระบุ filters ให้เพิ่มเข้าไปใน query
      if (options?.filters && options.filters.length > 0) {
        options.filters.forEach((filter) => {
          switch (filter.operator) {
            case FilterOperator.EQ:
              queryBuilder = queryBuilder.eq(filter.field, filter.value);
              break;
            case FilterOperator.NEQ:
              queryBuilder = queryBuilder.neq(filter.field, filter.value);
              break;
            case FilterOperator.GT:
              queryBuilder = queryBuilder.gt(filter.field, filter.value);
              break;
            case FilterOperator.GTE:
              queryBuilder = queryBuilder.gte(filter.field, filter.value);
              break;
            case FilterOperator.LT:
              queryBuilder = queryBuilder.lt(filter.field, filter.value);
              break;
            case FilterOperator.LTE:
              queryBuilder = queryBuilder.lte(filter.field, filter.value);
              break;
            case FilterOperator.LIKE:
              queryBuilder = queryBuilder.like(
                filter.field,
                filter.value as string
              );
              break;
            case FilterOperator.ILIKE:
              queryBuilder = queryBuilder.ilike(
                filter.field,
                filter.value as string
              );
              break;
            case FilterOperator.IN:
              queryBuilder = queryBuilder.in(
                filter.field,
                filter.value as unknown[]
              );
              break;
            case FilterOperator.IS:
              queryBuilder = queryBuilder.is(
                filter.field,
                filter.value as boolean | null
              );
              break;
            case FilterOperator.CONTAINS:
              queryBuilder = queryBuilder.contains(
                filter.field,
                filter.value as unknown
              );
              break;
            case FilterOperator.OVERLAPS:
              queryBuilder = queryBuilder.overlaps(
                filter.field,
                filter.value as unknown[]
              );
              break;
            case FilterOperator.MATCH:
              queryBuilder = queryBuilder.textSearch(
                filter.field,
                filter.value as string,
                {
                  type: "websearch",
                  config: "english",
                }
              );
              break;
            case FilterOperator.STARTS_WITH:
              queryBuilder = queryBuilder.ilike(
                filter.field,
                `${filter.value}%`
              );
              break;
            case FilterOperator.ENDS_WITH:
              queryBuilder = queryBuilder.ilike(
                filter.field,
                `%${filter.value}`
              );
              break;
            default:
              // Default to equality if operator is not recognized
              queryBuilder = queryBuilder.eq(filter.field, filter.value);
              break;
          }
        });
      }

      const { count, error } = await queryBuilder;

      if (error) {
        this.handleError(error, "count", table);
      }

      return count || 0;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      this.handleError(error, "count", table);
      return 0; // Fallback in case handleError doesn't throw
    }
  }

  /**
   * Get a single record by ID
   * @param table The table to query
   * @param id The ID of the record to retrieve
   * @param options Optional advanced query options for selecting specific fields or including related data
   * @returns Promise with the record or null if not found
   * @throws DatabaseError if the operation fails
   */
  async getById<T>(
    table: string,
    id: string,
    options?: Pick<QueryOptions, "select" | "joins">
  ): Promise<T | null> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let queryBuilder: any = this.client.from(table);

      // Select specific fields if provided, otherwise select all
      const selectFields = options?.select ? options.select.join(",") : "*";

      // Handle joins if provided
      if (options?.joins && options.joins.length > 0) {
        const foreignTables = options.joins
          .map((join) => {
            const alias = join.alias || join.table;
            return `${join.table}(*)${alias !== join.table ? `:${alias}` : ""}`;
          })
          .join(",");

        queryBuilder = queryBuilder.select(`${selectFields},${foreignTables}`);
      } else {
        queryBuilder = queryBuilder.select(selectFields);
      }

      // Add the ID filter and get a single record
      const { data, error } = await queryBuilder.eq("id", id).single();

      if (error) {
        // Handle 'not found' as a special case that returns null rather than throwing
        if (error.code === "PGRST116") {
          return null;
        }
        this.handleError(error, "getById", table);
      }

      return data as T;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      this.handleError(error, "getById", table);
    }
  }

  async insert<T>(table: string, data: Record<string, unknown>): Promise<T> {
    try {
      const { data: insertedData, error } = await this.client
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) {
        this.handleError(error, "insert", table);
      }

      if (!insertedData) {
        this.handleError(
          new Error("No data returned after insert"),
          "insert",
          table
        );
      }

      return insertedData as T;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      this.handleError(error, "insert", table);
    }
  }

  async update<T>(
    table: string,
    id: string,
    data: Record<string, unknown>
  ): Promise<T> {
    try {
      // First check if the record exists to avoid the PGRST116 error
      const { data: existingData, error: checkError } = await this.client
        .from(table)
        .select("id")
        .eq("id", id);

      if (checkError) {
        this.handleError(checkError, "update (check existence)", table);
      }

      // If no record exists, throw a not found error
      if (!existingData || existingData.length === 0) {
        throw new DatabaseError(
          DatabaseErrorType.NOT_FOUND,
          `Record with id ${id} not found in ${table}`
        );
      }

      // Proceed with update since we know the record exists
      const { data: updatedData, error } = await this.client
        .from(table)
        .update(data)
        .eq("id", id)
        .select();

      if (error) {
        this.handleError(error, "update", table);
      }

      // Return the first result if available, otherwise throw error
      if (!updatedData || updatedData.length === 0) {
        throw new DatabaseError(
          DatabaseErrorType.OPERATION_FAILED,
          `Update operation did not return updated data for id ${id} in ${table}`
        );
      }

      return updatedData[0] as T;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      this.handleError(error, "update", table);
    }
  }

  async delete(table: string, id: string): Promise<void> {
    try {
      const { error } = await this.client.from(table).delete().eq("id", id);

      if (error) {
        this.handleError(error, "delete", table);
      }
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      this.handleError(error, "delete", table);
    }
  }

  /**
   * Search for records in a table using a query string and advanced options
   * @param table The table to search in
   * @param query The search query string
   * @param columns The columns to search in
   * @param options Optional advanced query options
   * @returns Promise with array of matching records
   * @throws DatabaseError if the operation fails
   */
  async search<T>(
    table: string,
    query: string,
    columns: string[],
    options?: Omit<QueryOptions, "filters">
  ): Promise<T[]> {
    try {
      // Using Supabase text search capabilities
      const textSearchQuery = columns
        .map((column) => `${column}.ilike.%${query}%`)
        .join(",");

      // Start with the table and build the query
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let queryBuilder: any = this.client.from(table);

      // Select specific fields if provided, otherwise select all
      const selectFields = options?.select ? options.select.join(",") : "*";
      queryBuilder = queryBuilder.select(selectFields);

      // Handle joins if provided
      if (options?.joins && options.joins.length > 0) {
        const foreignTables = options.joins
          .map((join) => {
            const alias = join.alias || join.table;
            return `${join.table}(*)${alias !== join.table ? `:${alias}` : ""}`;
          })
          .join(",");

        queryBuilder = this.client
          .from(table)
          .select(`${selectFields},${foreignTables}`);
      }

      // Add the search filter
      queryBuilder = queryBuilder.or(textSearchQuery);

      // Handle sorting
      if (options?.sort && options.sort.length > 0) {
        options.sort.forEach((sort) => {
          queryBuilder = queryBuilder.order(sort.field, {
            ascending: sort.direction === SortDirection.ASC,
            nullsFirst: sort.nullsFirst,
          });
        });
      }

      // Handle pagination
      if (options?.pagination) {
        if (options.pagination.limit) {
          queryBuilder = queryBuilder.limit(options.pagination.limit);
        } else if (options.pagination.pageSize) {
          queryBuilder = queryBuilder.limit(options.pagination.pageSize);
        }

        if (options.pagination.offset) {
          queryBuilder = queryBuilder.range(
            options.pagination.offset,
            options.pagination.offset + (options.pagination.limit || 10) - 1
          );
        } else if (options.pagination.page && options.pagination.pageSize) {
          const from =
            (options.pagination.page - 1) * options.pagination.pageSize;
          queryBuilder = queryBuilder.range(
            from,
            from + options.pagination.pageSize - 1
          );
        }
      }

      const { data, error } = await queryBuilder;

      if (error) {
        this.handleError(error, "search", table);
      }

      return (data as T[]) || [];
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      this.handleError(error, "search", table);
    }
  }

  /**
   * Call a Remote Procedure Call (RPC) function
   * @param functionName The name of the RPC function to call
   * @param params Parameters to pass to the RPC function
   * @returns The result of the RPC call which can be any type
   * @throws DatabaseError if the operation fails
   */
  async callRpc<T = unknown>(
    functionName: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    try {
      const { data, error } = await this.client.rpc(functionName, params || {});

      if (error) {
        this.handleError(error, "callRpc", functionName);
      }

      // Return the data as is, allowing the caller to handle the type
      return data as T;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      this.handleError(error, "callRpc", functionName);
    }
  }

  /**
   * Get the underlying database client
   * @returns The Supabase client instance
   */
  getClient(): unknown {
    return this.client;
  }

  /**
   * Get the type of client being used
   * @returns The client type (browser, server, or admin)
   */
  getClientType(): SupabaseClientType {
    return this.clientType;
  }
}
