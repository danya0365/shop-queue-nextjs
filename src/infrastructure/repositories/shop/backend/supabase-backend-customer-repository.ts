import { CustomerEntity, CustomerStatsEntity, MembershipTier, PaginatedCustomersEntity } from "@/src/domain/entities/shop/backend/backend-customer.entity";
import { DatabaseDataSource, QueryOptions, SortDirection } from "@/src/domain/interfaces/datasources/database-datasource";
import { Logger } from "@/src/domain/interfaces/logger";
import { PaginationParams } from "@/src/domain/interfaces/pagination-types";
import { ShopBackendCustomerError, ShopBackendCustomerErrorType, ShopBackendCustomerRepository } from "@/src/domain/repositories/shop/backend/backend-customer-repository";
import { SupabaseShopBackendCustomerMapper } from "@/src/infrastructure/mappers/shop/backend/supabase-backend-customer.mapper";
import { CustomerSchema, CustomerStatsSchema } from "@/src/infrastructure/schemas/shop/backend/customer.schema";
import { StandardRepository } from "../../base/standard-repository";

// Extended types for joined data
type CustomerWithJoinedData = CustomerSchema & {
  queue_history?: { count?: number };
  customer_points?: { total_points?: number; membership_tier?: string };
};
type CustomerSchemaRecord = Record<string, unknown> & CustomerSchema;
type CustomerStatsSchemaRecord = Record<string, unknown> & CustomerStatsSchema;

/**
 * Supabase implementation of the customer repository
 * Following Clean Architecture principles for repository implementation
 */
export class SupabaseShopBackendCustomerRepository extends StandardRepository implements ShopBackendCustomerRepository {
  constructor(
    dataSource: DatabaseDataSource,
    logger: Logger
  ) {
    super(dataSource, logger, "ShopBackendCustomer");
  }

  /**
   * Get paginated customers data from database
   * @param params Pagination parameters
   * @returns Paginated customers data
   */
  async getPaginatedCustomers(params: PaginationParams): Promise<PaginatedCustomersEntity> {
    try {
      const { page, limit } = params;
      const offset = (page - 1) * limit;

      // Use getAdvanced with proper QueryOptions format
      const queryOptions: QueryOptions = {
        select: ['*'],
        joins: [
          { table: 'queues', on: { fromField: 'id', toField: 'customer_id' } },
          { table: 'customer_points', on: { fromField: 'id', toField: 'customer_id' } }
        ],
        sort: [{ field: 'created_at', direction: SortDirection.DESC }],
        pagination: {
          limit,
          offset
        }
      };

      // Use extended type that satisfies Record<string, unknown> constraint
      const customers = await this.dataSource.getAdvanced<CustomerSchemaRecord>(
        'customers',
        queryOptions
      );

      // Count total items
      const totalItems = await this.dataSource.count('customers');

      // Map database results to domain entities
      const mappedCustomers = customers.map(customer => {
        // Handle joined data using our CustomerWithJoinedData type
        const customerWithJoinedData = customer as CustomerWithJoinedData;

        const membershipTier = (customerWithJoinedData.customer_points?.membership_tier || 'regular') as MembershipTier;

        const customerWithJoinedFields = {
          ...customer,
          total_queues: customerWithJoinedData.queue_history?.count || 0,
          total_points: customerWithJoinedData.customer_points?.total_points || 0,
          membership_tier: membershipTier
        };
        return SupabaseShopBackendCustomerMapper.toDomain(customerWithJoinedFields);
      });

      // Create pagination metadata
      const pagination = SupabaseShopBackendCustomerMapper.createPaginationMeta(page, limit, totalItems);

      return {
        data: mappedCustomers,
        pagination
      };
    } catch (error) {
      if (error instanceof ShopBackendCustomerError) {
        throw error;
      }

      this.logger.error('Error in getPaginatedCustomers', { error });
      throw new ShopBackendCustomerError(
        ShopBackendCustomerErrorType.UNKNOWN,
        'An unexpected error occurred while fetching customers',
        'getPaginatedCustomers',
        {},
        error
      );
    }
  }

