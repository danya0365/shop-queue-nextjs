
import type { CustomerDTO, CustomersDataDTO } from '@/src/application/dtos/backend/customers-dto';
import type { ICreateCustomerUseCase } from '@/src/application/usecases/backend/customers/CreateCustomerUseCase';
import type { IDeleteCustomerUseCase } from '@/src/application/usecases/backend/customers/DeleteCustomerUseCase';
import type { IGetCustomerByIdUseCase } from '@/src/application/usecases/backend/customers/GetCustomerByIdUseCase';
import type { IGetCustomersUseCase } from '@/src/application/usecases/backend/customers/GetCustomersUseCase';
import type { IUpdateCustomerUseCase } from '@/src/application/usecases/backend/customers/UpdateCustomerUseCase';
import type { Logger } from '@/src/domain/interfaces/logger';

export interface IBackendCustomersService {
  getCustomersData(params?: { page?: number; limit?: number; searchTerm?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }): Promise<CustomersDataDTO>;
  getCustomerById(id: string): Promise<CustomerDTO>;
  createCustomer(data: { name: string; phone?: string; email?: string; dateOfBirth?: string; gender?: 'male' | 'female' | 'other'; address?: string; notes?: string; isActive?: boolean }): Promise<CustomerDTO>;
  updateCustomer(id: string, data: { name?: string; phone?: string | null; email?: string | null; dateOfBirth?: string | null; gender?: 'male' | 'female' | 'other' | null; address?: string | null; notes?: string | null; isActive?: boolean }): Promise<CustomerDTO>;
  deleteCustomer(id: string): Promise<void>;
}

export class BackendCustomersService implements IBackendCustomersService {
  constructor(
    private readonly getCustomersUseCase: IGetCustomersUseCase,
    private readonly getCustomerByIdUseCase: IGetCustomerByIdUseCase,
    private readonly createCustomerUseCase: ICreateCustomerUseCase,
    private readonly updateCustomerUseCase: IUpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: IDeleteCustomerUseCase,
    private readonly logger: Logger
  ) { }

  async getCustomersData(params?: { page?: number; limit?: number; searchTerm?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }): Promise<CustomersDataDTO> {
    try {
      this.logger.info('BackendCustomersService: Getting customers data');

      const customersData = await this.getCustomersUseCase.execute(params || {});

      this.logger.info('BackendCustomersService: Successfully retrieved customers data');
      return customersData;
    } catch (error) {
      this.logger.error('BackendCustomersService: Error getting customers data', { error });
      throw error;
    }
  }

  async getCustomerById(id: string): Promise<CustomerDTO> {
    try {
      this.logger.info('BackendCustomersService: Getting customer by ID', { id });

      const customer = await this.getCustomerByIdUseCase.execute({ id });

      this.logger.info('BackendCustomersService: Successfully retrieved customer', { id });
      return customer;
    } catch (error) {
      this.logger.error('BackendCustomersService: Error getting customer by ID', { error, id });
      throw error;
    }
  }

  async createCustomer(data: { name: string; phone?: string; email?: string; dateOfBirth?: string; gender?: 'male' | 'female' | 'other'; address?: string; notes?: string; isActive?: boolean }): Promise<CustomerDTO> {
    try {
      this.logger.info('BackendCustomersService: Creating customer', { name: data.name });

      const customer = await this.createCustomerUseCase.execute(data);

      this.logger.info('BackendCustomersService: Successfully created customer', { id: customer.id });
      return customer;
    } catch (error) {
      this.logger.error('BackendCustomersService: Error creating customer', { error, data });
      throw error;
    }
  }

  async updateCustomer(id: string, data: { name?: string; phone?: string | null; email?: string | null; dateOfBirth?: string | null; gender?: 'male' | 'female' | 'other' | null; address?: string | null; notes?: string | null; isActive?: boolean }): Promise<CustomerDTO> {
    try {
      this.logger.info('BackendCustomersService: Updating customer', { id });

      const customer = await this.updateCustomerUseCase.execute({ id, ...data });

      this.logger.info('BackendCustomersService: Successfully updated customer', { id });
      return customer;
    } catch (error) {
      this.logger.error('BackendCustomersService: Error updating customer', { error, id, data });
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      this.logger.info('BackendCustomersService: Deleting customer', { id });

      await this.deleteCustomerUseCase.execute({ id });

      this.logger.info('BackendCustomersService: Successfully deleted customer', { id });
    } catch (error) {
      this.logger.error('BackendCustomersService: Error deleting customer', { error, id });
      throw error;
    }
  }
}
