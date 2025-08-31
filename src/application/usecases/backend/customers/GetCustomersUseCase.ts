import type { CustomerDTO, CustomersDataDTO, CustomerStatsDTO } from '@/src/application/dtos/backend/CustomersDTO';
import type { CustomerEntity, CustomerStatsEntity } from '@/src/domain/entities/backend/backend-customer.entity';
import type { Logger } from '@/src/domain/interfaces/logger';
import type { PaginationParams } from '@/src/domain/interfaces/pagination-types';
import type { BackendCustomerRepository } from '@/src/domain/repositories/backend/backend-customer-repository';

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
        totalCount: paginatedCustomers.pagination.totalItems,
        currentPage: paginatedCustomers.pagination.currentPage,
        perPage: paginatedCustomers.pagination.itemsPerPage
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
      dateOfBirth: entity.dateOfBirth || undefined,
      gender: entity.gender || undefined,
      address: entity.address || undefined,
      totalQueues: entity.totalQueues,
      totalPoints: entity.totalPoints,
      membershipTier: entity.membershipTier,
      lastVisit: entity.lastVisit || undefined,
      notes: entity.notes || undefined,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  private mapCustomerStatsEntityToDTO(entity: CustomerStatsEntity): CustomerStatsDTO {
    return {
      totalCustomers: entity.totalCustomers,
      newCustomersThisMonth: entity.newCustomersThisMonth,
      activeCustomersToday: entity.activeCustomersToday,
      goldMembers: entity.goldMembers,
      silverMembers: entity.silverMembers,
      bronzeMembers: entity.bronzeMembers,
      regularMembers: entity.regularMembers
    };
  }
}