  /**
   * Get customer statistics from database
   * @returns Customer statistics
   */
  async getCustomerStats(): Promise<CustomerStatsEntity> {
    try {
      // Use getAdvanced to fetch statistics data
      const queryOptions: QueryOptions = {
        select: ['*'],
        // No joins needed for stats view
        // No pagination needed, we want all stats
      };

      // Assuming a view exists for customer statistics
      // Use extended type that satisfies Record<string, unknown> constraint
      const statsData = await this.dataSource.getAdvanced<CustomerStatsSchemaRecord>(
        'customer_stats_view',
        queryOptions
      );

      if (!statsData || statsData.length === 0) {
        // If no stats are found, return default values
        return {
          totalCustomers: 0,
          newCustomersThisMonth: 0,
          activeCustomersToday: 0,
          goldMembers: 0,
          silverMembers: 0,
          bronzeMembers: 0,
          regularMembers: 0
        };
      }

      // Map database results to domain entity
      // Assuming the first record contains all stats
      return SupabaseShopBackendCustomerMapper.statsToEntity(statsData[0]);
    } catch (error) {
      if (error instanceof ShopBackendCustomerError) {
        throw error;
      }

      this.logger.error('Error in getCustomerStats', { error });
      throw new ShopBackendCustomerError(
        ShopBackendCustomerErrorType.UNKNOWN,
        'An unexpected error occurred while fetching customer statistics',
        'getCustomerStats',
        {},
        error
      );
    }
  }

  /**
   * Get customer by ID
   * @param id Customer ID
   * @returns Customer entity or null if not found
   */
  async getCustomerById(id: string): Promise<CustomerEntity | null> {
    try {
      // Use getById which is designed for fetching by ID
      // Use extended type that satisfies Record<string, unknown> constraint
      const customer = await this.dataSource.getById<CustomerSchemaRecord>(
        'customers',
        id,
        {
          select: ['*'],
          joins: [
            { table: 'queue_history', on: { fromField: 'id', toField: 'customer_id' } },
            { table: 'customer_points', on: { fromField: 'id', toField: 'customer_id' } }
          ]
        }
      );

      if (!customer) {
        return null;
      }

      // Handle joined data using our CustomerWithJoinedData type
      const customerWithJoinedData = customer as CustomerWithJoinedData;

      const membershipTier = (customerWithJoinedData.customer_points?.membership_tier || 'regular') as MembershipTier;

      const customerWithJoinedFields = {
        ...customer,
        total_queues: customerWithJoinedData.queue_history?.count || 0,
        total_points: customerWithJoinedData.customer_points?.total_points || 0,
        membership_tier: membershipTier
      };

      // Map database result to domain entity
      return SupabaseShopBackendCustomerMapper.toDomain(customerWithJoinedFields);
    } catch (error) {
      if (error instanceof ShopBackendCustomerError) {
        throw error;
      }

      this.logger.error('Error in getCustomerById', { error, id });
      throw new ShopBackendCustomerError(
        ShopBackendCustomerErrorType.UNKNOWN,
        'An unexpected error occurred while fetching customer',
        'getCustomerById',
        { id },
        error
      );
    }
  }

