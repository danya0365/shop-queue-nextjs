import type { CustomerDTO, CustomersDataDTO, CustomerStatsDTO } from '@/src/application/dtos/backend/CustomersDTO';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { BackendCustomerRepository } from '@/src/domain/repositories/backend/backend-customer-repository';
import type { CustomerEntity, CustomerStatsEntity } from '@/src/domain/entities/backend/backend-customer.entity';
import type { PaginationParams } from '@/src/domain/interfaces/pagination-types';

export interface GetCustomersUseCaseParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IGetCustomersUseCase {
  execute(params: GetCustomersUseCaseParams): Promise<CustomersDataDTO>;
}

export class GetCustomersUseCase implements IGetCustomersUseCase {
  constructor(
    private readonly customerRepository: BackendCustomerRepository,
    private readonly logger: Logger
  ) { }

  async execute(params: GetCustomersUseCaseParams): Promise<CustomersDataDTO> {
    try {
      this.logger.info('GetCustomersUseCase: Getting customers data');
      
      const paginationParams: PaginationParams = {
        page: params.page || 1,
        limit: params.limit || 10
      };

      const paginatedCustomers = await this.customerRepository.getPaginatedCustomers(paginationParams);
      const stats = await this.customerRepository.getCustomerStats();

      // Map domain entities to DTOs
      const customerDTOs: CustomerDTO[] = paginatedCustomers.data.map(this.mapCustomerEntityToDTO);
      const statsDTOs: CustomerStatsDTO = this.mapCustomerStatsEntityToDTO(stats);

      const customersData: CustomersDataDTO = {
        customers: customerDTOs,
        stats: statsDTOs,
        total_count: paginatedCustomers.pagination.totalItems,
        current_page: paginatedCustomers.pagination.currentPage,
        per_page: paginatedCustomers.pagination.itemsPerPage
      };

      this.logger.info('GetCustomersUseCase: Successfully retrieved customers data', {
        totalCount: paginatedCustomers.pagination.totalItems
      });
      
      return customersData;
    } catch (error) {
      this.logger.error('GetCustomersUseCase: Error getting customers data', { error });
      throw error;
    }
  }

  private mapCustomerEntityToDTO(entity: CustomerEntity): CustomerDTO {
    return {
      id: entity.id,
      name: entity.name,
      phone: entity.phone || undefined,
      email: entity.email || undefined,
      date_of_birth: entity.dateOfBirth || undefined,
      gender: entity.gender || undefined,
      address: entity.address || undefined,
      total_queues: entity.totalQueues,
      total_points: entity.totalPoints,
      membership_tier: entity.membershipTier,
      last_visit: entity.lastVisit || undefined,
      notes: entity.notes || undefined,
      is_active: entity.isActive,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt
    };
  }

  private mapCustomerStatsEntityToDTO(entity: CustomerStatsEntity): CustomerStatsDTO {
    return {
      total_customers: entity.totalCustomers,
      new_customers_this_month: entity.newCustomersThisMonth,
      active_customers_today: entity.activeCustomersToday,
      gold_members: entity.goldMembers,
      silver_members: entity.silverMembers,
      bronze_members: entity.bronzeMembers,
      regular_members: entity.regularMembers
    };
  }
}
