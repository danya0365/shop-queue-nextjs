import type { CustomerDTO, CustomersDataDTO, CustomerStatsDTO, PaginatedCustomersDTO } from '@/src/application/dtos/shop/backend/customers-dto';
import { IUseCase } from '@/src/application/interfaces/use-case.interface';
import type { CreateCustomerUseCaseInput } from '@/src/application/usecases/shop/backend/customers/CreateCustomerUseCase';
import type { GetCustomersPaginatedUseCaseInput } from '@/src/application/usecases/shop/backend/customers/GetCustomersPaginatedUseCase';
import type { UpdateCustomerUseCaseInput } from '@/src/application/usecases/shop/backend/customers/UpdateCustomerUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IShopBackendCustomersService {
  getCustomersData(page?: number, perPage?: number, searchTerm?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<CustomersDataDTO>;
  getCustomerById(id: string): Promise<CustomerDTO>;
  createCustomer(data: CreateCustomerUseCaseInput): Promise<CustomerDTO>;
  updateCustomer(id: string, data: Omit<UpdateCustomerUseCaseInput, 'id'>): Promise<CustomerDTO>;
  deleteCustomer(id: string): Promise<boolean>;
}

export class ShopBackendCustomersService implements IShopBackendCustomersService {
  constructor(
    private readonly getCustomersPaginatedUseCase: IUseCase<GetCustomersPaginatedUseCaseInput, PaginatedCustomersDTO>,
    private readonly getCustomerStatsUseCase: IUseCase<void, CustomerStatsDTO>,
    private readonly getCustomerByIdUseCase: IUseCase<string, CustomerDTO>,
    private readonly createCustomerUseCase: IUseCase<CreateCustomerUseCaseInput, CustomerDTO>,
    private readonly updateCustomerUseCase: IUseCase<UpdateCustomerUseCaseInput, CustomerDTO>,
    private readonly deleteCustomerUseCase: IUseCase<string, boolean>,
    private readonly logger: Logger
  ) { }

  async getCustomersData(page: number = 1, perPage: number = 10, searchTerm?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<CustomersDataDTO> {
    try {
      // Get customers and stats in parallel
      const [customersResult, stats] = await Promise.all([
        this.getCustomersPaginatedUseCase.execute({
          page,
          perPage,
          searchTerm,
          sortBy,
          sortOrder
        }),
        this.getCustomerStatsUseCase.execute()
      ]);

      this.logger.info('ShopBackendCustomersService: Successfully retrieved customers data');

      return {
        customers: customersResult.data,
        stats,
        totalCount: customersResult.pagination.totalItems,
        currentPage: customersResult.pagination.currentPage,
        perPage: customersResult.pagination.itemsPerPage
      };
    } catch (error) {
      this.logger.error('ShopBackendCustomersService: Error getting customers data', { error, page, perPage });
      throw error;
    }
  }

  async getCustomerById(id: string): Promise<CustomerDTO> {
    try {
      this.logger.info('ShopBackendCustomersService: Getting customer by ID', { id });

      const customer = await this.getCustomerByIdUseCase.execute(id);

      this.logger.info('ShopBackendCustomersService: Successfully retrieved customer', { id });
      return customer;
    } catch (error) {
      this.logger.error('ShopBackendCustomersService: Error getting customer by ID', { error, id });
      throw error;
    }
  }

  async createCustomer(data: CreateCustomerUseCaseInput): Promise<CustomerDTO> {
    try {
      this.logger.info('ShopBackendCustomersService: Creating customer', { name: data.name });

      const customer = await this.createCustomerUseCase.execute(data);

      this.logger.info('ShopBackendCustomersService: Successfully created customer', { id: customer.id });
      return customer;
    } catch (error) {
      this.logger.error('ShopBackendCustomersService: Error creating customer', { error, data });
      throw error;
    }
  }

  async updateCustomer(id: string, data: Omit<UpdateCustomerUseCaseInput, 'id'>): Promise<CustomerDTO> {
    try {
      this.logger.info('ShopBackendCustomersService: Updating customer', { id });

      const customer = await this.updateCustomerUseCase.execute({ id, ...data });

      this.logger.info('ShopBackendCustomersService: Successfully updated customer', { id });
      return customer;
    } catch (error) {
      this.logger.error('ShopBackendCustomersService: Error updating customer', { error, id, data });
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      this.logger.info('ShopBackendCustomersService: Deleting customer', { id });

      const result = await this.deleteCustomerUseCase.execute(id);

      this.logger.info('ShopBackendCustomersService: Successfully deleted customer', { id });
      return result;
    } catch (error) {
      this.logger.error('ShopBackendCustomersService: Error deleting customer', { error, id });
      throw error;
    }
  }
}