  /**
   * Create a new customer
   * @param customer Customer data to create
   * @returns Created customer entity
   */
  async createCustomer(customer: Omit<CustomerEntity, 'id' | 'createdAt' | 'updatedAt' | 'totalQueues' | 'totalPoints' | 'membershipTier' | 'lastVisit'>): Promise<CustomerEntity> {
    try {
      // Convert domain entity to database schema
      const customerSchema: Partial<CustomerSchema> = {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        date_of_birth: customer.dateOfBirth,
        gender: customer.gender,
        address: customer.address,
        notes: customer.notes,
        is_active: customer.isActive
      };

      // Insert customer into database
      const createdCustomer = await this.dataSource.insert<CustomerSchemaRecord>(
        'customers',
        customerSchema
      );

      // Initialize customer points with default values
      await this.dataSource.insert(
        'customer_points',
        {
          customer_id: createdCustomer.id,
          total_points: 0,
          membership_tier: 'regular'
        }
      );

      // Return the created customer as a domain entity
      return this.getCustomerById(createdCustomer.id) as Promise<CustomerEntity>;
    } catch (error) {
      if (error instanceof ShopBackendCustomerError) {
        throw error;
      }

      this.logger.error('Error in createCustomer', { error, customer });
      throw new ShopBackendCustomerError(
        ShopBackendCustomerErrorType.OPERATION_FAILED,
        'An unexpected error occurred while creating customer',
        'createCustomer',
        { customer },
        error
      );
    }
  }

  /**
   * Update an existing customer
   * @param id Customer ID
   * @param customer Customer data to update
   * @returns Updated customer entity
   */
  async updateCustomer(id: string, customer: Partial<Omit<CustomerEntity, 'id' | 'createdAt' | 'updatedAt' | 'totalQueues' | 'totalPoints' | 'membershipTier' | 'lastVisit'>>): Promise<CustomerEntity> {
    try {
      // Check if customer exists
      const existingCustomer = await this.getCustomerById(id);
      if (!existingCustomer) {
        throw new ShopBackendCustomerError(
          ShopBackendCustomerErrorType.NOT_FOUND,
          `Customer with ID ${id} not found`,
          'updateCustomer',
          { id }
        );
      }

      // Convert domain entity to database schema
      const customerSchema: Partial<CustomerSchema> = {};

      if (customer.name !== undefined) customerSchema.name = customer.name;
      if (customer.phone !== undefined) customerSchema.phone = customer.phone;
      if (customer.email !== undefined) customerSchema.email = customer.email;
      if (customer.dateOfBirth !== undefined) customerSchema.date_of_birth = customer.dateOfBirth;
      if (customer.gender !== undefined) customerSchema.gender = customer.gender;
      if (customer.address !== undefined) customerSchema.address = customer.address;
      if (customer.notes !== undefined) customerSchema.notes = customer.notes;
      if (customer.isActive !== undefined) customerSchema.is_active = customer.isActive;

      // Update customer in database
      await this.dataSource.update<CustomerSchemaRecord>(
        'customers',
        id,
        customerSchema
      );

      // Return the updated customer as a domain entity
      return this.getCustomerById(id) as Promise<CustomerEntity>;
    } catch (error) {
      if (error instanceof ShopBackendCustomerError) {
        throw error;
      }

      this.logger.error('Error in updateCustomer', { error, id, customer });
      throw new ShopBackendCustomerError(
        ShopBackendCustomerErrorType.OPERATION_FAILED,
        'An unexpected error occurred while updating customer',
        'updateCustomer',
        { id, customer },
        error
      );
    }
  }

  /**
   * Delete a customer
   * @param id Customer ID
   * @returns void
   */
  async deleteCustomer(id: string): Promise<void> {
    try {
      // Check if customer exists
      const existingCustomer = await this.getCustomerById(id);
      if (!existingCustomer) {
        throw new ShopBackendCustomerError(
          ShopBackendCustomerErrorType.NOT_FOUND,
          `Customer with ID ${id} not found`,
          'deleteCustomer',
          { id }
        );
      }

      // Delete customer from database
      await this.dataSource.delete('customers', id);
    } catch (error) {
      if (error instanceof ShopBackendCustomerError) {
        throw error;
      }

      this.logger.error('Error in deleteCustomer', { error, id });
      throw new ShopBackendCustomerError(
        ShopBackendCustomerErrorType.OPERATION_FAILED,
        'An unexpected error occurred while deleting customer',
        'deleteCustomer',
        { id },
        error
      );
    }
  }
}
